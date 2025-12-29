//! Traits and utilities for schema generation for operations (handlers).

use indexmap::IndexMap;
use schemars::Schema;

use crate::generate::GenContext;
use crate::openapi::{
    self, Operation, Parameter, ParameterData, QueryStyle, ReferenceOr, RequestBody, Response,
    StatusCode,
};
use crate::Error;

#[cfg(feature = "macros")]
pub use aide_macros::OperationIo;

/// A trait for operation input schema generation.
///
/// This must be implemented for all extractors
/// that appear in documented handlers.
///
/// All method implementations are optional.
///
/// # Examples
///
/// In order to allow an extractor to appear in a handler,
/// the following is enough:
///
/// ```
/// use aide::OperationInput;
///
/// struct MyExtractor;
///
/// impl OperationInput for MyExtractor {}
/// ```
///
/// This will enable usage of the extractor in handlers,
/// but will not add anything to the documentation.
/// To extend the generated documentation refer to some of the provided
/// implementations in this crate.
///
/// For simpler cases or wrappers the [`OperationIo`] derive macro
/// can be used to implement this trait.
#[allow(unused_variables)]
pub trait OperationInput {
    /// Modify the operation.
    ///
    /// This method gets mutable access to the
    /// entire operation, it's the implementer's responsibility
    /// to detect errors and only modify the operation as much as needed.
    ///
    /// There are reusable helpers in [`aide::operation`](crate::operation)
    /// to help with both boilerplate and error detection.
    fn operation_input(ctx: &mut GenContext, operation: &mut Operation) {}

    /// Inferred early responses are used to document early returns for
    /// extractors, guards inside handlers. For example these could represent
    /// JSON parsing errors, authentication failures.
    ///
    /// The function is supposed to return `(status code, response)` pairs,
    /// if the status code is not specified, the response is assumed to be
    /// a default response.
    ///
    /// It's important for the implementation to be idempotent.
    ///
    /// See [`OperationOutput::inferred_responses`] for more details.
    fn inferred_early_responses(
        ctx: &mut GenContext,
        operation: &mut Operation,
    ) -> Vec<(Option<StatusCode>, Response)> {
        Vec::new()
    }
}

impl OperationInput for () {}

macro_rules! impl_operation_input {
    ( $($ty:ident),* $(,)? ) => {
        #[allow(non_snake_case)]
        impl<$($ty,)*> OperationInput for ($($ty,)*)
        where
            $( $ty: OperationInput, )*
        {
            fn operation_input(ctx: &mut GenContext, operation: &mut Operation) {
                $(
                    $ty::operation_input(ctx, operation);
                )*
            }

            fn inferred_early_responses(
                ctx: &mut GenContext,
                operation: &mut Operation,
            ) -> Vec<(Option<StatusCode>, Response)> {
                let mut responses = Vec::new();
                $(
                    responses.extend($ty::inferred_early_responses(ctx, operation));
                )*
                responses
            }
        }
    };
}

all_the_tuples!(impl_operation_input);

#[doc(hidden)]
pub trait OperationHandler<I: OperationInput, O: OperationOutput> {}

macro_rules! impl_operation_handler {
    ( $($ty:ident),* $(,)? ) => {
        #[allow(non_snake_case)]
        impl<Ret, F, $($ty,)*> OperationHandler<($($ty,)*), Ret::Output> for F
        where
            F: FnOnce($($ty,)*) -> Ret,
            Ret: std::future::Future,
            Ret::Output: OperationOutput,
            $( $ty: OperationInput, )*
        {}
    };
}

impl<Ret, F> OperationHandler<(), Ret::Output> for F
where
    F: FnOnce() -> Ret,
    Ret: std::future::Future,
    Ret::Output: OperationOutput,
{
}

all_the_tuples!(impl_operation_handler);

