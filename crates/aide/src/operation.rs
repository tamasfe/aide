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
/// This will enable us to use the extractor in our handlers,
/// but will not add anything to the documentation.
/// To extend the generated documentation refer to some of the provided
/// implementations in this crate.
#[allow(unused_variables)]
pub trait OperationInput {
    /// Modify the operation.
    ///
    /// This method gets mutable access to the
    /// entire operation, it's the implementer's responsibility
    /// to detect errors and only modify the operation as much as needed.
    fn operation_input(ctx: &mut GenContext, operation: &mut Operation) {}
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
pub trait OperationHandler<I: OperationInput> {}

macro_rules! impl_operation_handler {
    ( $($ty:ident),* $(,)? ) => {
        #[allow(non_snake_case)]
        impl<Ret, F, $($ty,)*> OperationHandler<($($ty,)*)> for F
        where
            F: FnOnce($($ty,)*) -> Ret,
            $( $ty: OperationInput, )*
        {}
    };
}

impl<Ret, F> OperationHandler<()> for F where F: FnOnce() -> Ret {}

all_the_tuples!(impl_operation_handler);

/// A trait for operation output schema generation.
///
/// This can be implemented for types that can
/// describe their own output schema.
///
/// All method implementations are optional.
#[allow(unused_variables)]
pub trait OperationOutput {
    /// The type that is used in examples.
    ///
    /// # Examples
    ///
    /// In case of `Json<T>`, this should be `T`,
    /// whereas it should be `Self` for `String`.
    type Inner;

    /// Return a response documentation for this type,
    /// alternatively modify the operation if required.
    ///
    /// This method gets mutable access to the
    /// entire operation, it's the implementer's responsibility
    /// to detect errors and only modify the operation as much as needed.
    fn operation_response(ctx: &mut GenContext, operation: &mut Operation) -> Option<Response> {
        None
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
    _ctx: &mut GenContext,
    schema: SchemaObject,
    location: ParamLocation,
) -> Vec<Parameter> {
    let mut params = Vec::new();
    if let Some(obj) = schema.object {
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
                ParamLocation::Cookie => {
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
