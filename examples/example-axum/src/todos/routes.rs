use aide::{
    axum::{
        routing::{get_with, post_with, put_with},
        ApiRouter,
    },
    transform::TransformOperation,
};
use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::{extractors::Json, state::AppState};

use super::TodoItem;

pub fn todo_routes(state: AppState) -> ApiRouter<AppState> {
    ApiRouter::with_state(state)
        .api_route(
            "/",
            post_with(create_todo, create_todo_docs).get_with(list_todos, list_todos_docs),
        )
        .api_route(
            "/:id",
            get_with(get_todo, get_todo_docs).delete_with(delete_todo, delete_todo_docs),
        )
        .api_route("/:id/complete", put_with(complete_todo, complete_todo_docs))
}

/// New Todo details.
#[derive(Deserialize, JsonSchema)]
struct NewTodo {
    /// The description for the new Todo.
    description: String,
}

/// New Todo details.
#[derive(Serialize, JsonSchema)]
struct TodoCreated {
    /// The ID of the new Todo.
    id: Uuid,
}

async fn create_todo(State(app): State<AppState>, Json(todo): Json<NewTodo>) -> impl IntoResponse {
    let id = Uuid::new_v4();
    app.todos.lock().unwrap().insert(
        id,
        TodoItem {
            complete: false,
            description: todo.description,
            id,
        },
    );

    (StatusCode::CREATED, Json(TodoCreated { id }))
}

fn create_todo_docs(op: TransformOperation) -> TransformOperation {
    op.description("Create a new incomplete Todo item.")
        .response::<204, Json<TodoCreated>>()
}

#[derive(Serialize, JsonSchema)]
struct TodoList {
    todo_ids: Vec<Uuid>,
}

async fn list_todos(State(app): State<AppState>) -> impl IntoResponse {
    Json(TodoList {
        todo_ids: app.todos.lock().unwrap().keys().copied().collect(),
    })
}

fn list_todos_docs(op: TransformOperation) -> TransformOperation {
    op.description("List all Todo items.")
        .response::<200, Json<TodoList>>()
}

#[derive(Deserialize, JsonSchema)]
struct SelectTodo {
    /// The ID of the Todo.
    id: Uuid,
}

async fn get_todo(State(app): State<AppState>, Path(todo): Path<SelectTodo>) -> impl IntoResponse {
    if let Some(todo) = app.todos.lock().unwrap().get(&todo.id) {
        Json(todo.clone()).into_response()
    } else {
        StatusCode::NOT_FOUND.into_response()
    }
}

fn get_todo_docs(op: TransformOperation) -> TransformOperation {
    op.description("Get a single Todo item.")
        .response_with::<200, Json<TodoItem>, _>(|res| {
            res.example(TodoItem {
                complete: false,
                description: "fix bugs".into(),
                id: Uuid::nil(),
            })
        })
        .response_with::<404, (), _>(|res| res.description("todo was not found"))
}

async fn delete_todo(
    State(app): State<AppState>,
    Path(todo): Path<SelectTodo>,
) -> impl IntoResponse {
    if app.todos.lock().unwrap().remove(&todo.id).is_some() {
        StatusCode::NO_CONTENT
    } else {
        StatusCode::NOT_FOUND
    }
}

fn delete_todo_docs(op: TransformOperation) -> TransformOperation {
    op.description("Delete a Todo item.")
        .response_with::<204, (), _>(|res| res.description("The Todo has been deleted."))
        .response_with::<404, (), _>(|res| res.description("The todo was not found"))
}

async fn complete_todo(
    State(app): State<AppState>,
    Path(todo): Path<SelectTodo>,
) -> impl IntoResponse {
    if let Some(todo) = app.todos.lock().unwrap().get_mut(&todo.id) {
        todo.complete = true;
        StatusCode::NO_CONTENT
    } else {
        StatusCode::NOT_FOUND
    }
}

fn complete_todo_docs(op: TransformOperation) -> TransformOperation {
    op.description("Complete a Todo.").response::<204, ()>()
}
