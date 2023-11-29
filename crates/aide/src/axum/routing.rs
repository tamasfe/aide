//! Method routing that closely mimics [`axum::routing`] while extending
//! it with API documentation-specific features..

use std::{convert::Infallible, mem};

use crate::{
    gen::GenContext,
    openapi::{Operation, PathItem, ReferenceOr, Response, StatusCode},
    Error,
};
use axum::routing::{MethodFilter, Route};
use axum::{body::Body, response::IntoResponse};
use axum::{
    handler::Handler,
    routing::{self, MethodRouter},
};
use http::Request;
use indexmap::IndexMap;
use tower_layer::Layer;
use tower_service::Service;

use crate::{
    gen::in_context,
    operation::{OperationHandler, OperationInput, OperationOutput},
    transform::TransformOperation,
};

/// A wrapper over [`axum::routing::MethodRouter`] that adds
/// API documentation-specific features.
#[must_use]
pub struct ApiMethodRouter<S = (), E = Infallible> {
    pub(crate) operations: IndexMap<&'static str, Operation>,
    pub(crate) router: MethodRouter<S, E>,
}

impl<S, E> Clone for ApiMethodRouter<S, E> {
    fn clone(&self) -> Self {
        Self {
            operations: self.operations.clone(),
            router: self.router.clone(),
        }
    }
}

impl<S, E> From<ApiMethodRouter<S, E>> for MethodRouter<S, E> {
    fn from(router: ApiMethodRouter<S, E>) -> Self {
        router.router
    }
}

impl<S, E> From<MethodRouter<S, E>> for ApiMethodRouter<S, E> {
    fn from(router: MethodRouter<S, E>) -> Self {
        Self {
            operations: IndexMap::default(),
            router,
        }
    }
}

impl<S, E> ApiMethodRouter<S, E> {
    pub(crate) fn take_path_item(&mut self) -> PathItem {
        let mut path = PathItem::default();

        for (method, op) in mem::take(&mut self.operations) {
            match method {
                "delete" => path.delete = Some(op),
                "get" => path.get = Some(op),
                "head" => path.head = Some(op),
                "options" => path.options = Some(op),
                "patch" => path.patch = Some(op),
                "post" => path.post = Some(op),
                "put" => path.put = Some(op),
                "trace" => path.trace = Some(op),
                _ => unreachable!(),
            }
        }

        path
    }
}

macro_rules! method_router_chain_method {
    ($name:ident, $name_with:ident) => {
        #[doc = concat!("Route `", stringify!($name) ,"` requests to the given handler. See [`axum::routing::MethodRouter::", stringify!($name) , "`] for more details.")]
        pub fn $name<H, I, O, T>(self, handler: H) -> Self
        where
            H: Handler<T, S> + OperationHandler<I, O>,
            I: OperationInput,
            O: OperationOutput,
            T: 'static,
        {
            self.$name_with(handler, |t| t)
        }

        #[doc = concat!("Route `", stringify!($name) ,"` requests to the given handler. See [`axum::routing::MethodRouter::", stringify!($name) , "`] for more details.")]
        ///
        /// This method additionally accepts a transform function,
        /// see [`crate::axum`] for more details.
        pub fn $name_with<H, I, O, T, F>(mut self, handler: H, transform: F) -> Self
        where
            H: Handler<T, S> + OperationHandler<I, O>,
            I: OperationInput,
            O: OperationOutput,
            T: 'static,
            F: FnOnce(TransformOperation) -> TransformOperation,
        {
            let mut operation = Operation::default();
            in_context(|ctx| {
                I::operation_input(ctx, &mut operation);

                if ctx.infer_responses {
                    for (code, res) in O::inferred_responses(ctx, &mut operation) {
                        set_inferred_response(ctx, &mut operation, code, res);
                    }

                    // On conflict, input early responses potentially overwrite
                    // output inferred responses on purpose, as they
                    // are stronger in a sense that the request won't
                    // even reach the handler body.
                    for (code, res) in I::inferred_early_responses(ctx, &mut operation) {
                        set_inferred_response(ctx, &mut operation, code, res);
                    }
                }
            });

            let t = transform(TransformOperation::new(&mut operation));

            if !t.hidden {
                self.operations.insert(stringify!($name), operation);
            }

            self.router = self.router.$name(handler);
            self
        }
    };
}

macro_rules! method_router_top_level {
    ($name:ident, $name_with:ident) => {
        #[doc = concat!("Route `", stringify!($name) ,"` requests to the given handler. See [`axum::routing::", stringify!($name) , "`] for more details.")]
        #[tracing::instrument(skip_all)]
        pub fn $name<H, I, O, T, S>(handler: H) -> ApiMethodRouter<S, Infallible>
        where
            H: Handler<T, S> + OperationHandler<I, O>,
            I: OperationInput,
            O: OperationOutput,
            S: Clone + Send + Sync + 'static,
            T: 'static,
        {
            $crate::axum::routing::$name_with(handler, |t| t)
        }

        #[doc = concat!("Route `", stringify!($name) ,"` requests to the given handler. See [`axum::routing::", stringify!($name) , "`] for more details.")]
        ///
        /// This method additionally accepts a transform function,
        /// see [`crate::axum`] for more details.
        #[tracing::instrument(skip_all)]
        pub fn $name_with<H, I, O, T, S, F>(
            handler: H,
            transform: F,
        ) -> ApiMethodRouter<S, Infallible>
        where
            H: Handler<T, S> + OperationHandler<I, O>,
            I: OperationInput,
            O: OperationOutput,
            S: Clone + Send + Sync + 'static,
            T: 'static,
            F: FnOnce(TransformOperation) -> TransformOperation,
        {
            let mut router = ApiMethodRouter::from(routing::$name(handler));
            let mut operation = Operation::default();
            in_context(|ctx| {
                I::operation_input(ctx, &mut operation);

                if ctx.infer_responses {
                    for (code, res) in O::inferred_responses(ctx, &mut operation) {
                        set_inferred_response(ctx, &mut operation, code, res);
                    }

                    // On conflict, input early responses potentially overwrite
                    // output inferred responses on purpose, as they
                    // are stronger in a sense that the request won't
                    // even reach the handler body.
                    for (code, res) in I::inferred_early_responses(ctx, &mut operation) {
                        set_inferred_response(ctx, &mut operation, code, res);
                    }
                }
            });

            let t = transform(TransformOperation::new(&mut operation));

            if !t.hidden {
                router.operations.insert(stringify!($name), operation);
            }

            router
        }
    };
}

