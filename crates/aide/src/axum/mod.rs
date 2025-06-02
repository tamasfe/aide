//! Open API code generation for [`axum`].
//!
//! The implementation closely mimics the api of [`axum`] with
//! extra care taken in order to allow seamless transitions.
//!
//! The notable types are [`ApiRouter`] and [`ApiMethodRouter`] that wrap
//! [`axum::Router`] and [`axum::routing::MethodRouter`] respectively.
//! Likewise, the top-level methods in [`axum::routing`] have their counterparts
//! in [`routing`].
//!
//! # Examples
//!
//! Take the following `axum` example:
//!
//! ```no_run
//! use axum::{response::IntoResponse, routing::post, Json, Router};
//! use serde::Deserialize;
//!
//! #[derive(Deserialize)]
//! struct User {
//!     name: String,
//! }
//!
//! async fn hello_user(Json(user): Json<User>) -> impl IntoResponse {
//!     format!("hello {}", user.name)
//! }
//!
//! #[tokio::main]
//! async fn main() {
//!     let app = Router::new().route("/hello", post(hello_user));
//!
//!     let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
//!
//!     axum::serve(listener, app).await.unwrap();
//! }
//! ```
//!
//! We can apply the following changes to generate documentation for it:
//!
//! ```no_run
//! // Replace some of the `axum::` types with `aide::axum::` ones.
//! use aide::{
//!     axum::{
//!         routing::{get, post},
//!         ApiRouter, IntoApiResponse,
//!     },
//!     openapi::{Info, OpenApi},
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
//!
//! Only routes added via `api_route` are visible in the documentation,
//! this makes exposed routes explicit and less error-prone.
//!
//! ## Adding details.
//!
//! The above example includes routes and request parameters but
//! it's lacking response types and additional metadata such as descriptions,
//! as these are not possible to infer just via types.
//!
//! ### Responses
//!
//! Generally we can add information at the following levels:
//!
//! - Operation level (e.g. [`get_with`](crate::axum::routing::get_with))
//! - Route level ([`api_route_with`](crate::axum::ApiRouter::api_route_with))
//! - API-level ([`finish_api_with`](crate::axum::ApiRouter::finish_api_with))
//!
//! All of these are additive and the API-level information will not override
//! route or operation metadata unless explicitly stated.
//!
//! With this being said, we can specify the response status code
//! and the type for our `hello_user` operation:
//!
//! ```ignore
//! // ...
//! .api_route(
//!     "/hello",
//!     post_with(hello_user, |op| op.response::<200, String>()),
//! )
//! // ...
//! ```
//!
//! And on the API-level we define that in every unspecified
//! case, we return some kind of text:
//!
//! ```ignore
//! // ...
//! app.finish_api_with(&mut api, |api| api.default_response::<String>())
//! // ...
//! ```
//!
//! ### Other Metadata
//!
//! We can extend our `hello_user` operation with further metadata:
//!
//! ```ignore
//! // ...
//! .api_route(
//!     "/hello",
//!     post_with(hello_user, |o| {
//!         o.id("helloUser")
//!             .description("says hello to the given user")
//!             .response_with::<200, String, _>(|res| {
//!                 res.description("a simple message saying hello to the user")
//!                     .example(String::from("hello Tom"))
//!             })
//!     }),
//! )
//! // ...
//! ```
//!
//! # Composability
//!
//! Just like in `axum`, nesting and merging routers is possible,
//! and the documented routes will be updated as expected.
//!

use std::{convert::Infallible, future::Future, pin::Pin};

use crate::{
    generate::{self, in_context},
    openapi::{OpenApi, PathItem, ReferenceOr, SchemaObject},
    operation::OperationHandler,
    util::{merge_paths, path_for_nested_route},
    OperationInput, OperationOutput,
};
#[cfg(feature = "axum-tokio")]
use axum::extract::connect_info::IntoMakeServiceWithConnectInfo;
use axum::{
    body::{Body, Bytes, HttpBody},
    handler::Handler,
    http::Request,
    response::IntoResponse,
    routing::{IntoMakeService, Route, RouterAsService, RouterIntoService},
    Router,
};
use indexmap::map::Entry;
use indexmap::IndexMap;
use tower_layer::Layer;
use tower_service::Service;

