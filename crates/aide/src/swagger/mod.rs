//! Generate [Swagger] ui. This feature requires the `axum` feature.
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
//!     swagger::Swagger,
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
//!         // generate swagger-ui using the openapi spec route
//!         .route("/swagger", Swagger::new("/api.json").axum_route())
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

/// A wrapper to embed [Swagger](https://swagger.io/) in your app.
#[must_use]
pub struct Swagger {
    title: String,
    spec_url: String,
}

impl Swagger {
    /// Create a new [`Swagger`] wrapper with the given spec url.
    pub fn new(spec_url: impl Into<String>) -> Self {
        Self {
            title: "Swagger - UI".into(),
            spec_url: spec_url.into(),
        }
    }

    /// Set the title of the Swagger page.
    pub fn with_title(mut self, title: &str) -> Self {
        self.title = title.into();
        self
    }

    /// Build the swagger-ui html page.
    #[must_use]
    pub fn html(&self) -> String {
        format!(
            r#"<!DOCTYPE html>
<html lang="en">
<head>
    <style>{swagger_css}</style>
    <title>{title}</title>
</head>
<body>
<div id="swagger-ui">
</div>
<script>{swagger_js}</script>
<!-- `SwaggerUIBundle` is now available on the page -->
<script>
    const ui = SwaggerUIBundle({{
        url: '{spec_url}',
        "dom_id": "\#swagger-ui",
        "layout": "BaseLayout",
        "deepLinking": true,
        "showExtensions": true,
        "showCommonExtensions": true,
        presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIBundle.SwaggerUIStandalonePreset
        ],
    }})
</script>
</body>
</html>
"#,
            swagger_js = include_str!("../../res/swagger/swagger-ui-bundle.js"),
            swagger_css = include_str!("../../res/swagger/swagger-ui.css"),
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
    use crate::swagger::get_static_str;
    use axum::response::Html;

    impl super::Swagger {
        /// Returns an [`ApiMethodRouter`] to expose the Swagger UI.
        ///
        /// # Examples
        ///
        /// ```
        /// # use aide::axum::{ApiRouter, routing::get};
        /// # use aide::swagger::Swagger;
        /// ApiRouter::<()>::new()
        ///     .route("/docs", Swagger::new("/openapi.json").axum_route());
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
        /// # use aide::swagger::Swagger;
        /// ApiRouter::<()>::new().api_route(
        ///     "/docs",
        ///     get_with(Swagger::new("/openapi.json").axum_handler(), |op| {
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
            // so you won't be able to have multiple instances of Swagger
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
