/// This is the same code that lives in the [`OperationOutputDerive`] doc.
#[cfg(feature = "axum")]
#[test]
fn test_op_out_derive() {
    use aide::axum::IntoApiResponse;
    use aide::{derive::OperationOutput, OperationIo};
    use axum::{body::Body, response::IntoResponse};
    use http::StatusCode;
    use schemars::JsonSchema;
    use serde::Serialize;

    pub const INTERNAL_SERVER_ERROR: u16 = 500;

    // Using the simple implementation of OperationOutput here for brevity.
    #[derive(Debug, Serialize, JsonSchema, OperationIo)]
    #[aide(output)]
    pub struct MyResponse {
        pub success: bool,
    }

    #[derive(Debug, Serialize, OperationOutput)]
    pub enum MyMultiResponse {
        // Use a literal status code.
        #[aide(status_code = 200)]
        Success(MyResponse),
        // Use any const status code. Hint: This includes
        // http::StatusCode::as_u16()
        #[aide(status_code=INTERNAL_SERVER_ERROR)]
        Failure(MyResponse),
        // Use an existing implementation's default status code.
        DefaultStatusCode(String),
        // Override an existing implementation's status code.
        #[aide(status_code = 201)]
        DefaultStatusCodeOverride(String),
        // Use no status code.
        NoStatusCode(MyResponse),
    }

    /// This implementation is required for the blanket implementation of [`IntoApiResponse`]
    /// however it is not within the perview of this macro, so we will keep it short. (And
    /// incorrect)
    impl IntoResponse for MyMultiResponse {
        fn into_response(self) -> axum::response::Response {
            (StatusCode::OK, Body::from("Success")).into_response()
        }
    }

    pub async fn my_handler() -> impl IntoApiResponse {
        MyMultiResponse::Success(MyResponse { success: true })
    }
}
