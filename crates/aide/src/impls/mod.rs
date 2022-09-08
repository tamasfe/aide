use std::{borrow::Cow, rc::Rc, sync::Arc, convert::Infallible};

use crate::{
    openapi::{MediaType, Operation, RequestBody, Response},
    operation::set_body,
    OperationInput,
};
use indexmap::IndexMap;

use crate::operation::OperationOutput;

#[cfg(feature = "bytes")]
mod bytes;

#[cfg(feature = "http")]
mod http;

impl<T, E> OperationOutput for Result<T, E>
where
    T: OperationOutput,
    E: OperationOutput,
{
    type Inner = T;

    fn operation_response(
        ctx: &mut crate::gen::GenContext,
        operation: &mut Operation,
    ) -> Option<Response> {
        T::operation_response(ctx, operation)
    }

    fn inferred_responses(
        ctx: &mut crate::gen::GenContext,
        operation: &mut Operation,
    ) -> Vec<(Option<u16>, Response)> {
        let mut responses = T::inferred_responses(ctx, operation);
        responses.extend(E::inferred_responses(ctx, operation));
        responses
    }
}

impl<T> OperationInput for Option<T>
where
    T: OperationInput,
{
    fn operation_input(ctx: &mut crate::gen::GenContext, operation: &mut Operation) {
        T::operation_input(ctx, operation);
    }
}

impl<T> OperationOutput for Option<T>
where
    T: OperationOutput,
{
    type Inner = <T as OperationOutput>::Inner;

    fn operation_response(
        ctx: &mut crate::gen::GenContext,
        operation: &mut Operation,
    ) -> Option<Response> {
        T::operation_response(ctx, operation)
    }

    fn inferred_responses(
        ctx: &mut crate::gen::GenContext,
        operation: &mut Operation,
    ) -> Vec<(Option<u16>, Response)> {
        T::inferred_responses(ctx, operation)
    }
}

impl<T> OperationInput for Box<T>
where
    T: OperationInput,
{
    fn operation_input(ctx: &mut crate::gen::GenContext, operation: &mut Operation) {
        T::operation_input(ctx, operation);
    }
}

impl<T> OperationOutput for Box<T>
where
    T: OperationOutput,
{
    type Inner = <T as OperationOutput>::Inner;

    fn operation_response(
        ctx: &mut crate::gen::GenContext,
        operation: &mut Operation,
    ) -> Option<Response> {
        T::operation_response(ctx, operation)
    }

    fn inferred_responses(
        ctx: &mut crate::gen::GenContext,
        operation: &mut Operation,
    ) -> Vec<(Option<u16>, Response)> {
        T::inferred_responses(ctx, operation)
    }
}

impl<T> OperationInput for Rc<T>
where
    T: OperationInput,
{
    fn operation_input(ctx: &mut crate::gen::GenContext, operation: &mut Operation) {
        T::operation_input(ctx, operation);
    }
}

impl<T> OperationOutput for Rc<T>
where
    T: OperationOutput,
{
    type Inner = <T as OperationOutput>::Inner;

    fn operation_response(
        ctx: &mut crate::gen::GenContext,
        operation: &mut Operation,
    ) -> Option<Response> {
        T::operation_response(ctx, operation)
    }

    fn inferred_responses(
        ctx: &mut crate::gen::GenContext,
        operation: &mut Operation,
    ) -> Vec<(Option<u16>, Response)> {
        T::inferred_responses(ctx, operation)
    }
}

impl<T> OperationInput for Arc<T>
where
    T: OperationInput,
{
    fn operation_input(ctx: &mut crate::gen::GenContext, operation: &mut Operation) {
        T::operation_input(ctx, operation);
    }
}

impl<T> OperationOutput for Arc<T>
where
    T: OperationOutput,
{
    type Inner = <T as OperationOutput>::Inner;

    fn operation_response(
        ctx: &mut crate::gen::GenContext,
        operation: &mut Operation,
    ) -> Option<Response> {
        T::operation_response(ctx, operation)
    }

    fn inferred_responses(
        ctx: &mut crate::gen::GenContext,
        operation: &mut Operation,
    ) -> Vec<(Option<u16>, Response)> {
        T::inferred_responses(ctx, operation)
    }
}