#[cfg(feature = "axum-extra")]
use axum_extra::routing::RouterExt as _;

use self::routing::ApiMethodRouter;
use crate::transform::{TransformOpenApi, TransformPathItem};

mod inputs;
mod outputs;

pub mod routing;

#[cfg(all(feature = "macros", feature = "axum-extra-typed-routing"))]
pub use aide_macros::axum_typed_path as typed_path;

/// A wrapper over [`axum::Router`] that adds
/// API documentation-specific features.
#[must_use]
#[derive(Debug)]
pub struct ApiRouter<S = ()> {
    paths: IndexMap<String, PathItem>,
    router: Router<S>,
}

impl<S> Clone for ApiRouter<S> {
    fn clone(&self) -> Self {
        Self {
            paths: self.paths.clone(),
            router: self.router.clone(),
        }
    }
}

impl<B> Service<Request<B>> for ApiRouter<()>
where
    B: HttpBody<Data = Bytes> + Send + 'static,
    B::Error: Into<axum::BoxError>,
{
    type Response = axum::response::Response;
    type Error = Infallible;
    type Future = axum::routing::future::RouteFuture<Infallible>;

    #[inline]
    fn poll_ready(
        &mut self,
        cx: &mut std::task::Context<'_>,
    ) -> std::task::Poll<Result<(), Self::Error>> {
        Service::<Request<B>>::poll_ready(&mut self.router, cx)
    }

    #[inline]
    fn call(&mut self, req: Request<B>) -> Self::Future {
        self.router.call(req)
    }
}

#[allow(clippy::mismatching_type_param_order)]
impl Default for ApiRouter<()> {
    fn default() -> Self {
        Self::new()
    }
}

