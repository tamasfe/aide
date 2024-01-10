use aide::operation::OperationIo;
use axum::response::IntoResponse;
use axum_jsonschema::extract::{JsonRejection, SerdeSchemaRejection};
use axum_macros::FromRequest;
use serde::Serialize;
use serde_json::json;

use crate::errors::AppError;

#[derive(FromRequest, OperationIo)]
#[from_request(via(axum_jsonschema::extract::Json), rejection(AppError))]
#[aide(
    input_with = "axum_jsonschema::extract::Json<T>",
    output_with = "axum_jsonschema::extract::Json<T>",
    json_schema
)]
pub struct Json<T>(pub T);

impl<T> IntoResponse for Json<T>
where
    T: Serialize,
{
    fn into_response(self) -> axum::response::Response {
        axum::Json(self.0).into_response()
    }
}

impl From<JsonRejection> for AppError {
    fn from(rejection: JsonRejection) -> Self {
        match rejection {
            JsonRejection::Json(j) => Self::new(&j.to_string()),
            JsonRejection::SerdeSchema(e) => match e {
                SerdeSchemaRejection::Serde(_) => Self::new("invalid request"),
                SerdeSchemaRejection::Schema(s) => {
                    Self::new("invalid request").with_details(json!({ "schema_validation": s }))
                }
            },
        }
    }
}
