//! Method routing that closely mimics [`axum::routing`] while extending
//! it with API documentation-specific features..

use std::{convert::Infallible, mem};

use crate::{
    gen::GenContext,
    openapi::{Operation, PathItem, ReferenceOr, Response, StatusCode},
    Error,
};
use axum::body::HttpBody;
use axum::routing::Route;
use axum::{
    body::Body,
    handler::Handler,
    routing::{self, MethodRouter},
    BoxError,
};
use bytes::Bytes;
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
pub struct ApiMethodRouter<S = (), B = Body, E = Infallible> {
    pub(crate) operations: IndexMap<&'static str, Operation>,
    pub(crate) router: MethodRouter<S, B, E>,
}

impl<S, B, E> From<ApiMethodRouter<S, B, E>> for MethodRouter<S, B, E> {
    fn from(router: ApiMethodRouter<S, B, E>) -> Self {
        router.router
    }
}

impl<S, B, E> ApiMethodRouter<S, B, E> {
    fn new(router: MethodRouter<S, B, E>) -> Self {
        Self {
            operations: IndexMap::default(),
            router,
        }
    }

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
        pub fn $name<H, I, O, T>(mut self, handler: H) -> Self
        where
            H: Handler<T, S, B> + OperationHandler<I, O>,
            I: OperationInput,
            O: OperationOutput,
            B: Send + 'static,
            T: 'static,
        {
            let mut operation = Operation::default();
            in_context(|ctx| {
                I::operation_input(ctx, &mut operation);

                for (code, res) in O::inferred_responses(ctx, &mut operation) {
                    set_inferred_response(ctx, &mut operation, code, res);
                }
            });
            self.operations.insert(stringify!($name), operation);
            self.router = self.router.$name(handler);
            self
        }

        #[doc = concat!("Route `", stringify!($name) ,"` requests to the given handler. See [`axum::routing::MethodRouter::", stringify!($name) , "`] for more details.")]
        ///
        /// This method additionally accepts a transform function,
        /// see [`crate::axum`] for more details.
        pub fn $name_with<H, I, O, T, F>(mut self, handler: H, transform: F) -> Self
        where
            H: Handler<T, S, B> + OperationHandler<I, O>,
            I: OperationInput,
            O: OperationOutput,
            B: Send + 'static,
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
        pub fn $name<H, I, O, T, B, S>(handler: H) -> ApiMethodRouter<S, B, Infallible>
        where
            H: Handler<T, S, B> + OperationHandler<I, O>,
            I: OperationInput,
            O: OperationOutput,
            B: Send + Sync + 'static,
            S: Clone + Send + Sync + 'static,
            T: 'static,
        {
            let mut router = ApiMethodRouter::new(routing::$name(handler));
            let mut operation = Operation::default();
            in_context(|ctx| {
                I::operation_input(ctx, &mut operation);

                for (code, res) in O::inferred_responses(ctx, &mut operation) {
                    set_inferred_response(ctx, &mut operation, code, res);
                }
            });

            router.operations.insert(stringify!($name), operation);

            router
        }

        #[doc = concat!("Route `", stringify!($name) ,"` requests to the given handler. See [`axum::routing::", stringify!($name) , "`] for more details.")]
        ///
        /// This method additionally accepts a transform function,
        /// see [`crate::axum`] for more details.
        #[tracing::instrument(skip_all)]
        pub fn $name_with<H, I, O, T, B, S, F>(
            handler: H,
            transform: F,
        ) -> ApiMethodRouter<S, B, Infallible>
        where
            H: Handler<T, S, B> + OperationHandler<I, O>,
            I: OperationInput,
            O: OperationOutput,
            B: Send + Sync + 'static,
            S: Clone + Send + Sync + 'static,
            T: 'static,
            F: FnOnce(TransformOperation) -> TransformOperation,
        {
            let mut router = ApiMethodRouter::new(routing::$name(handler));
            let mut operation = Operation::default();
            in_context(|ctx| {
                I::operation_input(ctx, &mut operation);

                if ctx.infer_responses {
                    for (code, res) in O::inferred_responses(ctx, &mut operation) {
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

impl<S, B> ApiMethodRouter<S, B, Infallible>
where
    S: Clone + Send + Sync + 'static,
    B: Send + Sync + 'static,
{
    method_router_chain_method!(delete, delete_with);
    method_router_chain_method!(get, get_with);
    method_router_chain_method!(head, head_with);
    method_router_chain_method!(options, options_with);
    method_router_chain_method!(patch, patch_with);
    method_router_chain_method!(post, post_with);
    method_router_chain_method!(put, put_with);
    method_router_chain_method!(trace, trace_with);

    /// This method wraps a layer around the [`ApiMethodRouter`]
    /// For further information see [`axum::routing::method_routing::MethodRouter::layer`]
    pub fn layer<L, NewReqBody, NewResBody, NewError>(
        mut self,
        layer: L,
    ) -> ApiMethodRouter<S, NewReqBody, NewError>
    where
        L: Layer<Route<B, Infallible>> + Clone + Send + 'static,
        L::Service: Service<
                Request<NewReqBody>,
                Response = http::response::Response<NewResBody>,
                Error = NewError,
            > + Clone
            + Send
            + 'static,
        <L::Service as Service<Request<NewReqBody>>>::Future: Send + 'static,
        NewResBody: 'static,
        NewReqBody: 'static,
        NewError: 'static,
        NewResBody: HttpBody<Data = Bytes> + Send + 'static,
        NewResBody::Error: Into<BoxError>,
    {
        ApiMethodRouter {
            router: self.router.layer(layer),
            operations: self.operations,
        }
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