impl OperationInput for String {
    fn operation_input(ctx: &mut crate::gen::GenContext, operation: &mut Operation) {
        set_body(
            ctx,
            operation,
            RequestBody {
                description: None,
                content: IndexMap::from_iter([(
                    "text/plain; charset=utf-8".into(),
                    MediaType::default(),
                )]),
                required: true,
                extensions: IndexMap::default(),
            },
        );
    }
}

impl OperationOutput for String {
    type Inner = Self;

    fn operation_response(
        _ctx: &mut crate::gen::GenContext,
        _operation: &mut Operation,
    ) -> Option<crate::openapi::Response> {
        Some(Response {
            description: "plain text".into(),
            content: IndexMap::from_iter([(
                "text/plain; charset=utf-8".into(),
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

impl<'a> OperationOutput for &'a str {
    type Inner = Self;

    fn operation_response(
        ctx: &mut crate::gen::GenContext,
        operation: &mut Operation,
    ) -> Option<crate::openapi::Response> {
        String::operation_response(ctx, operation)
    }

    fn inferred_responses(
        ctx: &mut crate::gen::GenContext,
        operation: &mut Operation,
    ) -> Vec<(Option<u16>, Response)> {
        String::inferred_responses(ctx, operation)
    }
}

impl<'a> OperationOutput for Cow<'a, str> {
    type Inner = Self;

    fn operation_response(
        ctx: &mut crate::gen::GenContext,
        operation: &mut Operation,
    ) -> Option<crate::openapi::Response> {
        String::operation_response(ctx, operation)
    }

    fn inferred_responses(
        ctx: &mut crate::gen::GenContext,
        operation: &mut Operation,
    ) -> Vec<(Option<u16>, Response)> {
        String::inferred_responses(ctx, operation)
    }
}

impl OperationOutput for () {
    type Inner = Self;

    fn operation_response(
        _ctx: &mut crate::gen::GenContext,
        _operation: &mut Operation,
    ) -> Option<crate::openapi::Response> {
        Some(Response {
            description: "no content".to_string(),
            ..Default::default()
        })
    }

    fn inferred_responses(
        ctx: &mut crate::gen::GenContext,
        operation: &mut Operation,
    ) -> Vec<(Option<u16>, Response)> {
        if let Some(res) = Self::operation_response(ctx, operation) {
            Vec::from([(Some(204), res)])
        } else {
            Vec::new()
        }
    }
}

impl OperationInput for Vec<u8> {
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

impl OperationOutput for Vec<u8> {
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

impl<'a> OperationInput for &'a [u8] {
    fn operation_input(
        ctx: &mut crate::gen::GenContext,
        operation: &mut crate::openapi::Operation,
    ) {
        Vec::<u8>::operation_input(ctx, operation);
    }
}

impl<'a> OperationOutput for &'a [u8] {
    type Inner = Self;

    fn operation_response(
        ctx: &mut crate::gen::GenContext,
        operation: &mut Operation,
    ) -> Option<crate::openapi::Response> {
        Vec::<u8>::operation_response(ctx, operation)
    }

    fn inferred_responses(
        ctx: &mut crate::gen::GenContext,
        operation: &mut Operation,
    ) -> Vec<(Option<u16>, Response)> {
        Vec::<u8>::inferred_responses(ctx, operation)
    }
}

impl<'a> OperationInput for Cow<'a, [u8]> {
    fn operation_input(
        ctx: &mut crate::gen::GenContext,
        operation: &mut crate::openapi::Operation,
    ) {
        Vec::<u8>::operation_input(ctx, operation);
    }
}

impl<'a> OperationOutput for Cow<'a, [u8]> {
    type Inner = Self;

    fn operation_response(
        ctx: &mut crate::gen::GenContext,
        operation: &mut Operation,
    ) -> Option<crate::openapi::Response> {
        Vec::<u8>::operation_response(ctx, operation)
    }

    fn inferred_responses(
        ctx: &mut crate::gen::GenContext,
        operation: &mut Operation,
    ) -> Vec<(Option<u16>, Response)> {
        Vec::<u8>::inferred_responses(ctx, operation)
    }
}

// Empty blanket impls for tuples.
//
// In axum these are (StatusCode, Value), 
// we keep it more broad as other frameworks
// could implement (u16, Value) instead for example.
impl<T1, T2> OperationOutput for (T1, T2) {
    type Inner = Infallible;
}
