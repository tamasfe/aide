use crate::{
    openapi::{MediaType, Operation, Response, SchemaObject, StatusCode},
    util::no_content_response,
};
#[cfg(feature = "axum-form")]
use axum::extract::rejection::FormRejection;
#[cfg(feature = "axum-json")]
use axum::extract::rejection::JsonRejection;
use axum::response::{Html, NoContent, Redirect};
use indexmap::IndexMap;
use schemars::json_schema;
#[cfg(any(feature = "axum-form", feature = "axum-json"))]
use schemars::JsonSchema;

use crate::{generate::GenContext, operation::OperationOutput};

impl OperationOutput for NoContent {
    type Inner = ();

    fn operation_response(_ctx: &mut GenContext, _operation: &mut Operation) -> Option<Response> {
        Some(no_content_response())
    }

    fn inferred_responses(
        _ctx: &mut GenContext,
        _operation: &mut Operation,
    ) -> Vec<(Option<StatusCode>, Response)> {
        vec![(Some(StatusCode::Code(204)), no_content_response())]
    }
}

#[cfg(feature = "axum-json")]
impl<T> OperationOutput for axum::Json<T>
where
    T: JsonSchema,
{
    type Inner = T;

    fn operation_response(ctx: &mut GenContext, _operation: &mut Operation) -> Option<Response> {
        let json_schema = ctx.schema.subschema_for::<T>();
        let resolved_schema = ctx.resolve_schema(&json_schema);

        Some(Response {
            description: resolved_schema
                .get("description")
                .and_then(|d| d.as_str())
                .map(String::from)
                .unwrap_or_default(),
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
            ..Default::default()
        })
    }

    fn inferred_responses(
        ctx: &mut crate::generate::GenContext,
        operation: &mut Operation,
    ) -> Vec<(Option<StatusCode>, Response)> {
        if let Some(res) = Self::operation_response(ctx, operation) {
            let success_response = [(Some(StatusCode::Code(200)), res)];

            if ctx.all_error_responses {
                [
                    &success_response,
                    JsonRejection::inferred_responses(ctx, operation).as_slice(),
                ]
                .concat()
            } else {
                Vec::from(success_response)
            }
        } else {
            Vec::new()
        }
    }
}

#[cfg(feature = "axum-form")]
impl<T> OperationOutput for axum::extract::Form<T>
where
    T: JsonSchema,
{
    type Inner = T;

    fn operation_response(ctx: &mut GenContext, _operation: &mut Operation) -> Option<Response> {
        let json_schema = ctx.schema.subschema_for::<T>();
        let resolved_schema = ctx.resolve_schema(&json_schema);

        Some(Response {
            description: resolved_schema
                .get("description")
                .and_then(|d| d.as_str())
                .map(String::from)
                .unwrap_or_default(),
            content: IndexMap::from_iter([(
                "application/x-www-form-urlencoded".into(),
                MediaType {
                    schema: Some(SchemaObject {
                        json_schema: json_schema.into(),
                        example: None,
                        external_docs: None,
                    }),
                    ..Default::default()
                },
            )]),
            ..Default::default()
        })
    }

    fn inferred_responses(
        ctx: &mut crate::generate::GenContext,
        operation: &mut Operation,
    ) -> Vec<(Option<StatusCode>, Response)> {
        if let Some(res) = Self::operation_response(ctx, operation) {
            let success_response = [(Some(StatusCode::Code(200)), res)];

            if ctx.all_error_responses {
                [
                    &success_response,
                    FormRejection::inferred_responses(ctx, operation).as_slice(),
                ]
                .concat()
            } else {
                Vec::from(success_response)
            }
        } else {
            Vec::new()
        }
    }
}

impl<T> OperationOutput for Html<T> {
    type Inner = String;

    fn operation_response(_ctx: &mut GenContext, _operation: &mut Operation) -> Option<Response> {
        Some(Response {
            description: "HTML content".into(),
            content: IndexMap::from_iter([(
                "text/html".into(),
                MediaType {
                    schema: Some(SchemaObject {
                        json_schema: json_schema!({
                            "type": "string",
                        }),
                        example: None,
                        external_docs: None,
                    }),
                    ..Default::default()
                },
            )]),
            ..Default::default()
        })
    }

    fn inferred_responses(
        ctx: &mut crate::generate::GenContext,
        operation: &mut Operation,
    ) -> Vec<(Option<StatusCode>, Response)> {
        if let Some(res) = Self::operation_response(ctx, operation) {
            Vec::from([(Some(StatusCode::Code(200)), res)])
        } else {
            Vec::new()
        }
    }
}

#[cfg(feature = "axum-json")]
impl OperationOutput for JsonRejection {
    type Inner = Self;

    fn operation_response(ctx: &mut GenContext, operation: &mut Operation) -> Option<Response> {
        String::operation_response(ctx, operation)
    }

