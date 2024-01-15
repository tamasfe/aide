//! Generate [Scalar] API References. This feature requires the `axum` feature.
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
//!     scalar::Scalar,
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
//!         // generate Scalar API References using the openapi spec route
//!         .route("/scalar", Scalar::new("/api.json").axum_route())
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
//!     let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
//!
//!     axum::serve(
//!         listener,
//!         app
//!             // Generate the documentation.
//!             .finish_api(&mut api)
//!             // Expose the documentation to the handlers.
//!             .layer(Extension(api))
//!             .into_make_service(),
//!     )
//!     .await
//!     .unwrap();
//! }
//! ```

/// A wrapper to embed [Scalar](https://github.com/scalar/scalar) in your app.
#[must_use]
pub struct Scalar {
    title: String,
    spec_url: String,
}

impl Scalar {
    /// Create a new [`Scalar`] wrapper with the given spec url.
    pub fn new(spec_url: impl Into<String>) -> Self {
        Self {
            title: "Scalar".into(),
            spec_url: spec_url.into(),
        }
    }

    /// Set the title of the Scalar page.
    pub fn with_title(mut self, title: &str) -> Self {
        self.title = title.into();
        self
    }

    /// Build the Scalar API References html page.
    #[must_use]
    pub fn html(&self) -> String {
        format!(
            r#"<!DOCTYPE html>
            <!doctype html>
            <html>
              <head>
                <title>{title}</title>
                <meta charset="utf-8" />
                <meta
                  name="viewport"
                  content="width=device-width, initial-scale=1" />
                <style>
                  body {{
                    margin: 0;
                  }}
                </style>
              </head>
              <body>
                <script
                  id="api-reference"></script>
                <script>
                  var configuration = {{
                    theme: 'purple',
                    customCss: `{scalar_css}`,
                    spec: {{
                        url: '{spec_url}'
                    }}
                  }}
            
                  var apiReference = document.getElementById('api-reference')
                  apiReference.dataset.configuration = JSON.stringify(configuration)
                </script>
                <script>
                    {scalar_js}
                </script>
              </body>
            </html>
"#,
            scalar_js = include_str!("../../res/scalar/scalar.standalone.min.js"),
            scalar_css = include_str!("../../res/scalar/rust-theme.css"),
            title = self.title,
            spec_url = self.spec_url
        )
    }
}

#[cfg(feature = "axum")]
mod axum_impl {
    use crate::axum::{
        routing::{get, ApiMethodRouter},
        AxumOperationHandler,
    };
    use crate::scalar::get_static_str;
    use axum::response::Html;

    impl super::Scalar {
        /// Returns an [`ApiMethodRouter`] to expose the Scalar API References.
        ///
        /// # Examples
        ///
        /// ```
        /// # use aide::axum::{ApiRouter, routing::get};
        /// # use aide::scalar::Scalar;
        /// ApiRouter::<()>::new()
        ///     .route("/docs", Scalar::new("/openapi.json").axum_route());
        /// ```
        pub fn axum_route<S>(&self) -> ApiMethodRouter<S>
        where
            S: Clone + Send + Sync + 'static,
        {
            get(self.axum_handler())
        }

        /// Returns an axum [`Handler`](axum::handler::Handler) that can be used
        /// with API routes.
        ///
        /// # Examples
        ///
        /// ```
        /// # use aide::axum::{ApiRouter, routing::get_with};
        /// # use aide::scalar::Scalar;
        /// ApiRouter::<()>::new().api_route(
        ///     "/docs",
        ///     get_with(Scalar::new("/openapi.json").axum_handler(), |op| {
        ///         op.description("This documentation page.")
        ///     }),
        /// );
        /// ```
        #[must_use]
        pub fn axum_handler<S>(
            &self,
        ) -> impl AxumOperationHandler<(), Html<&'static str>, ((),), S> {
            let html = self.html();
            // This string will be used during the entire lifetime of the program
            // so it's safe to leak it
            // we can't use once_cell::sync::Lazy because it will cache the first access to the function,
            // so you won't be able to have multiple instances of Scalar
            // e.g. /v1/docs and /v2/docs
            // Without caching we will have to clone whole html string on each request
            // which will use 3GiBs of RAM for 200+ concurrent requests
            let html: &'static str = get_static_str(html);

            move || async move { Html(html) }
        }
    }
}

fn get_static_str(string: String) -> &'static str {
    let static_str = Box::leak(string.into_boxed_str());
    static_str
}
