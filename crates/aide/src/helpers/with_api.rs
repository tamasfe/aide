use std::marker::PhantomData;

use derive_more::{AsMut, AsRef, Deref, DerefMut};
use serde::{Deserialize, Serialize};

use crate::gen::GenContext;
use crate::openapi::{Operation, Response};
use crate::{OperationInput, OperationOutput};

pub trait ApiOverride {
    type Target;
}

#[derive(
    Copy,
    Clone,
    Debug,
    Ord,
    PartialOrd,
    Eq,
    PartialEq,
    Hash,
    Serialize,
    Deserialize,
    Deref,
    DerefMut,
    AsRef,
    AsMut,
)]
pub struct WithApi<T>(
    #[as_ref]
    #[as_mut]
    #[deref]
    #[deref_mut]
    pub T::Target,
    PhantomData<T>,
)
where
    T: ApiOverride;

impl<T> WithApi<T>
where
    T: ApiOverride,
{
    pub fn into_inner(self) -> T::Target {
        self.0
    }
}

impl<T> OperationInput for WithApi<T>
where
    T: OperationInput + ApiOverride,
{
    fn operation_input(ctx: &mut GenContext, operation: &mut Operation) {
        T::operation_input(ctx, operation)
    }

    fn inferred_early_responses(
        ctx: &mut GenContext,
        operation: &mut Operation,
    ) -> Vec<(Option<u16>, Response)> {
        T::inferred_early_responses(ctx, operation)
    }
}

impl<T> OperationOutput for WithApi<T>
where
    T: OperationOutput + ApiOverride,
{
    type Inner = T::Inner;

    fn operation_response(ctx: &mut GenContext, operation: &mut Operation) -> Option<Response> {
        T::operation_response(ctx, operation)
    }

    fn inferred_responses(
        ctx: &mut GenContext,
        operation: &mut Operation,
    ) -> Vec<(Option<u16>, Response)> {
        T::inferred_responses(ctx, operation)
    }
}

#[cfg(feature = "axum")]
mod axum {
    use crate::helpers::with_api::ApiOverride;
    use axum::async_trait;
    use axum::extract::{FromRequest, FromRequestParts};
    use axum::response::{IntoResponse, IntoResponseParts, Response, ResponseParts};
    use http::request::Parts;
    use http::Request;

    use crate::WithApi;

    impl<T> IntoResponse for WithApi<T>
    where
        T: ApiOverride,
        T::Target: IntoResponse,
    {
        fn into_response(self) -> Response {
            self.0.into_response()
        }
    }

    impl<T> IntoResponseParts for WithApi<T>
    where
        T: ApiOverride,
        T::Target: IntoResponseParts,
    {
        type Error = <T::Target as IntoResponseParts>::Error;

        fn into_response_parts(self, res: ResponseParts) -> Result<ResponseParts, Self::Error> {
            self.0.into_response_parts(res)
        }
    }

    #[async_trait]
    impl<T, S> FromRequestParts<S> for WithApi<T>
    where
        T: ApiOverride,
        T::Target: FromRequestParts<S>,
        S: Send + Sync,
    {
        type Rejection = <T::Target as FromRequestParts<S>>::Rejection;

        async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
            Ok(Self(
                <T::Target as FromRequestParts<S>>::from_request_parts(parts, state).await?,
                Default::default(),
            ))
        }
    }

    #[async_trait]
    impl<T, S, B> FromRequest<S, B> for WithApi<T>
    where
        T: ApiOverride,
        T::Target: FromRequest<S, B>,
        S: Send + Sync,
        B: Send + 'static,
    {
        type Rejection = <T::Target as FromRequest<S, B>>::Rejection;

        async fn from_request(req: Request<B>, state: &S) -> Result<Self, Self::Rejection> {
            Ok(Self(
                <T::Target as FromRequest<S, B>>::from_request(req, state).await?,
                Default::default(),
            ))
        }
    }
}
