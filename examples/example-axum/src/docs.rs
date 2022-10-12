use std::sync::Arc;

use aide::{
    axum::{
        routing::{get, get_with},
        ApiRouter, IntoApiResponse,
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
    // We infer the return types for these routes
    // as an example.
    //
    // As a result, the `serve_redoc` route will
    // have the `text/html` content-type correctly set
    // with a 200 status.
    aide::gen::infer_responses(true);

    let router = ApiRouter::with_state(state)
        .api_route_with(
            "/",
            get_with(serve_redoc, |op| op.description("This documentation page.")),
            |p| p.security_requirement("ApiKey"),
        )
        .route("/private/api.json", get(serve_docs));

    // Afterwards we disable response inference because
    // it might be incorrect for other routes.
    aide::gen::infer_responses(false);

    router
}

async fn serve_redoc(uri: OriginalUri) -> impl IntoApiResponse {
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

async fn serve_docs(Extension(api): Extension<Arc<OpenApi>>) -> impl IntoApiResponse {
    Json(api).into_response()
}