/// A trait for operation output schema generation.
///
/// This can be implemented for types that can
/// describe their own output schema.
///
/// All method implementations are optional.
///
/// For simpler cases or wrappers the [`OperationIo`] derive macro
/// can be used to implement this trait.
#[allow(unused_variables)]
pub trait OperationOutput {
    /// The type that is used in examples.
    ///
    /// # Examples
    ///
    /// In case of `Json<T>`, this should be `T`,
    /// whereas for `String` it should be `Self`.
    type Inner;

    /// Return a response documentation for this type,
    /// alternatively modify the operation if required.
    ///
    /// This method gets mutable access to the
    /// entire operation, it's the implementer's responsibility
    /// to detect errors and only modify the operation as much as needed.
    ///
    /// Note that this function **can be called multiple
    /// times for the same operation** and should be idempotent.
    ///
    /// There are reusable helpers in [`aide::operation`](crate::operation)
    /// to help with both boilerplate and error detection.
    fn operation_response(ctx: &mut GenContext, operation: &mut Operation) -> Option<Response> {
        None
    }

    /// Inferred responses are used when the type is
    /// used as a request handler return type.
    ///
    /// The function is supposed to return `(status code, response)` pairs,
    /// if the status code is not specified, the response is assumed to be
    /// a default response.
    ///
    /// As an example `Result<T, E>` could
    /// return `(Some(200), T::operation_response(..))` and
    /// `(None, E::operation_response(..))` to indicate
    /// a successful response and a default error.
    ///
    /// This function can be called after or before `operation_response`,
    /// it's important for the implementation to be idempotent.
    fn inferred_responses(
        ctx: &mut GenContext,
        operation: &mut Operation,
    ) -> Vec<(Option<StatusCode>, Response)> {
        Vec::new()
    }
}

/// Location of an operation parameter.
#[allow(missing_docs)]
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ParamLocation {
    Query,
    Path,
    Header,
    Cookie,
}

