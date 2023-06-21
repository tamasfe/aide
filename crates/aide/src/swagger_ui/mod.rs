#![cfg_attr(docsrs, feature(doc_auto_cfg))]
//! A simple crate providing a new trait for
//! [aide](https://docs.rs/aide/latest/aide/). This trait
//! serves the provided OpenAPI definition at the specified
//! path. It also creates a service serving the bundled Swagger-UI

use std::path::PathBuf;

use axum::{Extension, Json, Router, routing::get, handler::Handler, extract::State};
use crate::openapi::OpenApi;
use tower_http::services::ServeDir;


pub trait SwaggerUiRouter {
  fn route_api_and_swagger_ui_from_root(self, path: &str, open_api: OpenApi) -> Self;
}

impl SwaggerUiRouter for Router {
    fn route_api_and_swagger_ui_from_root(self, path: &str, open_api: OpenApi) -> Self {
      let swagger_ui_dist_path: PathBuf = [
        env!("AIDE_SWAGGER_UI_DIR"),
        env!("AIDE_SWAGGER_UI_VERSION"),
        "dist"
      ].iter().collect();
      self
        .nest_service("/swagger-ui/swagger-initializer.js", swagger_ui_config.with_state(path.to_owned()))
        .nest_service("/swagger-ui", ServeDir::new(swagger_ui_dist_path))
        .route(path, get(serve_api))
        .layer(Extension(open_api))
    }
}

async fn swagger_ui_config(State(path): State<String>) -> String {
  r#"window.onload = function() {
    window.ui = SwaggerUIBundle({
      url: ""#.to_owned() + &path + r#"",
      dom_id: '#swagger-ui',
      deepLinking: true,
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIStandalonePreset
      ],
      plugins: [
        SwaggerUIBundle.plugins.DownloadUrl
      ],
      layout: "StandaloneLayout"
    });
  };"#
}

async fn serve_api(Extension(api): Extension<OpenApi>) -> Json<OpenApi> {
  Json(api)
}
