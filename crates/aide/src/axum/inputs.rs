#![allow(unused_imports)]
use crate::{
    openapi::{
        Header, MediaType, Operation, ReferenceOr, RequestBody, Response, SchemaObject, StatusCode,
    },
    operation::{add_parameters, set_body},
};
use axum::extract::{
    BodyStream, ConnectInfo, Extension, Form, Host, Json, MatchedPath, OriginalUri, Path, Query,
    RawBody, RawQuery, State,
};
use indexmap::IndexMap;
use schemars::{
    schema::{ArrayValidation, InstanceType, Schema, SingleOrVec},
    JsonSchema,
};
use serde_json::json;

use crate::{
    error::Error,
    operation::{parameters_from_schema, OperationInput, ParamLocation},
};

impl<T> OperationInput for Extension<T> {}
impl<T> OperationInput for State<T> {}
impl OperationInput for BodyStream {}
impl<T> OperationInput for ConnectInfo<T> {}
impl OperationInput for MatchedPath {}
impl OperationInput for OriginalUri {}
impl OperationInput for RawBody {}
impl OperationInput for RawQuery {}
impl OperationInput for Host {}

impl<T> OperationInput for Json<T>
where
    T: JsonSchema,
{
    fn operation_input(ctx: &mut crate::gen::GenContext, operation: &mut Operation) {
        let schema = ctx.schema.subschema_for::<T>().into_object();
        let resolved_schema = ctx.resolve_schema(&schema);

        set_body(
            ctx,
            operation,
            RequestBody {
                description: resolved_schema
                    .metadata
                    .as_ref()
                    .and_then(|m| m.description.clone()),
                content: IndexMap::from_iter([(
                    "application/json".into(),
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

impl<T> OperationInput for Form<T>
where
    T: JsonSchema,
{
    fn operation_input(ctx: &mut crate::gen::GenContext, operation: &mut Operation) {
        let schema = ctx.schema.subschema_for::<T>().into_object();
        let resolved_schema = ctx.resolve_schema(&schema);

        set_body(
            ctx,
            operation,
            RequestBody {
                description: resolved_schema
                    .metadata
                    .as_ref()
                    .and_then(|m| m.description.clone()),
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
    fn operation_input(ctx: &mut crate::gen::GenContext, operation: &mut Operation) {
        let schema = ctx.schema.subschema_for::<T>().into_object();
        let params = parameters_from_schema(ctx, schema, ParamLocation::Path);
        add_parameters(ctx, operation, params);
    }
}

impl<T> OperationInput for Query<T>
where
    T: JsonSchema,
{
    fn operation_input(ctx: &mut crate::gen::GenContext, operation: &mut Operation) {
        let schema = ctx.schema.subschema_for::<T>().into_object();
        let params = parameters_from_schema(ctx, schema, ParamLocation::Query);
        add_parameters(ctx, operation, params);
    }
}

#[cfg(feature = "axum-ws")]
impl OperationInput for axum::extract::ws::WebSocketUpgrade {
    fn operation_input(
        ctx: &mut crate::gen::GenContext,
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
                                    json_schema: Schema::Object(schemars::schema::SchemaObject {
                                        instance_type: Some(SingleOrVec::Single(Box::new(
                                            InstanceType::String,
                                        ))),
                                        enum_values: Some(vec![json!("upgrade")]),
                                        const_value: Some(json!("upgrade")),
                                        ..Default::default()
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
                                    json_schema: Schema::Object(schemars::schema::SchemaObject {
                                        instance_type: Some(SingleOrVec::Single(Box::new(
                                            InstanceType::String,
                                        ))),
                                        enum_values: Some(vec![json!("websocket")]),
                                        const_value: Some(json!("websocket")),
                                        ..Default::default()
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
                                    json_schema: Schema::Object(schemars::schema::SchemaObject {
                                        instance_type: Some(SingleOrVec::Single(Box::new(
                                            InstanceType::String,
                                        ))),
                                        ..Default::default()
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
                                    json_schema: Schema::Object(schemars::schema::SchemaObject {
                                        instance_type: Some(SingleOrVec::Single(Box::new(
                                            InstanceType::String,
                                        ))),
                                        ..Default::default()
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
    fn operation_input(ctx: &mut crate::gen::GenContext, operation: &mut Operation) {
        set_body(
            ctx,
            operation,
            RequestBody {
                description: Some("multipart form data".into()),
                content: IndexMap::from_iter([(
                    "multipart/form-data".into(),
                    MediaType {
                        schema: Some(SchemaObject {
                            json_schema: Schema::Object(schemars::schema::SchemaObject {
                                instance_type: Some(SingleOrVec::Single(Box::new(
                                    InstanceType::Array,
                                ))),
                                ..Default::default()
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

#[cfg(feature = "axum-extra")]
#[allow(unused_imports)]
mod extra {
    use axum_extra::extract;

    use super::*;
    use crate::operation::OperationInput;

    impl<T> OperationInput for extract::Cached<T>
    where
        T: OperationInput,
    {
        fn operation_input(
            ctx: &mut crate::gen::GenContext,
            operation: &mut crate::openapi::Operation,
        ) {
            T::operation_input(ctx, operation);
        }
    }

    impl<T, R> OperationInput for extract::WithRejection<T, R>
    where
        T: OperationInput,
    {
        fn operation_input(
            ctx: &mut crate::gen::GenContext,
            operation: &mut crate::openapi::Operation,
        ) {
            T::operation_input(ctx, operation);
        }
    }

    #[cfg(feature = "axum-extra-cookie")]
    impl OperationInput for extract::CookieJar {}

    #[cfg(feature = "axum-extra-cookie-private")]
    impl OperationInput for extract::PrivateCookieJar {}

    #[cfg(feature = "axum-extra-form")]
    impl<T> OperationInput for extract::Form<T>
    where
        T: JsonSchema,
    {
        fn operation_input(ctx: &mut crate::gen::GenContext, operation: &mut Operation) {
            let schema = ctx.schema.subschema_for::<T>().into_object();
            let resolved_schema = ctx.resolve_schema(&schema);

            set_body(
                ctx,
                operation,
                RequestBody {
                    description: resolved_schema
                        .metadata
                        .as_ref()
                        .and_then(|m| m.description.clone()),
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
    impl<T> OperationInput for extract::Query<T>
    where
        T: JsonSchema,
    {
        fn operation_input(ctx: &mut crate::gen::GenContext, operation: &mut Operation) {
            let schema = ctx.schema.subschema_for::<T>().into_object();
            let params = parameters_from_schema(ctx, schema, ParamLocation::Query);
            add_parameters(ctx, operation, params);
        }
    }
}
