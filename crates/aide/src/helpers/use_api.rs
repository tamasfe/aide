use std::{
    marker::PhantomData,
    ops::{Deref, DerefMut},
};

use serde::{Deserialize, Serialize};

use crate::gen::GenContext;
use crate::openapi::{Operation, Response};
use crate::{OperationInput, OperationOutput};

/// helper trait to allow simplified use of [`UseApi`] in responses
pub trait IntoApi {
    /// into [`UseApi`]
    fn into_api<A>(self) -> UseApi<Self, A>
    where
        Self: Sized;
}

impl<T> IntoApi for T {
    fn into_api<A>(self) -> UseApi<Self, A>
    where
        Self: Sized,
    {
        self.into()
    }
}

/// Allows non [`OperationInput`] or [`OperationOutput`] types to be used in aide handlers with the api documentation of [A].
///
/// For types that already implement [`OperationInput`] or [`OperationOutput`] it overrides the documentation with the provided one.
#[derive(Copy, Clone, Debug, Ord, PartialOrd, Eq, PartialEq, Hash, Serialize, Deserialize)]
pub struct UseApi<T, A>(pub T, pub PhantomData<A>);

impl<T, A> UseApi<T, A> {
    /// Unwraps [Self] into its inner type
    pub fn into_inner(self) -> T {
        self.0
    }
}

impl<T, A> Deref for UseApi<T, A> {
    type Target = T;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl<T, A> DerefMut for UseApi<T, A> {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.0
    }
}

impl<T, A> AsRef<T> for UseApi<T, A> {
    fn as_ref(&self) -> &T {
        &self.0
    }
}

impl<T, A> AsMut<T> for UseApi<T, A> {
    fn as_mut(&mut self) -> &mut T {
        &mut self.0
    }
}

impl<T, A> From<T> for UseApi<T, A> {
    fn from(value: T) -> Self {
        Self(value, Default::default())
    }
}

impl<T, A> OperationInput for UseApi<T, A>
where
    A: OperationInput,
{
    fn operation_input(ctx: &mut GenContext, operation: &mut Operation) {
        A::operation_input(ctx, operation);
    }

    fn inferred_early_responses(
        ctx: &mut GenContext,
        operation: &mut Operation,
    ) -> Vec<(Option<u16>, Response)> {
        A::inferred_early_responses(ctx, operation)
    }
}

impl<T, A> OperationOutput for UseApi<T, A>
where
    A: OperationOutput,
{
    type Inner = A::Inner;

    fn operation_response(ctx: &mut GenContext, operation: &mut Operation) -> Option<Response> {
        A::operation_response(ctx, operation)
    }

    fn inferred_responses(
        ctx: &mut GenContext,
        operation: &mut Operation,
    ) -> Vec<(Option<u16>, Response)> {
        A::inferred_responses(ctx, operation)
    }
}

#[cfg(feature = "axum")]
mod axum {
    use axum::body::Body;
    use axum::extract::{FromRequest, FromRequestParts};
    use axum::response::{IntoResponse, IntoResponseParts, Response, ResponseParts};
    use http::request::Parts;
    use http::Request;

    use crate::UseApi;

    impl<T, A> IntoResponse for UseApi<T, A>
    where
        T: IntoResponse,
    {
        fn into_response(self) -> Response {
            self.0.into_response()
        }
    }

    impl<T, A> IntoResponseParts for UseApi<T, A>
    where
        T: IntoResponseParts,
    {
        type Error = T::Error;

        fn into_response_parts(self, res: ResponseParts) -> Result<ResponseParts, Self::Error> {
            self.0.into_response_parts(res)
        }
    }

    impl<T, A, S> FromRequestParts<S> for UseApi<T, A>
    where
        T: FromRequestParts<S>,
        S: Send + Sync,
    {
        type Rejection = T::Rejection;

        async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
            Ok(Self(
                T::from_request_parts(parts, state).await?,
                Default::default(),
            ))
        }
    }

    impl<T, A, S> FromRequest<S> for UseApi<T, A>
    where
        T: FromRequest<S>,
        S: Send + Sync,
    {
        type Rejection = T::Rejection;

        async fn from_request(req: Request<Body>, state: &S) -> Result<Self, Self::Rejection> {
            Ok(Self(T::from_request(req, state).await?, Default::default()))
        }
    }
}
