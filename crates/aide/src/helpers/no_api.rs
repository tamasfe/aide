use std::ops::{Deref, DerefMut};

use serde::{Deserialize, Serialize};

use crate::{OperationInput, OperationOutput};

/// Allows non [`OperationInput`] or [`OperationOutput`] types to be used in aide handlers with a default empty documentation.
///
/// For types that already implement [`OperationInput`] or [`OperationOutput`] it overrides the documentation and hides it.
/// ```ignore
/// pub async fn my_sqlx_tx_endpoint(
///     NoApi(mut tx): NoApi<Tx<sqlx::Any>> // allows usage of the TX
/// ) -> NoApi<Json<YourResult>> // Hides the API of the return type
/// # {}
/// ```
#[derive(Copy, Clone, Debug, Ord, PartialOrd, Eq, PartialEq, Hash, Serialize, Deserialize)]
pub struct NoApi<T>(pub T);

impl<T> NoApi<T> {
    /// Unwraps [Self] into its inner type
    pub fn into_inner(self) -> T {
        self.0
    }
}

impl<T> Deref for NoApi<T> {
    type Target = T;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl<T> DerefMut for NoApi<T> {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.0
    }
}

impl<T> AsRef<T> for NoApi<T> {
    fn as_ref(&self) -> &T {
        &self.0
    }
}

impl<T> AsMut<T> for NoApi<T> {
    fn as_mut(&mut self) -> &mut T {
        &mut self.0
    }
}

impl<T> From<T> for NoApi<T> {
    fn from(value: T) -> Self {
        Self(value)
    }
}

impl<T> OperationInput for NoApi<T> {}

impl<T> OperationOutput for NoApi<T> {
    type Inner = ();
}

#[cfg(feature = "axum")]
mod axum {
    use axum::body::Body;
    use axum::extract::{FromRequest, FromRequestParts};
    use axum::response::{IntoResponse, IntoResponseParts, Response, ResponseParts};
    use http::request::Parts;
    use http::Request;

    use crate::NoApi;

    impl<T> IntoResponse for NoApi<T>
    where
        T: IntoResponse,
    {
        fn into_response(self) -> Response {
            self.0.into_response()
        }
    }

    impl<T> IntoResponseParts for NoApi<T>
    where
        T: IntoResponseParts,
    {
        type Error = T::Error;

        fn into_response_parts(self, res: ResponseParts) -> Result<ResponseParts, Self::Error> {
            self.0.into_response_parts(res)
        }
    }

    impl<T, S> FromRequestParts<S> for NoApi<T>
    where
        T: FromRequestParts<S>,
        S: Send + Sync,
    {
        type Rejection = T::Rejection;

        async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
            Ok(Self(T::from_request_parts(parts, state).await?))
        }
    }

    impl<T, S> FromRequest<S> for NoApi<T>
    where
        T: FromRequest<S>,
        S: Send + Sync,
    {
        type Rejection = <T>::Rejection;

        async fn from_request(req: Request<Body>, state: &S) -> Result<Self, Self::Rejection> {
            Ok(Self(<T>::from_request(req, state).await?))
        }
    }
}