fn set_inferred_response(
    ctx: &mut GenContext,
    operation: &mut Operation,
    status: Option<u16>,
    res: Response,
) {
    if operation.responses.is_none() {
        operation.responses = Some(Default::default());
    }

    let responses = operation.responses.as_mut().unwrap();

    match status {
        Some(status) => {
            if responses.responses.contains_key(&StatusCode::Code(status)) {
                ctx.error(Error::InferredResponseConflict(status));
            } else {
                responses
                    .responses
                    .insert(StatusCode::Code(status), ReferenceOr::Item(res));
            }
        }
        None => {
            if responses.default.is_some() {
                ctx.error(Error::InferredDefaultResponseConflict);
            } else {
                responses.default = Some(ReferenceOr::Item(res));
            }
        }
    }
}

impl<S> ApiMethodRouter<S, Infallible>
where
    S: Clone + Send + Sync + 'static,
{
    method_router_chain_method!(delete, delete_with);
    method_router_chain_method!(get, get_with);
    method_router_chain_method!(head, head_with);
    method_router_chain_method!(options, options_with);
    method_router_chain_method!(patch, patch_with);
    method_router_chain_method!(post, post_with);
    method_router_chain_method!(put, put_with);
    method_router_chain_method!(trace, trace_with);
}

impl<S, E> ApiMethodRouter<S, E>
where
    S: Clone,
{
    /// Create a new, empty [`ApiMethodRouter`] based on [`MethodRouter::new()`](axum::routing::MethodRouter).
    pub fn new() -> Self {
        Self {
            operations: IndexMap::default(),
            router: MethodRouter::<S, E>::new(),
        }
    }

    /// See [`axum::routing::MethodRouter::merge`].
    pub fn merge<M>(mut self, other: M) -> Self
    where
        M: Into<ApiMethodRouter<S, E>>,
    {
        let other = other.into();
        self.operations.extend(other.operations);
        self.router = self.router.merge(other.router);
        self
    }

    /// See [`axum::routing::method_routing::MethodRouter::layer`].
    pub fn layer<L, NewError>(self, layer: L) -> ApiMethodRouter<S, NewError>
    where
        L: Layer<Route<E>> + Clone + Send + 'static,
        L::Service: Service<Request<Body>> + Clone + Send + 'static,
        <L::Service as Service<Request<Body>>>::Response: IntoResponse + 'static,
        <L::Service as Service<Request<Body>>>::Error: Into<NewError> + 'static,
        <L::Service as Service<Request<Body>>>::Future: Send + 'static,
        E: 'static,
        S: 'static,
        NewError: 'static,
    {
        ApiMethodRouter {
            router: self.router.layer(layer),
            operations: self.operations,
        }
    }

    /// See [`axum::routing::method_routing::MethodRouter::with_state`].
    pub fn with_state<S2>(self, state: S) -> ApiMethodRouter<S2, E> {
        ApiMethodRouter {
            router: self.router.with_state(state),
            operations: self.operations,
        }
    }

    /// See [`axum::routing::method_routing::MethodRouter::on_service`].
    pub fn on_service<T>(mut self, filter: MethodFilter, svc: T) -> Self
    where
        T: Service<Request<Body>, Error = E> + Clone + Send + 'static,
        T::Response: IntoResponse + 'static,
        T::Future: Send + 'static,
    {
        self.router = self.router.on_service(filter, svc);
        self
    }

    /// See [`axum::routing::method_routing::MethodRouter::fallback_service`].
    pub fn fallback_service<T>(mut self, svc: T) -> Self
    where
        T: Service<Request<Body>, Error = E> + Clone + Send + 'static,
        T::Response: IntoResponse + 'static,
        T::Future: Send + 'static,
    {
        self.router = self.router.fallback_service(svc);
        self
    }

    /// See [`axum::routing::method_routing::MethodRouter::route_layer`].
    pub fn route_layer<L>(self, layer: L) -> ApiMethodRouter<S, E>
    where
        L: Layer<Route<E>> + Clone + Send + 'static,
        L::Service: Service<Request<Body>, Error = E> + Clone + Send + 'static,
        <L::Service as Service<Request<Body>>>::Response: IntoResponse + 'static,
        <L::Service as Service<Request<Body>>>::Future: Send + 'static,
        E: 'static,
        S: 'static,
    {
        ApiMethodRouter {
            router: self.router.route_layer(layer),
            operations: self.operations,
        }
    }
}

impl<S, E> Default for ApiMethodRouter<S, E>
where
    S: Clone,
{
    fn default() -> Self {
        Self::new()
    }
}

method_router_top_level!(delete, delete_with);
method_router_top_level!(get, get_with);
method_router_top_level!(head, head_with);
method_router_top_level!(options, options_with);
method_router_top_level!(patch, patch_with);
method_router_top_level!(post, post_with);
method_router_top_level!(put, put_with);
method_router_top_level!(trace, trace_with);
