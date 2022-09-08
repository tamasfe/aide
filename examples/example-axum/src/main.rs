use std::sync::Arc;

use aide::{
    axum::ApiRouter,
    openapi::{Info, OpenApi, Tag},
    transform::TransformOpenApi,
};
use axum::{http::StatusCode, Extension};
use docs::docs_routes;
use errors::AppError;
use extractors::Json;
use state::AppState;
use todos::routes::todo_routes;
use uuid::Uuid;

pub mod docs;
pub mod errors;
pub mod extractors;
pub mod state;
pub mod todos;

#[tokio::main]
async fn main() {
    aide::gen::on_error(|error| {
        println!("{error}");
    });

    aide::gen::extract_schemas(true);

    let state = AppState::default();

    let mut api = OpenApi::default();

    let app = ApiRouter::with_state(state.clone())
        .nest("/todo", todo_routes(state.clone()))
        .nest("/docs", docs_routes(state))
        .finish_api_with(&mut api, api_docs)
        .layer(Extension(Arc::new(api)));

    axum::Server::bind(&"0.0.0.0:3000".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}

fn api_docs(mut api: TransformOpenApi) -> TransformOpenApi {
    let inner = api.inner_mut();

    inner.info = Info {
        title: "Aide axum Open API".into(),
        description: Some("An example Todo application".into()),
        ..Default::default()
    };

    api.title("Aide axum Open API")
        .summary("An example Todo application")
        .description(include_str!("api.md"))
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
