use crate::{
    openapi::{MediaType, Operation, Response, SchemaObject},
    util::no_content_response,
};
#[cfg(feature = "axum-form")]
use axum::extract::rejection::FormRejection;
#[cfg(feature = "axum-json")]
use axum::extract::rejection::JsonRejection;
use axum::response::{Html, NoContent, Redirect};
#[cfg(any(feature = "axum-json", feature = "axum-form"))]
use http::StatusCode;
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
    ) -> Vec<(Option<u16>, Response)> {
        vec![(Some(204), no_content_response())]
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
                .get("metadata")
                .and_then(|m| m.get("description"))
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
    ) -> Vec<(Option<u16>, Response)> {
        if let Some(res) = Self::operation_response(ctx, operation) {
            let success_response = [(Some(200), res)];

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
        let schema = ctx.schema.subschema_for::<T>().into_object();

        Some(Response {
            description: ctx
                .resolve_schema(&schema)
                .metadata
                .as_ref()
                .and_then(|metadata| metadata.description.as_ref())
                .cloned()
                .unwrap_or_default(),
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
            ..Default::default()
        })
    }

    fn inferred_responses(
        ctx: &mut crate::generate::GenContext,
        operation: &mut Operation,
    ) -> Vec<(Option<u16>, Response)> {
        if let Some(res) = Self::operation_response(ctx, operation) {
            let success_response = [(Some(200), res)];

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
    ) -> Vec<(Option<u16>, Response)> {
        if let Some(res) = Self::operation_response(ctx, operation) {
            Vec::from([(Some(200), res)])
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
    ) -> Vec<(Option<u16>, Response)> {
        if let Some(res) = Self::operation_response(ctx, operation) {
            Vec::from([
                // rejection_response(StatusCode::BAD_REQUEST, &res),
                rejection_response(StatusCode::PAYLOAD_TOO_LARGE, &res),
                rejection_response(StatusCode::UNSUPPORTED_MEDIA_TYPE, &res),
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
    ) -> Vec<(Option<u16>, Response)> {
        if let Some(res) = Self::operation_response(ctx, operation) {
            Vec::from([
                // rejection_response(StatusCode::BAD_REQUEST, &res),
                rejection_response(StatusCode::PAYLOAD_TOO_LARGE, &res),
                rejection_response(StatusCode::UNSUPPORTED_MEDIA_TYPE, &res),
                // rejection_response(StatusCode::UNPROCESSABLE_ENTITY, &res),
            ])
        } else {
            Vec::new()
        }
    }
}

#[cfg(any(feature = "axum-json", feature = "axum-form"))]
fn rejection_response(status_code: StatusCode, response: &Response) -> (Option<u16>, Response) {
    (Some(status_code.as_u16()), response.clone())
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
    use axum_extra::extract;

    use super::*;
    use crate::operation::OperationOutput;

    #[cfg(feature = "axum-extra-cookie")]
    impl OperationOutput for extract::CookieJar {
        type Inner = ();
    }

    #[cfg(feature = "axum-extra-cookie-private")]
    impl OperationOutput for extract::PrivateCookieJar {
        type Inner = ();
    }
}
