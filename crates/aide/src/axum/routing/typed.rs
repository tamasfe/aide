//! Typed routing for Axum.

use axum::extract::rejection::PathRejection;
use axum_extra::routing::SecondElementIs;
use http::request::Parts;
use schemars::JsonSchema;
use serde::de::DeserializeOwned;

use super::*;
use crate::operation::{add_parameters, parameters_from_schema, OperationHandler, ParamLocation};

impl<S> crate::axum::ApiRouter<S>
where
    S: Clone + Send + Sync + 'static,
{
    /// Add a typed `GET` route to the router.
    ///
    /// The path will be inferred from the first argument to the handler function which must
    /// implement [`TypedPath`].
    pub fn typed_get<H, I, O, T, P>(self, handler: H) -> Self
    where
        H: axum::handler::Handler<T, S> + OperationHandler<I, O>,
        T: SecondElementIs<P> + 'static,
        I: OperationInput,
        O: OperationOutput,
        P: axum_extra::routing::TypedPath + schemars::JsonSchema + OperationInput,
    {
        self.api_route(P::PATH, crate::axum::routing::get(handler))
    }

    /// Add a typed `GET` route to the router.
    ///
    /// The path will be inferred from the first argument to the handler function which must
    /// implement [`TypedPath`].
    ///
    /// This method additionally accepts a transform function. See [`crate::axum`] for more details.
    pub fn typed_get_with<H, I, O, T, P, F>(self, handler: H, transform: F) -> Self
    where
        H: axum::handler::Handler<T, S> + OperationHandler<I, O>,
        T: SecondElementIs<P> + 'static,
        I: OperationInput,
        O: OperationOutput,
        P: axum_extra::routing::TypedPath + schemars::JsonSchema + OperationInput,
        F: FnOnce(TransformOperation<'_>) -> TransformOperation<'_>,
    {
        self.api_route(P::PATH, crate::axum::routing::get_with(handler, transform))
    }

    /// Add a typed `DELETE` route to the router.
    ///
    /// The path will be inferred from the first argument to the handler function which must
    /// implement [`TypedPath`].
    pub fn typed_delete<H, I, O, T, P>(self, handler: H) -> Self
    where
        H: axum::handler::Handler<T, S> + OperationHandler<I, O>,
        T: SecondElementIs<P> + 'static,
        I: OperationInput,
        O: OperationOutput,
        P: axum_extra::routing::TypedPath + schemars::JsonSchema + OperationInput,
    {
        self.api_route(P::PATH, crate::axum::routing::delete(handler))
    }

    /// Add a typed `DELETE` route to the router.
    ///
    /// The path will be inferred from the first argument to the handler function which must
    /// implement [`TypedPath`].
    ///
    /// This method additionally accepts a transform function. See [`crate::axum`] for more details.
    pub fn typed_delete_with<H, I, O, T, P, F>(self, handler: H, transform: F) -> Self
    where
        H: axum::handler::Handler<T, S> + OperationHandler<I, O>,
        T: SecondElementIs<P> + 'static,
        I: OperationInput,
        O: OperationOutput,
        P: axum_extra::routing::TypedPath + schemars::JsonSchema + OperationInput,
        F: FnOnce(TransformOperation<'_>) -> TransformOperation<'_>,
    {
        self.api_route(
            P::PATH,
            crate::axum::routing::delete_with(handler, transform),
        )
    }

    /// Add a typed `HEAD` route to the router.
    ///
    /// The path will be inferred from the first argument to the handler function which must
    /// implement [`TypedPath`].
    pub fn typed_head<H, I, O, T, P>(self, handler: H) -> Self
    where
        H: axum::handler::Handler<T, S> + OperationHandler<I, O>,
        T: SecondElementIs<P> + 'static,
        I: OperationInput,
        O: OperationOutput,
        P: axum_extra::routing::TypedPath + schemars::JsonSchema + OperationInput,
    {
        self.api_route(P::PATH, crate::axum::routing::head(handler))
    }

    /// Add a typed `HEAD` route to the router.
    ///
    /// The path will be inferred from the first argument to the handler function which must
    /// implement [`TypedPath`].
    ///
    /// This method additionally accepts a transform function. See [`crate::axum`] for more details.
    pub fn typed_head_with<H, I, O, T, P, F>(self, handler: H, transform: F) -> Self
    where
        H: axum::handler::Handler<T, S> + OperationHandler<I, O>,
        T: SecondElementIs<P> + 'static,
        I: OperationInput,
        O: OperationOutput,
        P: axum_extra::routing::TypedPath + schemars::JsonSchema + OperationInput,
        F: FnOnce(TransformOperation<'_>) -> TransformOperation<'_>,
    {
        self.api_route(P::PATH, crate::axum::routing::head_with(handler, transform))
    }

    /// Add a typed `OPTIONS` route to the router.
    ///
    /// The path will be inferred from the first argument to the handler function which must
    /// implement [`TypedPath`].
    pub fn typed_options<H, I, O, T, P>(self, handler: H) -> Self
    where
        H: axum::handler::Handler<T, S> + OperationHandler<I, O>,
        T: SecondElementIs<P> + 'static,
        I: OperationInput,
        O: OperationOutput,
        P: axum_extra::routing::TypedPath + schemars::JsonSchema + OperationInput,
    {
        self.api_route(P::PATH, crate::axum::routing::options(handler))
    }

    /// Add a typed `OPTIONS` route to the router.
    ///
    /// The path will be inferred from the first argument to the handler function which must
    /// implement [`TypedPath`].
    ///
    /// This method additionally accepts a transform function. See [`crate::axum`] for more details.
    pub fn typed_options_with<H, I, O, T, P, F>(self, handler: H, transform: F) -> Self
    where
        H: axum::handler::Handler<T, S> + OperationHandler<I, O>,
        T: SecondElementIs<P> + 'static,
        I: OperationInput,
        O: OperationOutput,
        P: axum_extra::routing::TypedPath + schemars::JsonSchema + OperationInput,
        F: FnOnce(TransformOperation<'_>) -> TransformOperation<'_>,
    {
        self.api_route(
            P::PATH,
            crate::axum::routing::options_with(handler, transform),
        )
    }

    /// Add a typed `PATCH` route to the router.
    ///
    /// The path will be inferred from the first argument to the handler function which must
    /// implement [`TypedPath`].
    pub fn typed_patch<H, I, O, T, P>(self, handler: H) -> Self
    where
        H: axum::handler::Handler<T, S> + OperationHandler<I, O>,
        T: SecondElementIs<P> + 'static,
        I: OperationInput,
        O: OperationOutput,
        P: axum_extra::routing::TypedPath + schemars::JsonSchema + OperationInput,
    {
        self.api_route(P::PATH, crate::axum::routing::patch(handler))
    }

    /// Add a typed `PATCH` route to the router.
    ///
    /// The path will be inferred from the first argument to the handler function which must
    /// implement [`TypedPath`].
    ///
    /// This method additionally accepts a transform function. See [`crate::axum`] for more details.
    pub fn typed_patch_with<H, I, O, T, P, F>(self, handler: H, transform: F) -> Self
    where
        H: axum::handler::Handler<T, S> + OperationHandler<I, O>,
        T: SecondElementIs<P> + 'static,
        I: OperationInput,
        O: OperationOutput,
        P: axum_extra::routing::TypedPath + schemars::JsonSchema + OperationInput,
        F: FnOnce(TransformOperation<'_>) -> TransformOperation<'_>,
    {
        self.api_route(
            P::PATH,
            crate::axum::routing::patch_with(handler, transform),
        )
    }

    /// Add a typed `POST` route to the router.
    ///
    /// The path will be inferred from the first argument to the handler function which must
    /// implement [`TypedPath`].
    pub fn typed_post<H, I, O, T, P>(self, handler: H) -> Self
    where
        H: axum::handler::Handler<T, S> + OperationHandler<I, O>,
        T: SecondElementIs<P> + 'static,
        I: OperationInput,
        O: OperationOutput,
        P: axum_extra::routing::TypedPath + schemars::JsonSchema + OperationInput,
    {
        self.api_route(P::PATH, crate::axum::routing::post(handler))
    }

    /// Add a typed `POST` route to the router.
    ///
    /// The path will be inferred from the first argument to the handler function which must
    /// implement [`TypedPath`].
    ///
    /// This method additionally accepts a transform function. See [`crate::axum`] for more details.
    pub fn typed_post_with<H, I, O, T, P, F>(self, handler: H, transform: F) -> Self
    where
        H: axum::handler::Handler<T, S> + OperationHandler<I, O>,
        T: SecondElementIs<P> + 'static,
        I: OperationInput,
        O: OperationOutput,
        P: axum_extra::routing::TypedPath + schemars::JsonSchema + OperationInput,
        F: FnOnce(TransformOperation<'_>) -> TransformOperation<'_>,
    {
        self.api_route(P::PATH, crate::axum::routing::post_with(handler, transform))
    }

    /// Add a typed `PUT` route to the router.
    ///
    /// The path will be inferred from the first argument to the handler function which must
    /// implement [`TypedPath`].
    pub fn typed_put<H, I, O, T, P>(self, handler: H) -> Self
    where
        H: axum::handler::Handler<T, S> + OperationHandler<I, O>,
        T: SecondElementIs<P> + 'static,
        I: OperationInput,
        O: OperationOutput,
        P: axum_extra::routing::TypedPath + schemars::JsonSchema + OperationInput,
    {
        self.api_route(P::PATH, crate::axum::routing::put(handler))
    }

    /// Add a typed `PUT` route to the router.
    ///
    /// The path will be inferred from the first argument to the handler function which must
    /// implement [`TypedPath`].
    ///
    /// This method additionally accepts a transform function. See [`crate::axum`] for more details.
    pub fn typed_put_with<H, I, O, T, P, F>(self, handler: H, transform: F) -> Self
    where
        H: axum::handler::Handler<T, S> + OperationHandler<I, O>,
        T: SecondElementIs<P> + 'static,
        I: OperationInput,
        O: OperationOutput,
        P: axum_extra::routing::TypedPath + schemars::JsonSchema + OperationInput,
        F: FnOnce(TransformOperation<'_>) -> TransformOperation<'_>,
    {
        self.api_route(P::PATH, crate::axum::routing::put_with(handler, transform))
    }

    /// Add a typed `TRACE` route to the router.
    ///
    /// The path will be inferred from the first argument to the handler function which must
    /// implement [`TypedPath`].
    pub fn typed_trace<H, I, O, T, P>(self, handler: H) -> Self
    where
        H: axum::handler::Handler<T, S> + OperationHandler<I, O>,
        T: SecondElementIs<P> + 'static,
        I: OperationInput,
        O: OperationOutput,
        P: axum_extra::routing::TypedPath + schemars::JsonSchema + OperationInput,
    {
        self.api_route(P::PATH, crate::axum::routing::trace(handler))
    }

    /// Add a typed `TRACE` route to the router.
    ///
    /// The path will be inferred from the first argument to the handler function which must
    /// implement [`TypedPath`].
    ///
    /// This method additionally accepts a transform function. See [`crate::axum`] for more details.
    pub fn typed_trace_with<H, I, O, T, P, F>(self, handler: H, transform: F) -> Self
    where
        H: axum::handler::Handler<T, S> + OperationHandler<I, O>,
        T: SecondElementIs<P> + 'static,
        I: OperationInput,
        O: OperationOutput,
        P: axum_extra::routing::TypedPath + schemars::JsonSchema + OperationInput,
        F: FnOnce(TransformOperation<'_>) -> TransformOperation<'_>,
    {
        self.api_route(
            P::PATH,
            crate::axum::routing::trace_with(handler, transform),
        )
    }
}

/// A wrapper around `axum_extra::routing::TypedPath` to implement `OperationInput`.
/// Basically fix for Rust does not support `!Trait` and specialization on stable.
#[derive(Debug)]
pub struct TypedPath<T: axum_extra::routing::TypedPath + JsonSchema>(pub T);

impl<T> OperationInput for TypedPath<T>
where
    T: axum_extra::routing::TypedPath + JsonSchema,
{
    fn operation_input(ctx: &mut crate::generate::GenContext, operation: &mut Operation) {
        // `subschema_for` `description` is none, while `root_schema_for` is some
        let root_schema = ctx.schema.root_schema_for::<T>();
        operation.description = root_schema
            .get("description")
            .and_then(|d| d.as_str())
            .map(String::from);

        // Take the parameters from `subschema_for` rather than reusing the root
        // schema: `root_schema_for` has already applied the generator's
        // transforms, and `parameters_from_schema` applies them again, so
        // passing the root schema here would transform it twice.
        let schema = ctx.schema.subschema_for::<T>();
        let params = parameters_from_schema(ctx, schema, ParamLocation::Path);
        add_parameters(ctx, operation, params);
    }
}

impl<T, S> axum::extract::FromRequestParts<S> for TypedPath<T>
where
    T: DeserializeOwned + Send + axum_extra::routing::TypedPath + JsonSchema,
    S: Send + Sync,
{
    type Rejection = PathRejection;

    async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
        let path = axum::extract::Path::<T>::from_request_parts(parts, state).await?;
        Ok(Self(path.0))
    }
}

impl<T, S> axum::extract::OptionalFromRequestParts<S> for TypedPath<T>
where
    T: DeserializeOwned + Send + 'static + axum_extra::routing::TypedPath + JsonSchema,
    S: Send + Sync,
{
    type Rejection = PathRejection;

    async fn from_request_parts(
        parts: &mut Parts,
        state: &S,
    ) -> Result<Option<Self>, Self::Rejection> {
        let path = axum::extract::Path::<T>::from_request_parts(parts, state).await?;
        Ok(path.map(|x| Self(x.0)))
    }
}

#[cfg(test)]
mod tests {
    use super::TypedPath;
    use crate::{generate, openapi::Operation, OperationInput};
    use schemars::{transform::Transform, JsonSchema};

    /// Records how many times the generator's transforms have run over a schema.
    #[derive(Debug, Clone)]
    struct CountPasses;

    impl Transform for CountPasses {
        fn transform(&mut self, schema: &mut schemars::Schema) {
            schemars::transform::transform_subschemas(self, schema);
            let passes = schema
                .get("x-passes")
                .and_then(serde_json::Value::as_u64)
                .unwrap_or(0);
            schema.insert("x-passes".to_owned(), (passes + 1).into());
        }
    }

    #[derive(JsonSchema)]
    #[allow(dead_code)]
    struct UserPath {
        id: String,
    }

    impl std::fmt::Display for UserPath {
        fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
            f.write_str("/users/x")
        }
    }

    impl axum_extra::routing::TypedPath for UserPath {
        const PATH: &'static str = "/users/{id}";
    }

    /// `TypedPath` reads the operation description out of `root_schema_for`,
    /// which has already applied the generator's transforms. The parameters must
    /// not be taken from that same schema, or every transform runs twice.
    ///
    /// Transforms are not required to be idempotent, so a second pass can
    /// corrupt the parameter schemas rather than merely repeat work.
    #[test]
    fn typed_path_parameters_are_transformed_exactly_once() {
        let mut operation = Operation::default();

        generate::in_context(|ctx| {
            let settings = schemars::generate::SchemaSettings::draft07().with(|s| {
                s.inline_subschemas = false;
                s.definitions_path = "#/components/schemas/".into();
                s.transforms = vec![Box::new(CountPasses)];
            });
            ctx.schema = schemars::SchemaGenerator::new(settings);

            <TypedPath<UserPath> as OperationInput>::operation_input(ctx, &mut operation);
        });
        generate::reset_context();

        let param = operation
            .parameters
            .first()
            .expect("one path parameter")
            .as_item()
            .expect("inline parameter");
        let crate::openapi::ParameterSchemaOrContent::Schema(schema) =
            &param.parameter_data_ref().format
        else {
            panic!("expected a schema, not content");
        };

        assert_eq!(
            schema.json_schema.get("x-passes"),
            Some(&serde_json::json!(1)),
            "transforms should run exactly once, got {:?}",
            schema.json_schema
        );
    }
}
