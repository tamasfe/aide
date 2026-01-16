#![allow(unused_imports)]
use crate::{
    openapi::{
        self, Header, MediaType, Operation, Parameter, ParameterData, ReferenceOr, RequestBody,
        Response, SchemaObject, StatusCode,
    },
    operation::{add_parameters, set_body},
};
use axum::{
    body::Body,
    extract::{Extension, Path, RawQuery, State},
};

use indexmap::IndexMap;
use schemars::{json_schema, JsonSchema, Schema};
use serde_json::json;

use crate::{
    error::Error,
    operation::{parameters_from_schema, OperationInput, ParamLocation},
};

impl<T> OperationInput for Extension<T> {}
impl<T> OperationInput for State<T> {}

impl OperationInput for Body {}
impl OperationInput for RawQuery {}

#[cfg(feature = "axum-tokio")]
impl<T> OperationInput for axum::extract::ConnectInfo<T> {}
#[cfg(feature = "axum-matched-path")]
impl OperationInput for axum::extract::MatchedPath {}
#[cfg(feature = "axum-original-uri")]
impl OperationInput for axum::extract::OriginalUri {}

#[cfg(feature = "axum-extra-headers")]
impl<T> OperationInput for axum_extra::typed_header::TypedHeader<T>
where
    T: axum_extra::headers::Header,
{
    fn operation_input(ctx: &mut crate::generate::GenContext, operation: &mut Operation) {
        let s = ctx.schema.subschema_for::<String>();
        add_parameters(
            ctx,
            operation,
            [Parameter::Header {
                parameter_data: ParameterData {
                    name: T::name().to_string(),
                    description: None,
                    required: true,
                    format: crate::openapi::ParameterSchemaOrContent::Schema(
                        openapi::SchemaObject {
                            json_schema: s,
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
            }],
        );
    }
}

#[cfg(any(feature = "axum-json", feature = "axum-extra-json-deserializer"))]
fn operation_input_json<T: JsonSchema>(
    ctx: &mut crate::generate::GenContext,
    operation: &mut Operation,
) {
    let json_schema = ctx.schema.subschema_for::<T>();
    let mut resolved_schema = ctx.resolve_schema(&json_schema).clone();

    for transform in ctx.schema.transforms_mut() {
        transform.transform(&mut resolved_schema);
    }

    set_body(
        ctx,
        operation,
        RequestBody {
            description: resolved_schema
                .get("description")
                .and_then(|d| d.as_str())
                .map(String::from),
            content: IndexMap::from_iter([(
                "application/json".into(),
                MediaType {
                    schema: Some(SchemaObject {
                        json_schema,
                        example: None,
                        external_docs: None,
                    }),
                    ..Default::default()
                },
            )]),
            required: true,
            extensions: IndexMap::default(),
        },
    );
}

#[cfg(feature = "axum-json")]
impl<T> OperationInput for axum::Json<T>
where
    T: JsonSchema,
{
    fn operation_input(ctx: &mut crate::generate::GenContext, operation: &mut Operation) {
        operation_input_json::<T>(ctx, operation);
    }
}

#[cfg(feature = "axum-extra-json-deserializer")]
impl<T> OperationInput for axum_extra::extract::JsonDeserializer<T>
where
    T: JsonSchema,
{
    fn operation_input(ctx: &mut crate::generate::GenContext, operation: &mut Operation) {
        operation_input_json::<T>(ctx, operation);
    }
}

#[cfg(feature = "axum-form")]
impl<T> OperationInput for axum::extract::Form<T>
where
    T: JsonSchema,
{
    fn operation_input(ctx: &mut crate::generate::GenContext, operation: &mut Operation) {
        let schema = ctx.schema.subschema_for::<T>();
        let resolved_schema = ctx.resolve_schema(&schema);

        set_body(
            ctx,
            operation,
            RequestBody {
                description: resolved_schema
                    .get("description")
                    .and_then(|d| d.as_str())
                    .map(String::from),
                content: IndexMap::from_iter([(
                    "application/x-www-form-urlencoded".into(),
                    MediaType {
                        schema: Some(SchemaObject {
                            json_schema: schema.into(),
                            example: None,
                            external_docs: None,
                        }),
                        ..Default::default()
                    },
                )]),
                required: true,
                extensions: IndexMap::default(),
            },
        );
    }
}

impl<T> OperationInput for Path<T>
where
    T: JsonSchema,
{
    fn operation_input(ctx: &mut crate::generate::GenContext, operation: &mut Operation) {
        let schema = ctx.schema.subschema_for::<T>();
        let params = parameters_from_schema(ctx, schema, ParamLocation::Path);
        add_parameters(ctx, operation, params);
    }
}

#[cfg(feature = "axum-query")]
impl<T> OperationInput for axum::extract::Query<T>
where
    T: JsonSchema,
{
    fn operation_input(ctx: &mut crate::generate::GenContext, operation: &mut Operation) {
        let schema = ctx.schema.subschema_for::<T>();
        let params = parameters_from_schema(ctx, schema, ParamLocation::Query);
        add_parameters(ctx, operation, params);
    }
}

#[cfg(feature = "axum-ws")]
impl OperationInput for axum::extract::ws::WebSocketUpgrade {
    fn operation_input(
        ctx: &mut crate::generate::GenContext,
        operation: &mut crate::openapi::Operation,
    ) {
        if operation.responses.is_none() {
            operation.responses = Some(Default::default());
        }

        let responses = operation.responses.as_mut().unwrap();

        let existing = responses.responses.insert(
            StatusCode::Code(101),
            ReferenceOr::Item(Response {
                description: "websocket upgrade".into(),
                headers: IndexMap::from_iter([
                    (
                        "connection".to_string(),
                        ReferenceOr::Item(Header {
                            description: None,
                            style: crate::openapi::HeaderStyle::Simple,
                            required: false,
                            deprecated: None,
                            format: crate::openapi::ParameterSchemaOrContent::Schema(
                                SchemaObject {
                                    json_schema: json_schema!({
                                        "type": "string",
                                        "enum": ["upgrade"],
                                        "const": "upgrade",
                                    }),
                                    external_docs: None,
                                    example: Some(json!("upgrade")),
                                },
                            ),
                            example: None,
                            examples: Default::default(),
                            extensions: Default::default(),
                        }),
                    ),
                    (
                        "upgrade".to_string(),
                        ReferenceOr::Item(Header {
                            description: None,
                            style: crate::openapi::HeaderStyle::Simple,
                            required: false,
                            deprecated: None,
                            format: crate::openapi::ParameterSchemaOrContent::Schema(
                                SchemaObject {
                                    json_schema: json_schema!({
                                        "type": "string",
                                        "enum": ["websocket"],
                                        "const": "websocket",
                                    }),
                                    external_docs: None,
                                    example: Some(json!("websocket")),
                                },
                            ),
                            example: None,
                            examples: Default::default(),
                            extensions: Default::default(),
                        }),
                    ),
                    (
                        "sec-websocket-key".to_string(),
                        ReferenceOr::Item(Header {
                            description: None,
                            style: crate::openapi::HeaderStyle::Simple,
                            required: false,
                            deprecated: None,
                            format: crate::openapi::ParameterSchemaOrContent::Schema(
                                SchemaObject {
                                    json_schema: json_schema!({
                                        "type": "string",
                                    }),
                                    external_docs: None,
                                    example: None,
                                },
                            ),
                            example: None,
                            examples: Default::default(),
                            extensions: Default::default(),
                        }),
                    ),
                    (
                        "sec-websocket-protocol".to_string(),
                        ReferenceOr::Item(Header {
                            description: None,
                            style: crate::openapi::HeaderStyle::Simple,
                            required: false,
                            deprecated: None,
                            format: crate::openapi::ParameterSchemaOrContent::Schema(
                                SchemaObject {
                                    json_schema: json_schema!({
                                        "type": "string",
                                    }),
                                    external_docs: None,
                                    example: None,
                                },
                            ),
                            example: None,
                            examples: Default::default(),
                            extensions: Default::default(),
                        }),
                    ),
                ]),
                ..Default::default()
            }),
        );

        if existing.is_some() {
            ctx.error(Error::ResponseExists(StatusCode::Code(101)));
        }
    }
}

#[cfg(feature = "axum-multipart")]
impl OperationInput for axum::extract::Multipart {
    fn operation_input(ctx: &mut crate::generate::GenContext, operation: &mut Operation) {
        set_body(
            ctx,
            operation,
            RequestBody {
                description: Some("multipart form data".into()),
                content: IndexMap::from_iter([(
                    "multipart/form-data".into(),
                    MediaType {
                        schema: Some(SchemaObject {
                            json_schema: json_schema!({
                                "type": "array",
                            }),
                            external_docs: None,
                            example: None,
                        }),
                        ..Default::default()
                    },
                )]),
                required: true,
                extensions: IndexMap::default(),
            },
        );
    }
}

#[cfg(feature = "axum-extra-cached")]
impl<T> OperationInput for axum_extra::extract::Cached<T>
where
    T: OperationInput,
{
    fn operation_input(
        ctx: &mut crate::generate::GenContext,
        operation: &mut crate::openapi::Operation,
    ) {
        T::operation_input(ctx, operation);
    }
}

#[cfg(feature = "axum-extra-with-rejection")]
impl<T, R> OperationInput for axum_extra::extract::WithRejection<T, R>
where
    T: OperationInput,
{
    fn operation_input(
        ctx: &mut crate::generate::GenContext,
        operation: &mut crate::openapi::Operation,
    ) {
        T::operation_input(ctx, operation);
    }
}

#[cfg(feature = "axum-extra")]
impl OperationInput for axum_extra::extract::Host {}

#[cfg(feature = "axum-extra-cookie")]
impl OperationInput for axum_extra::extract::CookieJar {}

#[cfg(feature = "axum-extra-cookie-private")]
impl OperationInput for axum_extra::extract::PrivateCookieJar {}

#[cfg(feature = "axum-extra-form")]
impl<T> OperationInput for axum_extra::extract::Form<T>
where
    T: JsonSchema,
{
    fn operation_input(ctx: &mut crate::generate::GenContext, operation: &mut Operation) {
        let schema = ctx.schema.subschema_for::<T>();
        let resolved_schema = ctx.resolve_schema(&schema);

        set_body(
            ctx,
            operation,
            RequestBody {
                description: resolved_schema
                    .get("description")
                    .and_then(|d| d.as_str())
                    .map(String::from),
                content: IndexMap::from_iter([(
                    "application/x-www-form-urlencoded".into(),
                    MediaType {
                        schema: Some(SchemaObject {
                            json_schema: schema.into(),
                            example: None,
                            external_docs: None,
                        }),
                        ..Default::default()
                    },
                )]),
                required: true,
                extensions: IndexMap::default(),
            },
        );
    }
}
#[cfg(feature = "axum-extra-query")]
impl<T> OperationInput for axum_extra::extract::Query<T>
where
    T: JsonSchema,
{
    fn operation_input(ctx: &mut crate::generate::GenContext, operation: &mut Operation) {
        let schema = ctx.schema.subschema_for::<T>();
        let params = parameters_from_schema(ctx, schema, ParamLocation::Query);
        add_parameters(ctx, operation, params);
    }
}
