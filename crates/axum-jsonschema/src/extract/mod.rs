mod json;
mod path;

pub use json::*;
pub use path::*;

use std::collections::VecDeque;

use axum::response::IntoResponse;
use http::StatusCode;
use itertools::Itertools;
use jsonschema::output::{ErrorDescription, OutputUnit};
use serde::Serialize;
use serde_path_to_error::Segment;

/// Common Rejection.
#[derive(Debug)]
pub enum SerdeSchemaRejection {
    /// A serde error.
    Serde(serde_path_to_error::Error<serde_json::Error>),
    /// A schema validation error.
    Schema(VecDeque<OutputUnit<ErrorDescription>>),
}

/// The response that is returned by default.
#[derive(Debug, Serialize)]
struct JsonSchemaErrorResponse {
    error: String,
    #[serde(flatten)]
    extra: AdditionalError,
}

#[derive(Debug, Serialize)]
#[serde(tag = "type", rename_all = "snake_case")]
enum AdditionalError {
    Deserialization(DeserializationResponse),
    Schema(SchemaResponse),
}

#[derive(Debug, Serialize)]
struct DeserializationResponse {
    deserialization_error: VecDeque<PathError>,
}

#[derive(Debug, Serialize)]
struct SchemaResponse {
    schema_validation: VecDeque<PathError>,
}

#[derive(Debug, Serialize)]
struct PathError {
    instance_location: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    keyword_location: Option<String>,
    error: String,
}

impl From<SerdeSchemaRejection> for JsonSchemaErrorResponse {
    fn from(rejection: SerdeSchemaRejection) -> Self {
        match rejection {
            SerdeSchemaRejection::Serde(s) => Self {
                error: "deserialization failed".to_string(),
                extra: AdditionalError::Deserialization(DeserializationResponse {
                    deserialization_error: VecDeque::from([PathError {
                        // keys and index seperated by a '/'
                        // enum is ignored because it doesn't exist in json
                        instance_location: std::iter::once(String::new())
                            .chain(s.path().iter().map(|s| match s {
                                Segment::Map { key } => key.to_string(),
                                Segment::Seq { index } => index.to_string(),
                                _ => "?".to_string(),
                            }))
                            .join("/"),
                        keyword_location: None,
                        error: s.into_inner().to_string(),
                    }]),
                }),
            },
            SerdeSchemaRejection::Schema(s) => Self {
                error: "request schema validation failed".to_string(),
                extra: AdditionalError::Schema(SchemaResponse {
                    schema_validation: s
                        .into_iter()
                        .map(|v| PathError {
                            instance_location: v.instance_location().to_string(),
                            keyword_location: Some(v.keyword_location().to_string()),
                            error: v.error_description().to_string(),
                        })
                        .collect(),
                }),
            },
        }
    }
}

impl IntoResponse for SerdeSchemaRejection {
    fn into_response(self) -> axum::response::Response {
        let mut res = axum::Json(JsonSchemaErrorResponse::from(self)).into_response();
        *res.status_mut() = StatusCode::BAD_REQUEST;
        res
    }
}
