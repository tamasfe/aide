#![cfg_attr(docsrs, feature(doc_auto_cfg))]
//! A simple crate provides a drop-in replacement for [`axum::Json`]
//! that uses [`jsonschema`] to validate requests schemas
//! generated via [`schemars`].
//!
//! You might want to do this in order to provide a better
//! experience for your clients and not leak serde's error messages.
//!
//! All schemas are cached in a thread-local storage for
//! the life of the application (or thread).
//!
//! # Features
//!
//! - aide: support for [aide](https://docs.rs/aide/latest/aide/)

#![warn(clippy::pedantic, missing_docs)]
#![allow(clippy::wildcard_imports)]
use std::{
    any::{type_name, TypeId},
    cell::RefCell,
    collections::{HashMap, VecDeque},
};

use async_trait::async_trait;
use axum::{
    extract::{rejection::JsonRejection, FromRequest},
    response::IntoResponse,
    BoxError,
};
use http::{Request, StatusCode};
use jsonschema::{
    output::{BasicOutput, ErrorDescription, OutputUnit},
    JSONSchema,
};
use schemars::{
    gen::{SchemaGenerator, SchemaSettings},
    JsonSchema,
};
use serde::{de::DeserializeOwned, Serialize};
use serde_json::{Map, Value};

/// Wrapper type over [`axum::Json`] that validates
/// requests and responds with a more helpful validation
/// message.
pub struct Json<T>(pub T);

#[async_trait]
impl<S, B, T> FromRequest<S, B> for Json<T>
where
    B: http_body::Body + Send + 'static,
    B::Data: Send,
    B::Error: Into<BoxError>,
    S: Send + Sync,
    T: DeserializeOwned + JsonSchema + 'static,
{
    type Rejection = JsonSchemaRejection;

    /// Perform the extraction.
    async fn from_request(req: Request<B>, state: &S) -> Result<Self, Self::Rejection> {
        let value: Value = match axum::Json::from_request(req, state).await {
            Ok(j) => j.0,
            Err(error) => {
                return Err(JsonSchemaRejection::Json(error));
            }
        };

        let validation_result = CONTEXT.with(|ctx| {
            let ctx = &mut *ctx.borrow_mut();
            let schema = ctx.schemas.entry(TypeId::of::<T>()).or_insert_with(|| {
                match jsonschema::JSONSchema::compile(
                    &serde_json::to_value(ctx.generator.root_schema_for::<T>()).unwrap(),
                ) {
                    Ok(s) => s,
                    Err(error) => {
                        tracing::error!(
                            %error,
                            type_name = type_name::<T>(),
                            "invalid JSON schema for type"
                        );
                        JSONSchema::compile(&Value::Object(Map::default())).unwrap()
                    }
                }
            });

            let out = schema.apply(&value).basic();

            match out {
                BasicOutput::Valid(_) => Ok(()),
                BasicOutput::Invalid(v) => Err(v),
            }
        });

        if let Err(errors) = validation_result {
            return Err(JsonSchemaRejection::Schema(errors));
        }

        match serde_json::from_value(value) {
            Ok(v) => Ok(Json(v)),
            Err(error) => {
                tracing::error!(
                    %error,
                    type_name = type_name::<T>(),
                    "schema validation passed but serde failed"
                );
                Err(JsonSchemaRejection::Serde(error))
            }
        }
    }
}

impl<T> IntoResponse for Json<T>
where
    T: Serialize,
{
    fn into_response(self) -> axum::response::Response {
        axum::Json(self.0).into_response()
    }
}

thread_local! {
    static CONTEXT: RefCell<SchemaContext> = RefCell::new(SchemaContext::new());
}

struct SchemaContext {
    generator: SchemaGenerator,
    schemas: HashMap<TypeId, JSONSchema>,
}

impl SchemaContext {
    fn new() -> Self {
        Self {
            generator: SchemaSettings::draft07()
                .with(|g| g.inline_subschemas = true)
                .into_generator(),
            schemas: HashMap::default(),
        }
    }
}

/// Rejection for [`Json`].
#[derive(Debug)]
pub enum JsonSchemaRejection {
    /// A rejection returned by [`axum::Json`].
    Json(JsonRejection),
    /// A serde error.
    Serde(serde_json::Error),
    /// A schema validation error.
    Schema(VecDeque<OutputUnit<ErrorDescription>>),
}

/// The response that is returned by default.
#[derive(Debug, Serialize)]
struct JsonSchemaErrorResponse {
    /// The error reason.
    pub error: String,
    /// Additional error schema validation errors.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub schema_validation: Option<VecDeque<OutputUnit<ErrorDescription>>>,
}

impl From<JsonSchemaRejection> for JsonSchemaErrorResponse {
    fn from(rejection: JsonSchemaRejection) -> Self {
        match rejection {
            JsonSchemaRejection::Json(v) => Self {
                error: v.to_string(),
                schema_validation: None,
            },
            JsonSchemaRejection::Serde(_) => Self {
                error: "invalid request".to_string(),
                schema_validation: None,
            },
            JsonSchemaRejection::Schema(s) => Self {
                error: "request schema validation failed".to_string(),
                schema_validation: Some(s),
            },
        }
    }
}

impl IntoResponse for JsonSchemaRejection {
    fn into_response(self) -> axum::response::Response {
        let mut res = axum::Json(JsonSchemaErrorResponse::from(self)).into_response();
        *res.status_mut() = StatusCode::BAD_REQUEST;
        res
    }
}

#[cfg(feature = "aide")]
mod impl_aide {
    use super::*;

    impl<T> aide::OperationInput for Json<T>
    where
        T: JsonSchema,
    {
        fn operation_input(
            ctx: &mut aide::gen::GenContext,
            operation: &mut aide::openapi::Operation,
        ) {
            axum::Json::<T>::operation_input(ctx, operation);
        }
    }

    impl<T> aide::OperationOutput for Json<T>
    where
        T: JsonSchema,
    {
        type Inner = <axum::Json<T> as aide::OperationOutput>::Inner;

        fn operation_response(
            ctx: &mut aide::gen::GenContext,
            op: &mut aide::openapi::Operation,
        ) -> Option<aide::openapi::Response> {
            axum::Json::<T>::operation_response(ctx, op)
        }

        fn inferred_responses(
            ctx: &mut aide::gen::GenContext,
            operation: &mut aide::openapi::Operation,
        ) -> Vec<(Option<u16>, aide::openapi::Response)> {
            axum::Json::<T>::inferred_responses(ctx, operation)
        }
    }
}
