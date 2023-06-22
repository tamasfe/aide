#![cfg_attr(docsrs, feature(doc_auto_cfg))]
//! A simple crate providing a new trait for
//! [aide](https://docs.rs/aide/latest/aide/). This trait
//! serves the provided OpenAPI definition at the specified
//! path. It also creates a service serving the bundled Swagger-UI
use axum::{Extension, Json, response::IntoResponse, Router, routing::get, handler::Handler, extract::State};
use http::header::CONTENT_TYPE;
use crate::openapi::OpenApi;



/// This trait provide a single method in axum's builder pattern
/// SwaggerUI is served on the path `/swagger-ui`
/// 
/// Example:
/// ```rust
/// use aide::{openapi::OpenApi, axum::ApiRouter};
/// let server = ApiRouter::new();
/// let mut api = OpenApi {
///     ..OpenApi::default()
/// };
/// Server::bind(&"0.0.0.0:6767".parse().expect("Please provide a valid listening address"))
///     .serve(server
///         .finish_api(&mut api)
///         // This is the method specified by this trait
///         .route_api_and_swagger_ui_from_root("/api-docs/openapi.json", api)
///         .into_make_service()
///     )
///     .await
///     .unwrap();
/// ```
pub trait SwaggerUiRouter {
  /// Serves the OpenAPI definition as a JSON on the provided `path`.
  /// 
  /// SwaggerUI is served on the path `/swagger-ui/`
  fn route_api_and_swagger_ui_from_root(self, path: &str, open_api: OpenApi) -> Self;
}

/// Creates an async fn which returns the file content 
/// tagged with the specified MIME type
macro_rules! get_file_content {
  ($func_name:ident, $path:expr, $mime_type:expr) => {
    async fn $func_name () -> impl IntoResponse {
      (
        [(CONTENT_TYPE, $mime_type)], 
        include_bytes!(
          concat!("../../res/swagger-ui/swagger-ui-5.1.0/dist/", $path)
        )
      )
    }
  };
}

get_file_content!(favicon_16, "favicon-16x16.png", "image/png");
get_file_content!(favicon_32, "favicon-32x32.png", "image/png");
get_file_content!(index_css, "index.css", "text/css");
get_file_content!(index_html, "index.html", "text/html");
get_file_content!(oauth_2, "oauth2-redirect.html", "text/html");
get_file_content!(bundle, "swagger-ui-bundle.js", "text/javascript");
get_file_content!(es_bundle_core, "swagger-ui-es-bundle-core.js", "text/javascript");
get_file_content!(es_bundle, "swagger-ui-es-bundle.js", "text/javascript");
get_file_content!(standalone, "swagger-ui-standalone-preset.js", "text/javascript");
get_file_content!(swagger_ui_css, "swagger-ui.css", "text/css");
get_file_content!(swagger_ui_js, "swagger-ui.js", "text/javascript");

impl SwaggerUiRouter for Router {
    fn route_api_and_swagger_ui_from_root(self, path: &str, open_api: OpenApi) -> Self {
      self
        .route(concat!("/swagger-ui/", "favicon-16x16.png"), get(favicon_16))
        .route(concat!("/swagger-ui/", "favicon-32x32.png"), get(favicon_32))
        .route(concat!("/swagger-ui/", "index.css"), get(index_css))
        .route(concat!("/swagger-ui/", "index.html"), get(index_html))
        .route(concat!("/swagger-ui/", "oauth2-redirect.html"), get(oauth_2))
        .route(concat!("/swagger-ui/", "swagger-ui-bundle.js"), get(bundle))
        .route(concat!("/swagger-ui/", "swagger-ui-es-bundle-core.js"), get(es_bundle_core))
        .route(concat!("/swagger-ui/", "swagger-ui-es-bundle.js"), get(es_bundle))
        .route(concat!("/swagger-ui/", "swagger-ui-standalone-preset.js"), get(standalone))
        .route(concat!("/swagger-ui/", "swagger-ui.css"), get(swagger_ui_css))
        .route(concat!("/swagger-ui/", "swagger-ui.js"), get(swagger_ui_js))
        .route("/swagger-ui/", get(index_html))
        .nest_service("/swagger-ui/swagger-initializer.js", swagger_ui_config.with_state(path.to_owned()))
        .route(path, get(serve_api))
        .layer(Extension(open_api))
    }
}

async fn swagger_ui_config(State(path): State<String>) -> impl IntoResponse {
  (
    [(CONTENT_TYPE, "text/javascript")], 
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
  )
}

async fn serve_api(Extension(api): Extension<OpenApi>) -> Json<OpenApi> {
  Json(api)
}
