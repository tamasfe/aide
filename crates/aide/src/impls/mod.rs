use std::{borrow::Cow, convert::Infallible, rc::Rc, sync::Arc};

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

#[cfg(feature = "serde_qs")]
mod serde_qs;

impl<T, E> OperationInput for Result<T, E>
where
    T: OperationInput,
{
    fn operation_input(ctx: &mut crate::gen::GenContext, operation: &mut Operation) {
        T::operation_input(ctx, operation);
    }

    fn inferred_early_responses(
        ctx: &mut crate::gen::GenContext,
        operation: &mut Operation,
    ) -> Vec<(Option<u16>, Response)> {
        T::inferred_early_responses(ctx, operation)
    }
}

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
        // Make parameters proudced by T optional if T is wrapped in an Option.
        // TODO: we should probably do this for the body as well.
        let mut temp_op = Operation::default();
        T::operation_input(ctx, &mut temp_op);
        T::operation_input(ctx, operation);

        if temp_op.parameters.is_empty() {
            return;
        }

        for param in &mut operation.parameters {
            if let Some(param) = param.as_item_mut() {
                let new_param = temp_op.parameters.iter().any(|p| {
                    let p = match p.as_item() {
                        Some(p) => p,
                        None => return false,
                    };

                    p.parameter_data_ref().name == param.parameter_data_ref().name
                });

                if new_param {
                    param.parameter_data_mut().required = false;
                }
            }
        }
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

impl OperationOutput for &str {
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

impl OperationOutput for Cow<'_, str> {
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
            Vec::from([(Some(ctx.no_content_status), res)])
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

impl OperationInput for &[u8] {
    fn operation_input(
        ctx: &mut crate::gen::GenContext,
        operation: &mut crate::openapi::Operation,
    ) {
        Vec::<u8>::operation_input(ctx, operation);
    }
}

impl OperationOutput for &[u8] {
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

impl OperationInput for Cow<'_, [u8]> {
    fn operation_input(
        ctx: &mut crate::gen::GenContext,
        operation: &mut crate::openapi::Operation,
    ) {
        Vec::<u8>::operation_input(ctx, operation);
    }
}

impl OperationOutput for Cow<'_, [u8]> {
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
// In axum these are commonly (StatusCode, Value),
// we keep it more broad as other frameworks
// could implement (u16, Value) instead for example,
// or any combination that is compatible, like:
// - `(StatusCode, impl IntoResponse)`
// - `(Parts, impl IntoResponse)`
// - `(Response<()>, impl IntoResponse)`
// - `(T1, .., Tn, impl IntoResponse)` where `T1` to `Tn` all implement `IntoResponseParts`.
// - `(StatusCode, T1, .., Tn, impl IntoResponse)` where `T1` to `Tn` all implement `IntoResponseParts`.
// - `(Parts, T1, .., Tn, impl IntoResponse)` where `T1` to `Tn` all implement `IntoResponseParts`.
// - `(Response<()>, T1, .., Tn, impl IntoResponse)` where `T1` to `Tn` all implement `IntoResponseParts`.

impl<T1, T2> OperationOutput for (T1, T2) {
    type Inner = Infallible;
}
impl<T1, T2, T3> OperationOutput for (T1, T2, T3) {
    type Inner = Infallible;
}
impl<T1, T2, T3, T4> OperationOutput for (T1, T2, T3, T4) {
    type Inner = Infallible;
}
impl<T1, T2, T3, T4, T5> OperationOutput for (T1, T2, T3, T4, T5) {
    type Inner = Infallible;
}
impl<T1, T2, T3, T4, T5, T6> OperationOutput for (T1, T2, T3, T4, T5, T6) {
    type Inner = Infallible;
}
impl<T1, T2, T3, T4, T5, T6, T7> OperationOutput for (T1, T2, T3, T4, T5, T6, T7) {
    type Inner = Infallible;
}
impl<T1, T2, T3, T4, T5, T6, T7, T8> OperationOutput for (T1, T2, T3, T4, T5, T6, T7, T8) {
    type Inner = Infallible;
}
impl<T1, T2, T3, T4, T5, T6, T7, T8, T9> OperationOutput for (T1, T2, T3, T4, T5, T6, T7, T8, T9) {
    type Inner = Infallible;
}
impl<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10> OperationOutput
    for (T1, T2, T3, T4, T5, T6, T7, T8, T9, T10)
{
    type Inner = Infallible;
}
