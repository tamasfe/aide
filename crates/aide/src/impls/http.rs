use http::{request::Parts, HeaderMap, Method, Request, Response, StatusCode, Uri, Version};

use crate::{openapi, OperationInput, OperationOutput};

impl<B> OperationInput for Request<B> {}
impl OperationInput for Method {}
impl OperationInput for Uri {}
impl OperationInput for Version {}
impl OperationInput for HeaderMap {}
impl OperationInput for Parts {}

impl<B> OperationOutput for Response<B> {
    type Inner = Self;

    fn operation_response(
        _ctx: &mut crate::generate::GenContext,
        _operation: &mut openapi::Operation,
    ) -> Option<openapi::Response> {
        Some(openapi::Response {
            description: "HTTP response".into(),
            ..Default::default()
        })
    }

    fn inferred_responses(
        ctx: &mut crate::generate::GenContext,
        operation: &mut openapi::Operation,
    ) -> Vec<(Option<openapi::StatusCode>, openapi::Response)> {
        if let Some(res) = Self::operation_response(ctx, operation) {
            Vec::from([(None, res)])
        } else {
            Vec::new()
        }
    }
}

impl OperationOutput for StatusCode {
    type Inner = Self;

    fn operation_response(
        _ctx: &mut crate::generate::GenContext,
        _operation: &mut openapi::Operation,
    ) -> Option<openapi::Response> {
        Some(openapi::Response {
            description: "HTTP response".into(),
            ..Default::default()
        })
    }

    fn inferred_responses(
        ctx: &mut crate::generate::GenContext,
        operation: &mut openapi::Operation,
    ) -> Vec<(Option<openapi::StatusCode>, openapi::Response)> {
        if let Some(res) = Self::operation_response(ctx, operation) {
            Vec::from([(None, res)])
        } else {
            Vec::new()
        }
    }
}