/// Generate operation parameters from a JSON schema
/// where the schema is an object, and each
/// property is a parameter.
#[tracing::instrument(skip_all)]
pub fn parameters_from_schema(
    ctx: &mut GenContext,
    schema: Schema,
    location: ParamLocation,
) -> Vec<Parameter> {
    let mut schema = ctx.resolve_schema(&schema).clone();

    for transform in ctx.schema.transforms_mut() {
        transform.transform(&mut schema);
    }

    let mut params = Vec::new();

    if let Some(obj) = schema.as_object() {
        for (name, schema) in obj
            .get("properties")
            .and_then(|p| p.as_object())
            .into_iter()
            .flatten()
        {
            let json_schema: Schema = schema
                .clone()
                .try_into()
                .unwrap_or_else(|err| panic!("Failed to convert schema {schema}: {err:?}"));

            match location {
                ParamLocation::Query => {
                    params.push(Parameter::Query {
                        parameter_data: ParameterData {
                            name: name.clone(),
                            description: json_schema
                                .get("description")
                                .and_then(|d| d.as_str())
                                .map(String::from),
                            required: obj
                                .get("required")
                                .and_then(|r| r.as_array())
                                .is_some_and(|r| r.contains(&name.as_str().into())),
                            format: crate::openapi::ParameterSchemaOrContent::Schema(
                                openapi::SchemaObject {
                                    json_schema,
                                    example: None,
                                    external_docs: None,
                                },
                            ),
                            extensions: Default::default(),
                            deprecated: None,
                            example: None,
                            examples: IndexMap::default(),
                            explode: None,
                        },
                        allow_reserved: false,
                        style: QueryStyle::Form,
                        allow_empty_value: None,
                    });
                }
                ParamLocation::Path => {
                    params.push(Parameter::Path {
                        parameter_data: ParameterData {
                            name: name.clone(),
                            description: json_schema
                                .get("description")
                                .and_then(|d| d.as_str())
                                .map(String::from),
                            required: obj
                                .get("required")
                                .and_then(|r| r.as_array())
                                .is_some_and(|r| r.contains(&name.as_str().into())),
                            format: crate::openapi::ParameterSchemaOrContent::Schema(
                                openapi::SchemaObject {
                                    json_schema,
                                    example: None,
                                    external_docs: None,
                                },
                            ),
                            extensions: Default::default(),
                            deprecated: None,
                            example: None,
                            examples: IndexMap::default(),
                            explode: None,
                        },
                        style: openapi::PathStyle::Simple,
                    });
                }
                ParamLocation::Header => {
                    params.push(Parameter::Header {
                        parameter_data: ParameterData {
                            name: name.clone(),
                            description: json_schema
                                .get("description")
                                .and_then(|d| d.as_str())
                                .map(String::from),
                            required: obj
                                .get("required")
                                .and_then(|r| r.as_array())
                                .is_some_and(|r| r.contains(&name.as_str().into())),
                            format: crate::openapi::ParameterSchemaOrContent::Schema(
                                openapi::SchemaObject {
                                    json_schema,
                                    example: None,
                                    external_docs: None,
                                },
                            ),
                            extensions: Default::default(),
                            deprecated: None,
                            example: None,
                            examples: IndexMap::default(),
                            explode: None,
                        },
                        style: openapi::HeaderStyle::Simple,
                    });
                }
                ParamLocation::Cookie => {
                    params.push(Parameter::Cookie {
                        parameter_data: ParameterData {
                            name: name.clone(),
                            description: json_schema
                                .get("description")
                                .and_then(|d| d.as_str())
                                .map(String::from),
                            required: obj
                                .get("required")
                                .and_then(|r| r.as_array())
                                .is_some_and(|r| r.contains(&name.as_str().into())),
                            format: crate::openapi::ParameterSchemaOrContent::Schema(
                                openapi::SchemaObject {
                                    json_schema,
                                    example: None,
                                    external_docs: None,
                                },
                            ),
                            extensions: Default::default(),
                            deprecated: None,
                            example: None,
                            examples: IndexMap::default(),
                            explode: None,
                        },
                        style: openapi::CookieStyle::Form,
                    });
                }
            }
        }
    }

    params
}

/// Set the body of an operation while
/// reporting errors.
pub fn set_body(ctx: &mut GenContext, operation: &mut Operation, body: RequestBody) {
    if operation.request_body.is_some() {
        ctx.error(Error::DuplicateRequestBody);
    }
    operation.request_body = Some(ReferenceOr::Item(body));
}

/// Add parameters to an operation while
/// reporting errors.
pub fn add_parameters(
    ctx: &mut GenContext,
    operation: &mut Operation,
    params: impl IntoIterator<Item = Parameter>,
) {
    for param in params {
        if operation.parameters.iter().any(|p| match p {
            ReferenceOr::Reference { .. } => false,
            ReferenceOr::Item(p) => p.parameter_data_ref().name == param.parameter_data_ref().name,
        }) {
            ctx.error(Error::DuplicateParameter(
                param.parameter_data_ref().name.clone(),
            ));
        }
        operation.parameters.push(ReferenceOr::Item(param));
    }
}

#[cfg(test)]
mod tests {
    use crate::generate::GenContext;
    use crate::openapi::{Operation, Response, StatusCode};
    use crate::{generate, OperationInput, OperationOutput};
    use aide_macros::OperationIo;
    use schemars::JsonSchema;

    fn assert_default_input_impl<T: OperationInput>(ctx: &mut GenContext) {
        let mut operation = Operation::default();

        T::operation_input(ctx, &mut operation);
        assert_eq!(operation, Operation::default());

        assert_eq!(T::inferred_early_responses(ctx, &mut operation), Vec::new());
        assert_eq!(operation, Operation::default());
    }

    fn assert_default_output_impl<T: OperationOutput<Inner = T>>(ctx: &mut GenContext) {
        let mut operation = Operation::default();

        assert_eq!(T::operation_response(ctx, &mut operation), None);
        assert_eq!(operation, Operation::default());

        assert_eq!(T::inferred_responses(ctx, &mut operation), Vec::new());
        assert_eq!(operation, Operation::default());
    }