impl<S> ApiRouter<S>
where
    S: Clone + Send + Sync + 'static,
{
    /// Create a new router.
    ///
    /// See [`axum::Router::new`] for details.
    pub fn new() -> Self {
        Self {
            paths: IndexMap::new(),
            router: Router::new(),
        }
    }

    /// Add state to the router.
    ///
    /// See [`axum::Router::with_state`] for details.
    pub fn with_state<S2>(self, state: S) -> ApiRouter<S2> {
        ApiRouter {
            paths: self.paths,
            router: self.router.with_state(state),
        }
    }

    /// Transform the contained [`PathItem`]s.
    ///
    /// This method accepts a transform function to edit each [`PathItem`] provided by this router.
    pub fn with_path_items(
        mut self,
        mut transform: impl FnMut(TransformPathItem<'_>) -> TransformPathItem<'_>,
    ) -> Self {
        for (_, item) in &mut self.paths {
            let _ = transform(TransformPathItem::new(item));
        }
        self
    }

    /// Create a route to the given method router and include it in
    /// the API documentation.
    ///
    /// As opposed to [`route`](crate::axum::ApiRouter::route), this method only accepts an [`ApiMethodRouter`].
    ///
    /// See [`axum::Router::route`] for details.
    #[tracing::instrument(skip_all, fields(path = path))]
    pub fn api_route(mut self, path: &str, mut method_router: ApiMethodRouter<S>) -> Self {
        in_context(|ctx| {
            let new_path_item = method_router.take_path_item();

            if let Some(path_item) = self.paths.get_mut(path) {
                merge_paths(ctx, path, path_item, new_path_item);
            } else {
                self.paths.insert(path.into(), new_path_item);
            }
        });

        self.router = self.router.route(path, method_router.router);
        self
    }

    #[cfg(feature = "axum-extra")]
    /// Create a route to the given method router with trailing slash removal and include it in
    /// the API documentation.
    ///
    /// As opposed to [`route_with_tsr`](crate::axum::ApiRouter::route_with_tsr), this method only accepts an [`ApiMethodRouter`].
    ///
    /// See [`axum_extra::routing::RouterExt::route_with_tsr`] for details.
    #[tracing::instrument(skip_all, fields(path = path))]
    pub fn api_route_with_tsr(mut self, path: &str, mut method_router: ApiMethodRouter<S>) -> Self {
        in_context(|ctx| {
            let new_path_item = method_router.take_path_item();

            if let Some(path_item) = self.paths.get_mut(path) {
                merge_paths(ctx, path, path_item, new_path_item);
            } else {
                self.paths.insert(path.into(), new_path_item);
            }
        });

        self.router = self.router.route_with_tsr(path, method_router.router);
        self
    }

    /// Create a route to the given method router and include it in
    /// the API documentation.
    ///
    /// This method accepts a transform function to edit
    /// the generated API documentation with.
    ///
    /// See [`axum::Router::route`] or [`api_route`](crate::axum::ApiRouter::api_route) for details.
    #[tracing::instrument(skip_all, fields(path = path))]
    pub fn api_route_with(
        mut self,
        path: &str,
        mut method_router: ApiMethodRouter<S>,
        transform: impl FnOnce(TransformPathItem<'_>) -> TransformPathItem<'_>,
    ) -> Self {
        in_context(|ctx| {
            let mut p = method_router.take_path_item();
            let t = transform(TransformPathItem::new(&mut p));

            if !t.hidden {
                if let Some(path_item) = self.paths.get_mut(path) {
                    merge_paths(ctx, path, path_item, p);
                } else {
                    self.paths.insert(path.into(), p);
                }
            }
        });

        self.router = self.router.route(path, method_router.router);
        self
    }

    #[cfg(feature = "axum-extra")]
    /// Create a route to the given method router with trailing slash removal and include it in
    /// the API documentation.
    ///
    /// This method accepts a transform function to edit
    /// the generated API documentation with.
    ///
    /// See [`axum_extra::routing::RouterExt::route_with_tsr`] for details.
    #[tracing::instrument(skip_all, fields(path = path))]
    pub fn api_route_with_tsr_and(
        mut self,
        path: &str,
        mut method_router: ApiMethodRouter<S>,
        transform: impl FnOnce(TransformPathItem<'_>) -> TransformPathItem<'_>,
    ) -> Self {
        in_context(|ctx| {
            let mut p = method_router.take_path_item();
            let t = transform(TransformPathItem::new(&mut p));

            if !t.hidden {
                if let Some(path_item) = self.paths.get_mut(path) {
                    merge_paths(ctx, path, path_item, p);
                } else {
                    self.paths.insert(path.into(), p);
                }
            }
        });

        self.router = self.router.route_with_tsr(path, method_router.router);
        self
    }

    /// Turn this router into an [`axum::Router`] while merging
    /// generated documentation into the provided [`OpenApi`].
    #[tracing::instrument(skip_all)]
    pub fn finish_api(mut self, api: &mut OpenApi) -> Router<S> {
        self.merge_api(api);
        self.router
    }

    /// Turn this router into an [`axum::Router`] while merging
    /// generated documentation into the provided [`OpenApi`].
    ///
    /// This method accepts a transform function to edit
    /// the generated API documentation with.
    #[tracing::instrument(skip_all)]
    pub fn finish_api_with<F>(mut self, api: &mut OpenApi, transform: F) -> Router<S>
    where
        F: FnOnce(TransformOpenApi<'_>) -> TransformOpenApi<'_>,
    {
        self.merge_api_with(api, transform);
        self.router
    }

    fn merge_api(&mut self, api: &mut OpenApi) {
        self.merge_api_with(api, |x| x);
    }

    fn merge_api_with<F>(&mut self, api: &mut OpenApi, transform: F)
    where
        F: FnOnce(TransformOpenApi<'_>) -> TransformOpenApi<'_>,
    {
        if api.paths.is_none() {
            api.paths = Some(Default::default());
        }

        let paths = api.paths.as_mut().unwrap();
        paths.paths.extend(
            self.paths
                .drain(..)
                .map(|(route, path)| (route, ReferenceOr::Item(path))),
        );

        let _ = transform(TransformOpenApi::new(api));

        let needs_reset = in_context(|ctx| {
            if !ctx.extract_schemas {
                return false;
            }

            let components = api.components.get_or_insert_with(Default::default);
            components
                .schemas
                .extend(ctx.schema.take_definitions(true).into_iter().map(
                    |(name, json_schema)| {
                        (
                            name,
                            SchemaObject {
                                json_schema: json_schema.try_into().expect("Invalid schema"),
                                example: None,
                                external_docs: None,
                            },
                        )
                    },
                ));

            true
        });
        if needs_reset {
            generate::reset_context();
        }
    }

    /// Adds documentation to an existing route without changing the route handler.
    ///
    /// This method allows you to add OpenAPI documentation to routes that have been
    /// previously defined using `Router` methods, particularly useful when working
    /// with frameworks like Leptos that only implement traits for `axum::Router`.
    pub fn api_route_docs(mut self, path: &str, docs: routing::ApiMethodDocs) -> Self {
        in_context(|_ctx| {
            if let Some(path_item) = self.paths.get_mut(path) {
                docs.apply_to_path_item(path_item);
            } else {
                let mut path_item = PathItem::default();
                docs.apply_to_path_item(&mut path_item);
                self.paths.insert(path.into(), path_item);
            }
        });

        self
    }

    /// Adds documentation to an existing route with a transform function.
    ///
    /// This method allows you to add OpenAPI documentation to routes that have been
    /// previously defined using `Router` methods, and additionally provides a transform
    /// function to edit the generated path item.
    pub fn api_route_docs_with(
        mut self,
        path: &str,
        docs: routing::ApiMethodDocs,
        transform: impl FnOnce(TransformPathItem<'_>) -> TransformPathItem<'_>,
    ) -> Self {
        in_context(|ctx| {
            let mut path_item = if let Some(existing) = self.paths.get_mut(path) {
                let mut new_item = existing.clone();
                docs.apply_to_path_item(&mut new_item);
                new_item
            } else {
                let mut new_item = PathItem::default();
                docs.apply_to_path_item(&mut new_item);
                new_item
            };
            let _ = transform(TransformPathItem::new(&mut path_item));

            if let Some(existing) = self.paths.get_mut(path) {
                merge_paths(ctx, path, existing, path_item);
            } else {
                self.paths.insert(path.into(), path_item);
            }
        });

        self
    }
}

impl<S> ApiRouter<S>
where
    S: Clone + Send + Sync + 'static,
{
    /// See [`axum::Router::route`] for details.
    ///
    /// This method accepts [`ApiMethodRouter`] but does not generate API documentation.
    #[tracing::instrument(skip_all)]
    pub fn route(mut self, path: &str, method_router: impl Into<ApiMethodRouter<S>>) -> Self {
        self.router = self.router.route(path, method_router.into().router);
        self
    }

    /// See [`axum_extra::routing::RouterExt::route_with_tsr`] for details.
    ///
    /// This method accepts [`ApiMethodRouter`] but does not generate API documentation.
    #[cfg(feature = "axum-extra")]
    #[tracing::instrument(skip_all)]
    pub fn route_with_tsr(
        mut self,
        path: &str,
        method_router: impl Into<ApiMethodRouter<S>>,
    ) -> Self {
        self.router = self
            .router
            .route_with_tsr(path, method_router.into().router);
        self
    }

    /// See [`axum::Router::route_service`] for details.
    #[tracing::instrument(skip_all)]
    pub fn route_service<T>(mut self, path: &str, service: T) -> Self
    where
        T: Service<Request<Body>, Error = Infallible> + Clone + Send + Sync + 'static,
        T::Response: IntoResponse,
        T::Future: Send + 'static,
    {
        self.router = self.router.route_service(path, service);
        self
    }

    /// See [`axum_extra::routing::RouterExt::route_service_with_tsr`] for details.
    #[cfg(feature = "axum-extra")]
    #[tracing::instrument(skip_all)]
    pub fn route_service_with_tsr<T>(mut self, path: &str, service: T) -> Self
    where
        T: Service<axum::extract::Request, Error = Infallible> + Clone + Send + Sync + 'static,
        T::Response: IntoResponse,
        T::Future: Send + 'static,
        Self: Sized,
    {
        self.router = self.router.route_service_with_tsr(path, service);
        self
    }

    /// See [`axum::Router::nest`] for details.
    ///
    /// The generated documentations are nested as well.
    #[tracing::instrument(skip_all)]
    pub fn nest(mut self, path: &str, router: ApiRouter<S>) -> Self {
        self.router = self.router.nest(path, router.router);
        self.paths.extend(
            router
                .paths
                .into_iter()
                .map(|(route, path_item)| (path_for_nested_route(path, &route), path_item)),
        );
        self
    }

    /// Alternative to [`nest_service`](Self::nest_service) which besides nesting the service nests
    /// the generated documentation as well.
    ///
    /// Due to Rust's limitations, currently this function will not
    /// accept arbitrary services but only types that can be
    /// converted into an [`ApiRouter`].
    ///
    /// Thus the primary and probably the only use-case
    /// of this function is nesting routers with different states.
    pub fn nest_api_service(mut self, path: &str, service: impl Into<ApiRouter<()>>) -> Self {
        let router: ApiRouter<()> = service.into();
        self.paths.extend(
            router
                .paths
                .into_iter()
                .map(|(route, path_item)| (path_for_nested_route(path, &route), path_item)),
        );
        self.router = self.router.nest_service(path, router.router);
        self
    }

    /// See [`axum::Router::nest_service`] for details. Use [`nest_api_service`](Self::nest_api_service())
    /// to pass on the API documentation from the nested service as well.
    pub fn nest_service<T>(mut self, path: &str, svc: T) -> Self
    where
        T: Service<Request<Body>, Error = Infallible> + Clone + Send + Sync + 'static,
        T::Response: IntoResponse,
        T::Future: Send + 'static,
    {
        self.router = self.router.nest_service(path, svc);
        self
    }

    /// See [`axum::Router::merge`] for details.
    ///
    /// If an another [`ApiRouter`] is provided, the generated documentations
    /// are merged as well.
    pub fn merge<R>(mut self, other: R) -> Self
    where
        R: Into<ApiRouter<S>>,
    {
        let other: ApiRouter<S> = other.into();
        for (key, path) in other.paths {
            match self.paths.entry(key) {
                Entry::Occupied(mut o) => {
                    o.get_mut().merge_with(path);
                }
                Entry::Vacant(v) => {
                    v.insert(path);
                }
            }
        }
        self.router = self.router.merge(other.router);
        self
    }

    /// See [`axum::Router::layer`] for details.
    pub fn layer<L>(self, layer: L) -> ApiRouter<S>
    where
        L: Layer<Route> + Clone + Send + Sync + 'static,
        L::Service: Service<Request<Body>> + Clone + Send + Sync + 'static,
        <L::Service as Service<Request<Body>>>::Response: IntoResponse + 'static,
        <L::Service as Service<Request<Body>>>::Error: Into<Infallible> + 'static,
        <L::Service as Service<Request<Body>>>::Future: Send + 'static,
    {
        ApiRouter {
            paths: self.paths,
            router: self.router.layer(layer),
        }
    }

    /// See [`axum::Router::route_layer`] for details.
    pub fn route_layer<L>(mut self, layer: L) -> Self
    where
        L: Layer<Route> + Clone + Send + Sync + 'static,
        L::Service: Service<Request<Body>> + Clone + Send + Sync + 'static,
        <L::Service as Service<Request<Body>>>::Response: IntoResponse + 'static,
        <L::Service as Service<Request<Body>>>::Error: Into<Infallible> + 'static,
        <L::Service as Service<Request<Body>>>::Future: Send + 'static,
    {
        self.router = self.router.route_layer(layer);
        self
    }

    /// See [`axum::Router::fallback`] for details.
    pub fn fallback<H, T>(mut self, handler: H) -> Self
    where
        H: Handler<T, S>,
        T: 'static,
    {
        self.router = self.router.fallback(handler);
        self
    }

    /// See [`axum::Router::fallback_service`] for details.
    pub fn fallback_service<T>(mut self, svc: T) -> Self
    where
        T: Service<Request<Body>, Error = Infallible> + Clone + Send + Sync + 'static,
        T::Response: IntoResponse,
        T::Future: Send + 'static,
    {
        self.router = self.router.fallback_service(svc);
        self
    }

    /// See [`axum::Router::as_service`] for details.
    ///
    /// Using this method will not generate API documentation.
    #[must_use]
    pub fn as_service<B>(&mut self) -> RouterAsService<'_, B, S> {
        self.router.as_service()
    }

    /// See [`axum::Router::into_service`] for details.
    ///
    /// Using this method will not generate API documentation.
    #[must_use]
    pub fn into_service<B>(self) -> RouterIntoService<B, S> {
        self.router.into_service()
    }
}

impl ApiRouter<()> {
    /// See [`axum::Router::into_make_service`] for details.
    #[tracing::instrument(skip_all)]
    #[must_use]
    pub fn into_make_service(self) -> IntoMakeService<Router<()>> {
        self.router.into_make_service()
    }

    /// See [`axum::Router::into_make_service_with_connect_info`] for details.
    #[tracing::instrument(skip_all)]
    #[must_use]
    #[cfg(feature = "axum-tokio")]
    pub fn into_make_service_with_connect_info<C>(
        self,
    ) -> IntoMakeServiceWithConnectInfo<Router<()>, C> {
        self.router.into_make_service_with_connect_info()
    }
}

impl<S> From<Router<S>> for ApiRouter<S> {
    fn from(router: Router<S>) -> Self {
        ApiRouter {
            paths: IndexMap::new(),
            router,
        }
    }
}

impl<S> From<ApiRouter<S>> for Router<S> {
    fn from(api: ApiRouter<S>) -> Self {
        api.router
    }
}

/// A trait analogous to [`IntoResponse`] that allows writing
/// `impl IntoApiResponse` for documented handlers.
/// Axum's `IntoResponse` cannot be used for these handlers
/// since the return type has to implement [`OperationOutput`].
///
/// This trait has a blanket implementation for all types
/// that implement [`IntoResponse`] and [`OperationOutput`],
/// it should not be implemented manually.
pub trait IntoApiResponse: IntoResponse + OperationOutput {}
impl<T> IntoApiResponse for T where T: IntoResponse + OperationOutput {}

/// Convenience extension trait for [`axum::Router`].
pub trait RouterExt<S>: private::Sealed + Sized {
    /// Turn the router into an [`ApiRouter`] to enable
    /// automatic generation of API documentation.
    fn into_api(self) -> ApiRouter<S>;
    /// Add an API route, see [`ApiRouter::api_route`](crate::axum::ApiRouter::api_route)
    /// for details.
    ///
    /// This method additionally turns the router into an [`ApiRouter`].
    fn api_route(self, path: &str, method_router: ApiMethodRouter<S>) -> ApiRouter<S>;
    #[cfg(feature = "axum-extra")]
    /// Add an API route, see [`ApiRouter::api_route_with_tsr`](crate::axum::ApiRouter::api_route_with_tsr)
    /// for details.
    ///
    /// This method additionally turns the router into an [`ApiRouter`].
    fn api_route_with_tsr(self, path: &str, method_router: ApiMethodRouter<S>) -> ApiRouter<S>;
}

impl<S> RouterExt<S> for Router<S>
where
    S: Clone + Send + Sync + 'static,
{
    #[tracing::instrument(skip_all)]
    fn into_api(self) -> ApiRouter<S> {
        ApiRouter::from(self)
    }

    #[tracing::instrument(skip_all)]
    fn api_route(self, path: &str, method_router: ApiMethodRouter<S>) -> ApiRouter<S> {
        ApiRouter::from(self).api_route(path, method_router)
    }

    #[cfg(feature = "axum-extra")]
    #[tracing::instrument(skip_all)]
    fn api_route_with_tsr(self, path: &str, method_router: ApiMethodRouter<S>) -> ApiRouter<S> {
        ApiRouter::from(self).api_route_with_tsr(path, method_router)
    }
}

impl<S> private::Sealed for Router<S> {}

#[doc(hidden)]
pub enum ServiceOrApiRouter<T> {
    Service(T),
    Router(ApiRouter<()>),
}

impl<T> From<T> for ServiceOrApiRouter<T>
where
    T: Service<Request<Body>, Error = Infallible> + Clone + Send + 'static,
    T::Response: IntoResponse,
    T::Future: Send + 'static,
{
    fn from(v: T) -> Self {
        Self::Service(v)
    }
}

impl From<ApiRouter<()>> for ServiceOrApiRouter<DefinitelyNotService> {
    fn from(v: ApiRouter<()>) -> Self {
        Self::Router(v)
    }
}

// To help with type-inference.
#[derive(Clone)]
#[doc(hidden)]
pub enum DefinitelyNotService {}

impl Service<Request<Body>> for DefinitelyNotService {
    type Response = String;
    type Error = Infallible;

    type Future =
        Pin<Box<dyn Future<Output = Result<Self::Response, Self::Error>> + Send + Sync + 'static>>;

    fn poll_ready(
        &mut self,
        _cx: &mut std::task::Context<'_>,
    ) -> std::task::Poll<Result<(), Self::Error>> {
        unreachable!()
    }

    fn call(&mut self, _req: Request<Body>) -> Self::Future {
        unreachable!()
    }
}

mod private {
    pub trait Sealed {}
}

impl<I, O, L, H, T, S> OperationHandler<I, O> for axum::handler::Layered<L, H, T, S>
where
    H: OperationHandler<I, O>,
    I: OperationInput,
    O: OperationOutput,
{
}

/// A trait that extends [`axum::handler::Handler`] with API operation
/// details.
///
/// Just like axum's `Handler`, it is automatically implemented
/// for the appropriate types.
pub trait AxumOperationHandler<I, O, T, S>: Handler<T, S> + OperationHandler<I, O>
where
    I: OperationInput,
    O: OperationOutput,
{
}
impl<H, I, O, T, S> AxumOperationHandler<I, O, T, S> for H
where
    H: Handler<T, S> + OperationHandler<I, O>,
    I: OperationInput,
    O: OperationOutput,
{
}

#[cfg(test)]
#[allow(clippy::unused_async)]
mod tests {
    use crate::axum::{routing, ApiRouter};
    use axum::{extract::State, handler::Handler};

    async fn test_handler1(State(_): State<TestState>) {}
    async fn test_handler2(State(_): State<u8>) {}

    async fn test_handler3() {}

    fn nested_route() -> ApiRouter {
        ApiRouter::new()
            .api_route_with("/", routing::post(test_handler3), |t| t)
            .api_route_with("/test1", routing::post(test_handler3), |t| t)
            .api_route_with("/test2/", routing::post(test_handler3), |t| t)
    }

    #[derive(Clone, Copy)]
    struct TestState {
        field1: u8,
    }

    #[test]
    fn test_nesting_with_nondefault_state() {
        let _app: ApiRouter = ApiRouter::new()
            .nest_api_service("/home", ApiRouter::new().with_state(1_isize))
            .with_state(1_usize);
    }

    #[test]
    fn test_method_router_with_state() {
        let app: ApiRouter<TestState> =
            ApiRouter::new().api_route("/", routing::get(test_handler1));
        let app_with_state: ApiRouter = app.with_state(TestState { field1: 0 });
        // Only after state is given `into_make_service()` can be invoked.
        let _service = app_with_state.into_make_service();
    }

    #[test]
    fn test_router_with_different_states() {
        let state = TestState { field1: 0 };
        let app: ApiRouter = ApiRouter::new()
            .api_route("/test1", routing::get(test_handler1))
            .api_route(
                "/test2",
                routing::get(test_handler2).with_state(state.field1),
            )
            .with_state(state);
        let _service = app.into_make_service();
    }

    #[test]
    fn test_api_route_with_same_router_different_methods() {
        let app: ApiRouter = ApiRouter::new()
            .api_route_with("/test1", routing::post(test_handler3), |t| t)
            .api_route_with("/test1", routing::get(test_handler3), |t| t);

        let item = app
            .paths
            .get("/test1")
            .expect("should contain handler for /test1");

        assert!(item.get.is_some());
        assert!(item.post.is_some());
    }

    #[test]
    fn test_nested_routing() {
        let app: ApiRouter = ApiRouter::new().nest("/app", nested_route());

        assert!(app.paths.contains_key("/app"));
        assert!(!app.paths.contains_key("/app/"));
        assert!(app.paths.contains_key("/app/test1"));
        assert!(app.paths.contains_key("/app/test2/"));
    }

    #[test]
    fn test_layered_handler() {
        let _app: ApiRouter = ApiRouter::new().api_route(
            "/test-route",
            routing::get(test_handler3.layer(tower_layer::Identity::new())),
        );
    }
}
