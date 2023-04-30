use crate::openapi::{MediaType, Operation, Response, SchemaObject};
use axum::{
    extract::rejection::{FormRejection, JsonRejection},
    response::{Html, Redirect},
    Form, Json,
};
use http::StatusCode;
use indexmap::IndexMap;
use schemars::{
    schema::{InstanceType, SingleOrVec},
    JsonSchema,
};

use crate::{gen::GenContext, operation::OperationOutput};

impl<T> OperationOutput for Json<T>
where
    T: JsonSchema,
{
    type Inner = T;

    fn operation_response(ctx: &mut GenContext, _operation: &mut Operation) -> Option<Response> {
        let mut schema = ctx.schema.subschema_for::<T>().into_object();

        Some(Response {
            description: schema.metadata().description.clone().unwrap_or_default(),
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
            ..Default::default()
        })
    }

    fn inferred_responses(
        ctx: &mut crate::gen::GenContext,
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

impl<T> OperationOutput for Form<T>
where
    T: JsonSchema,
{
    type Inner = T;

    fn operation_response(ctx: &mut GenContext, _operation: &mut Operation) -> Option<Response> {
        let mut schema = ctx.schema.subschema_for::<T>().into_object();

        Some(Response {
            description: schema.metadata().description.clone().unwrap_or_default(),
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
        ctx: &mut crate::gen::GenContext,
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
                        json_schema: schemars::schema::SchemaObject {
                            instance_type: Some(SingleOrVec::Single(Box::new(
                                InstanceType::String,
                            ))),
                            ..Default::default()
                        }
                        .into(),
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
        ctx: &mut crate::gen::GenContext,
        operation: &mut Operation,
    ) -> Vec<(Option<u16>, Response)> {
        if let Some(res) = Self::operation_response(ctx, operation) {
            Vec::from([(Some(200), res)])
        } else {
            Vec::new()
        }
    }
}

impl OperationOutput for JsonRejection {
    type Inner = Self;

    fn operation_response(ctx: &mut GenContext, operation: &mut Operation) -> Option<Response> {
        String::operation_response(ctx, operation)
    }

    fn inferred_responses(
        ctx: &mut crate::gen::GenContext,
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

impl OperationOutput for FormRejection {
    type Inner = Self;

    fn operation_response(ctx: &mut GenContext, operation: &mut Operation) -> Option<Response> {
        String::operation_response(ctx, operation)
    }

    fn inferred_responses(
        ctx: &mut crate::gen::GenContext,
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

#[cfg(feature = "jwt_authorizer")]
impl OperationOutput for jwt_authorizer::AuthError {
    type Inner = jwt_authorizer::AuthError;

    fn operation_response(ctx: &mut GenContext, operation: &mut Operation) -> Option<Response> {
        String::operation_response(ctx, operation)
    }

    fn inferred_responses(
        ctx: &mut crate::gen::GenContext,
        operation: &mut Operation,
    ) -> Vec<(Option<u16>, Response)> {
        if let Some(res) = Self::operation_response(ctx, operation) {
            Vec::from([
                rejection_response(StatusCode::UNAUTHORIZED, &res),
                rejection_response(StatusCode::INTERNAL_SERVER_ERROR, &res),
                rejection_response(StatusCode::FORBIDDEN, &res),
            ])
        } else {
            Vec::new()
        }
    }
}

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
    impl OperationOutput for extract::CookieJar { type Inner = (); }

    #[cfg(feature = "axum-extra-cookie-private")]
    impl OperationOutput for extract::PrivateCookieJar { type Inner = (); }
}