    #[test]
    fn operation_io() {
        #[derive(OperationIo)]
        struct OperationInputOutput;
        #[derive(OperationIo)]
        #[aide(input, output)]
        struct OperationInputOutput2;
        #[derive(OperationIo)]
        struct OperationInputOutputGeneric<T>(T);
        #[derive(OperationIo)]
        #[aide(input)]
        struct OperationInput;
        #[derive(OperationIo)]
        #[aide(output)]
        struct OperationOutput;

        generate::in_context(|ctx| {
            assert_default_input_impl::<OperationInputOutput>(ctx);
            assert_default_output_impl::<OperationInputOutput>(ctx);

            assert_default_input_impl::<OperationInputOutput2>(ctx);
            assert_default_output_impl::<OperationInputOutput2>(ctx);

            assert_default_input_impl::<OperationInputOutputGeneric<()>>(ctx);
            assert_default_output_impl::<OperationInputOutputGeneric<()>>(ctx);

            assert_default_input_impl::<OperationInput>(ctx);

            assert_default_output_impl::<OperationOutput>(ctx);
        });
    }

    #[test]
    fn operation_io_with() {
        struct ImplsOperationInput;
        impl OperationInput for ImplsOperationInput {
            fn operation_input(_ctx: &mut GenContext, operation: &mut Operation) {
                // Changing a property of the operation so that we know this function was called
                operation.deprecated = true;
            }
        }

        struct ImplsOperationOutput;
        impl OperationOutput for ImplsOperationOutput {
            type Inner = ();

            fn operation_response(
                _ctx: &mut GenContext,
                _operation: &mut Operation,
            ) -> Option<Response> {
                Some(Response::default())
            }

            fn inferred_responses(
                _ctx: &mut GenContext,
                _operation: &mut Operation,
            ) -> Vec<(Option<StatusCode>, Response)> {
                vec![(None, Response::default())]
            }
        }

        #[derive(OperationIo)]
        #[aide(
            input_with = "ImplsOperationInput",
            output_with = "ImplsOperationOutput"
        )]
        struct OperationIoWith;

        generate::in_context(|ctx| {
            let mut operation = Operation::default();

            OperationIoWith::operation_input(ctx, &mut operation);
            assert!(operation.deprecated);

            assert_eq!(
                OperationIoWith::operation_response(ctx, &mut operation),
                Some(Response::default()),
            );
            assert_eq!(
                OperationIoWith::inferred_responses(ctx, &mut operation),
                vec![(None, Response::default())],
            );
            #[allow(clippy::items_after_statements)]
            fn assert_inner_is_unit<T: OperationOutput<Inner = ()>>() {}
            assert_inner_is_unit::<OperationIoWith>();
        });
    }

    #[test]
    fn operation_io_json_schema() {
        // The `input_with`/`output_with` ensures that this test will only compile if
        // the `json_schema` trait bounds are correct.
        #[derive(OperationIo)]
        #[aide(
            input_with = "OperationInputOutputIfJsonSchema<T, U>",
            output_with = "OperationInputOutputIfJsonSchema<T, U>",
            json_schema
        )]
        struct OperationInputOutput<T, U>(T, U);

        struct OperationInputOutputIfJsonSchema<T, U>(T, U);
        impl<T: JsonSchema, U: JsonSchema> OperationInput for OperationInputOutputIfJsonSchema<T, U> {}
        impl<T: JsonSchema, U: JsonSchema> OperationOutput for OperationInputOutputIfJsonSchema<T, U> {
            type Inner = Self;
        }

        fn assert_impls_operation_input_output<T: OperationInput + OperationOutput>() {}
        assert_impls_operation_input_output::<OperationInputOutput<(), i32>>();
    }
}
