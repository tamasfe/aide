use bytes::{Bytes, BytesMut};
use indexmap::IndexMap;

use crate::{
    openapi::{MediaType, Operation, RequestBody, Response},
    operation::set_body,
    OperationInput, OperationOutput,
};

impl OperationInput for Bytes {
    fn operation_input(
        ctx: &mut crate::gen::GenContext,
        operation: &mut crate::openapi::Operation,
    ) {
        set_body(
            ctx,
            operation,
            RequestBody {
                description: None,
                content: IndexMap::from_iter([(
                    "application/octet-stream".into(),
                    MediaType::default(),
                )]),
                required: true,
                extensions: IndexMap::default(),
            },
        );
    }
}

impl OperationInput for BytesMut {
    fn operation_input(
        ctx: &mut crate::gen::GenContext,
        operation: &mut crate::openapi::Operation,
    ) {
        Bytes::operation_input(ctx, operation);
    }
}

impl OperationOutput for Bytes {
    type Inner = Self;

    fn operation_response(
        _ctx: &mut crate::gen::GenContext,
        _operation: &mut Operation,
    ) -> Option<crate::openapi::Response> {
        Some(Response {
            description: "byte stream".into(),
            content: IndexMap::from_iter([(
                "application/octet-stream".into(),
                MediaType::default(),
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

impl OperationOutput for BytesMut {
    type Inner = Self;

    fn operation_response(
        ctx: &mut crate::gen::GenContext,
        operation: &mut Operation,
    ) -> Option<crate::openapi::Response> {
        Bytes::operation_response(ctx, operation)
    }

    fn inferred_responses(
        ctx: &mut crate::gen::GenContext,
        operation: &mut Operation,
    ) -> Vec<(Option<u16>, Response)> {
        Bytes::inferred_responses(ctx, operation)
    }
}
