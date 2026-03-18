use std::sync::Arc;

use aide::{
    axum::{routing::post_with, ApiRouter, IntoApiResponse},
    openapi::OpenApi,
};
use axum::{Extension, Json};
use axum_typed_multipart::TryFromMultipart;
use schemars::JsonSchema;
use tokio::net::TcpListener;

// Can be replaced with `aide_axum_typed_multipart_2::TypedMultipart` once
// the crate is updated to aide 0.16 + schemars 1.x.
mod multipart;
use multipart::DocTypedMultipart;

#[derive(TryFromMultipart, JsonSchema)]
struct UploadForm {
    /// A description of the uploaded file.
    description: String,
    /// The file to upload (max 5 MiB).
    #[form_data(limit = "5MiB")]
    #[schemars(with = "Vec<u8>")]
    file: axum::body::Bytes,
}

async fn upload(DocTypedMultipart(form): DocTypedMultipart<UploadForm>) -> impl IntoApiResponse {
    Json(serde_json::json!({
        "description": form.description,
        "size": form.file.len(),
    }))
}

async fn serve_api(Extension(api): Extension<Arc<OpenApi>>) -> impl IntoApiResponse {
    Json(api.as_ref().clone())
}

#[tokio::main]
async fn main() {
    aide::generate::extract_schemas(true);

    let mut api = OpenApi::default();

    let app = ApiRouter::new()
        .api_route(
            "/upload",
            post_with(upload, |op| {
                op.description("Upload a file with a description.")
                    .response_with::<200, Json<serde_json::Value>, _>(|res| {
                        res.description("Upload result with file size")
                    })
            }),
        )
        .route("/api.json", axum::routing::get(serve_api))
        .finish_api_with(&mut api, |api| {
            api.title("Multipart Upload Example")
                .summary("Demonstrates typed multipart/form-data with aide")
        })
        .layer(Extension(Arc::new(api)));

    println!("Docs available at http://127.0.0.1:3000/api.json");

    let listener = TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