    fn inferred_responses(
        ctx: &mut crate::generate::GenContext,
        operation: &mut Operation,
    ) -> Vec<(Option<StatusCode>, Response)> {
        if let Some(res) = Self::operation_response(ctx, operation) {
            Vec::from([
                // rejection_response(StatusCode::BAD_REQUEST, &res),
                rejection_response(
                    StatusCode::Code(http::StatusCode::PAYLOAD_TOO_LARGE.into()),
                    &res,
                ),
                rejection_response(
                    StatusCode::Code(http::StatusCode::UNSUPPORTED_MEDIA_TYPE.into()),
                    &res,
                ),
                // rejection_response(StatusCode::UNPROCESSABLE_ENTITY, &res),
            ])
        } else {
            Vec::new()
        }
    }
}

#[cfg(feature = "axum-form")]
impl OperationOutput for FormRejection {
    type Inner = Self;

    fn operation_response(ctx: &mut GenContext, operation: &mut Operation) -> Option<Response> {
        String::operation_response(ctx, operation)
    }

    fn inferred_responses(
        ctx: &mut crate::generate::GenContext,
        operation: &mut Operation,
    ) -> Vec<(Option<StatusCode>, Response)> {
        if let Some(res) = Self::operation_response(ctx, operation) {
            Vec::from([
                // rejection_response(StatusCode::BAD_REQUEST, &res),
                rejection_response(
                    StatusCode::Code(http::StatusCode::PAYLOAD_TOO_LARGE.into()),
                    &res,
                ),
                rejection_response(
                    StatusCode::Code(http::StatusCode::UNSUPPORTED_MEDIA_TYPE.into()),
                    &res,
                ),
                // rejection_response(StatusCode::UNPROCESSABLE_ENTITY, &res),
            ])
        } else {
            Vec::new()
        }
    }
}

#[cfg(any(feature = "axum-json", feature = "axum-form"))]
fn rejection_response(
    status_code: StatusCode,
    response: &Response,
) -> (Option<StatusCode>, Response) {
    (Some(status_code), response.clone())
}

impl OperationOutput for Redirect {
    type Inner = Self;
    fn operation_response(_ctx: &mut GenContext, _operation: &mut Operation) -> Option<Response> {
        Some(Response {
            description: "A redirect to the described URL".to_string(),
            ..Default::default()
        })
    }
}

#[cfg(feature = "axum-extra")]
#[allow(unused_imports)]
mod extra {
    use axum_extra::{extract, response};

    use super::*;
    use crate::{
        openapi::{
            Header, HeaderStyle, MediaType, ParameterSchemaOrContent, ReferenceOr, Response,
            SchemaObject,
        },
        operation::OperationOutput,
    };

    #[cfg(feature = "axum-extra-cookie")]
    impl OperationOutput for extract::CookieJar {
        type Inner = ();
    }

    #[cfg(feature = "axum-extra-cookie-private")]
    impl OperationOutput for extract::PrivateCookieJar {
        type Inner = ();
    }

    #[cfg(feature = "axum-extra-attachment")]
    impl<T> OperationOutput for response::Attachment<T> {
        type Inner = Self;

        fn operation_response(
            _ctx: &mut GenContext,
            _operation: &mut Operation,
        ) -> Option<Response> {
            Some(Response {
                description: "File download".to_owned(),
                headers: [
                    (
                        "Content-Disposition".to_owned(),
                        ReferenceOr::Item(Header {
                            description: Some(
                                "Controls download behavior. Use `attachment` to prompt save dialog, `inline` to display in browser. Includes suggested filename."
                                    .to_owned(),
                            ),
                            required: false,
                            format: ParameterSchemaOrContent::Schema(SchemaObject {
                                json_schema: json_schema!({
                                    "type": "string",
                                }),
                                example: None,
                                external_docs: None,
                            }),
                            extensions: Default::default(),
                            deprecated: None,
                            example: Some(serde_json::json!(r#"attachment; filename="xyz.pdf""#)),
                            examples: IndexMap::default(),
                            style: HeaderStyle::Simple,
                        }),
                    ),
                    (
                        "Content-Type".to_owned(),
                        ReferenceOr::Item(Header {
                            description: Some("MIME type of the file".to_owned()),
                            required: false,
                            format: ParameterSchemaOrContent::Schema(SchemaObject {
                                json_schema: json_schema!({
                                    "type": "string",
                                }),
                                external_docs: None,
                                example: None,
                            }),
                            extensions: Default::default(),
                            deprecated: None,
                            example: Some(serde_json::json!("application/pdf")),
                            examples: IndexMap::default(),
                            style: HeaderStyle::Simple,
                        }),
                    ),
                ]
                .into_iter()
                .collect(),
                content: [("application/octet-stream".to_owned(), MediaType::default())] .into_iter()
                .collect(),
                ..Default::default()
            })
        }

        fn inferred_responses(
            ctx: &mut GenContext,
            operation: &mut Operation,
        ) -> Vec<(Option<StatusCode>, Response)> {
            Self::operation_response(ctx, operation)
                .map(|r| vec![(Some(StatusCode::Code(200)), r)])
                .unwrap_or_default()
        }
    }
}
