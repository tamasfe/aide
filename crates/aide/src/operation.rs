//! Traits and utilities for schema generation for operations (handlers).

use indexmap::IndexMap;
use schemars::schema::SchemaObject;

use crate::gen::GenContext;
use crate::openapi::{
    self, Operation, Parameter, ParameterData, QueryStyle, ReferenceOr, RequestBody, Response,
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
    ) -> Vec<(Option<u16>, Response)> {
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
    ) -> Vec<(Option<u16>, Response)> {
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
    schema: SchemaObject,
    location: ParamLocation,
) -> Vec<Parameter> {
    let schema = ctx.resolve_schema(&schema);

    let mut params = Vec::new();
    if let Some(obj) = &schema.object {
        for (name, schema) in &obj.properties {
            let s = schema.clone().into_object();

            match location {
                ParamLocation::Query => {
                    params.push(Parameter::Query {
                        parameter_data: ParameterData {
                            name: name.clone(),
                            description: s.metadata.as_ref().and_then(|m| m.description.clone()),
                            required: obj.required.contains(name),
                            format: crate::openapi::ParameterSchemaOrContent::Schema(
                                openapi::SchemaObject {
                                    json_schema: s.into(),
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
                            description: s.metadata.as_ref().and_then(|m| m.description.clone()),
                            required: obj.required.contains(name),
                            format: crate::openapi::ParameterSchemaOrContent::Schema(
                                openapi::SchemaObject {
                                    json_schema: s.into(),
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
                            description: s.metadata.as_ref().and_then(|m| m.description.clone()),
                            required: obj.required.contains(name),
                            format: crate::openapi::ParameterSchemaOrContent::Schema(
                                openapi::SchemaObject {
                                    json_schema: s.into(),
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
                            description: s.metadata.as_ref().and_then(|m| m.description.clone()),
                            required: obj.required.contains(name),
                            format: crate::openapi::ParameterSchemaOrContent::Schema(
                                openapi::SchemaObject {
                                    json_schema: s.into(),
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
