//! Generate [Redoc] ui. This feature requires the `axum` feature.
//!
//! ## Example:
//!
//! ```no_run
//! // Replace some of the `axum::` types with `aide::axum::` ones.
//! use aide::{
//!     axum::{
//!         routing::{get, post},
//!         ApiRouter, IntoApiResponse,
//!     },
//!     openapi::{Info, OpenApi},
//!     redoc::Redoc,
//! };
//! use axum::{Extension, Json};
//! use schemars::JsonSchema;
//! use serde::Deserialize;
//!
//! // We'll need to derive `JsonSchema` for
//! // all types that appear in the api documentation.
//! #[derive(Deserialize, JsonSchema)]
//! struct User {
//!     name: String,
//! }
//!
//! async fn hello_user(Json(user): Json<User>) -> impl IntoApiResponse {
//!     format!("hello {}", user.name)
//! }
//!
//! // Note that this clones the document on each request.
//! // To be more efficient, we could wrap it into an Arc,
//! // or even store it as a serialized string.
//! async fn serve_api(Extension(api): Extension<OpenApi>) -> impl IntoApiResponse {
//!     Json(api)
//! }
//!
//! #[tokio::main]
//! async fn main() {
//!     let app = ApiRouter::new()
//!         // generate redoc-ui using the openapi spec route
//!         .route("/redoc", Redoc::new("/api.json").axum_route())
//!         // Change `route` to `api_route` for the route
//!         // we'd like to expose in the documentation.
//!         .api_route("/hello", post(hello_user))
//!         // We'll serve our generated document here.
//!         .route("/api.json", get(serve_api));
//!
//!     let mut api = OpenApi {
//!         info: Info {
//!             description: Some("an example API".to_string()),
//!             ..Info::default()
//!         },
//!         ..OpenApi::default()
//!     };
//!
//!     axum::Server::bind(&"0.0.0.0:3000".parse().unwrap())
//!         .serve(
//!             app
//!                 // Generate the documentation.
//!                 .finish_api(&mut api)
//!                 // Expose the documentation to the handlers.
//!                 .layer(Extension(api))
//!                 .into_make_service(),
//!         )
//!         .await
//!         .unwrap();
//! }
//! ```

/// A wrapper to embed [Redoc](https://redocly.com/) in your app.
pub struct Redoc {
    spec_url: String,
}

impl Redoc {
    /// Create a new [`Redoc`] wrapper with the given spec url.
    pub fn new<S: ToString>(spec_url: S) -> Self {
        Self {
            spec_url: spec_url.to_string(),
        }
    }

    /// Build the redoc-ui html page.
    pub fn html(&self) -> String {
        format!(
            r#"
<!-- HTML for static distribution bundle build -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Redoc</title>
    <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"> </script>
  </head>

  <body>
    <div id="redoc-container"></div>
    <script>
       Redoc.init("{spec_url}", {{
            scrollYOffset: 50
       }}, document.getElementById('redoc-container'))
    </script>
  </body>
</html>
"#,
            spec_url = self.spec_url
        )
    }
}

#[cfg(feature = "axum")]
mod axum_impl {
    use crate::axum::routing::{get, ApiMethodRouter};
    use axum::response::Html;

    impl super::Redoc {
        /// Returns an [`ApiMethodRouter`] to expose the Redoc UI.
        ///
        /// ## Example
        /// ```rust, no_run
        ///     ApiRouter::new()
        ///         .route("/docs", Redoc::new("/openapi.json").axum_route())
        ///         .route("/openapi.json", get(route::openapi::serve_api))
        /// ```
        pub fn axum_route(&self) -> ApiMethodRouter {
            let html = self.html();
            get(move || async { Html(html) })
        }
    }
}
