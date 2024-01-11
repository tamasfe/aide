use std::any::{type_name, TypeId};

use async_trait::async_trait;
use axum::{
    body::Body,
    extract::{FromRequest, Request},
    response::IntoResponse,
};
use jsonschema::{output::BasicOutput, JSONSchema};
use schemars::JsonSchema;
use serde::de::DeserializeOwned;
use serde_json::{Map, Value};

use crate::CONTEXT;

use super::SerdeSchemaRejection;

/// Wrapper type over [`axum::Json`] that validates
/// requests and responds with a more helpful validation
/// message.
pub struct Json<T>(pub T);

#[async_trait]
impl<S, T> FromRequest<S> for Json<T>
where
    S: Send + Sync,
    T: DeserializeOwned + JsonSchema + 'static,
{
    type Rejection = JsonRejection;

    /// Perform the extraction.
    async fn from_request(req: Request<Body>, state: &S) -> Result<Self, Self::Rejection> {
        let value: Value = match axum::Json::from_request(req, state).await {
            Ok(j) => j.0,
            Err(error) => {
                return Err(JsonRejection::Json(error));
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
            return Err(JsonRejection::SerdeSchema(SerdeSchemaRejection::Schema(
                errors,
            )));
        }

        match serde_path_to_error::deserialize(value) {
            Ok(v) => Ok(Json(v)),
            Err(error) => Err(JsonRejection::SerdeSchema(SerdeSchemaRejection::Serde(
                error,
            ))),
        }
    }
}

/// Rejection for [`Json`].
#[derive(Debug)]
pub enum JsonRejection {
    /// A rejection returned by [`axum::Json`].
    Json(axum::extract::rejection::JsonRejection),
    /// A serde or schema-validation error.
    SerdeSchema(SerdeSchemaRejection),
}

impl IntoResponse for JsonRejection {
    fn into_response(self) -> axum::response::Response {
        match self {
            Self::Json(e) => e.into_response(),
            Self::SerdeSchema(e) => e.into_response(),
        }
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