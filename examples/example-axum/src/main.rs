use std::sync::Arc;

use aide::{
    axum::ApiRouter,
    openapi::{OpenApi, Tag},
    transform::TransformOpenApi,
};
use axum::{http::StatusCode, Extension, Json};
use docs::docs_routes;
use errors::AppError;
use state::AppState;
use todos::routes::todo_routes;
use tokio::net::TcpListener;
use uuid::Uuid;

pub mod docs;
pub mod errors;
pub mod state;
pub mod todos;

#[tokio::main]
async fn main() {
    aide::generate::on_error(|error| {
        println!("{error}");
    });

    aide::generate::extract_schemas(true);

    let state = AppState::default();

    let mut api = OpenApi::default();

    let app = ApiRouter::new()
        .nest_api_service("/todo", todo_routes(state.clone()))
        .nest_api_service("/docs", docs_routes(state.clone()))
        .finish_api_with(&mut api, api_docs)
        .layer(Extension(Arc::new(api))) // Arc is very important here or you will face massive memory and performance issues
        .with_state(state);

    println!("Example docs are accessible at http://127.0.0.1:3000/docs");

    let listener = TcpListener::bind("0.0.0.0:3000").await.unwrap();

    axum::serve(listener, app).await.unwrap();
}

fn api_docs(api: TransformOpenApi) -> TransformOpenApi {
    api.title("Aide axum Open API")
        .summary("An example Todo application")
        .description(include_str!("README.md"))
        .tag(Tag {
            name: "todo".into(),
            description: Some("Todo Management".into()),
            ..Default::default()
        })
        .security_scheme(
            "ApiKey",
            aide::openapi::SecurityScheme::ApiKey {
                location: aide::openapi::ApiKeyLocation::Header,
                name: "X-Auth-Key".into(),
                description: Some("A key that is ignored.".into()),
                extensions: Default::default(),
            },
        )
        .default_response_with::<Json<AppError>, _>(|res| {
            res.example(AppError {
                error: "some error happened".to_string(),
                error_details: None,
                error_id: Uuid::nil(),
                // This is not visible.
                status: StatusCode::IM_A_TEAPOT,
            })
        })
}
