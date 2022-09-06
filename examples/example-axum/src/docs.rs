use std::sync::Arc;

use aide::{
    axum::{
        routing::{get, get_with},
        ApiRouter,
    },
    openapi::OpenApi,
};
use axum::{
    extract::OriginalUri,
    response::{Html, IntoResponse},
    Extension,
};

use crate::{extractors::Json, state::AppState};

pub fn docs_routes(state: AppState) -> ApiRouter<AppState> {
    ApiRouter::with_state(state)
        .api_route(
            "/",
            get_with(serve_redoc, |op| {
                op.description("This documentation page.")
                    .response::<200, Html<()>>()
            }),
        )
        .route("/private/api.json", get(serve_docs))
}

async fn serve_redoc(uri: OriginalUri) -> impl IntoResponse {
    let api_json_url = uri.0.to_string() + "/private/api.json";

    Html(format!(
        r#"<!DOCTYPE html>
<html>
    <head>
    <title>Aide axum Todo</title>
    <!-- needed for adaptive design -->
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">

    <!--
    Redoc doesn't change outer page styles
    -->
    <style>
        body {{
        margin: 0;
        padding: 0;
        }}
    </style>
    </head>
    <body>
    <redoc spec-url='{api_json_url}'></redoc>
    <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"> </script>
    </body>
</html>
"#
    ))
}

async fn serve_docs(Extension(api): Extension<Arc<OpenApi>>) -> impl IntoResponse {
    Json(api)
}
