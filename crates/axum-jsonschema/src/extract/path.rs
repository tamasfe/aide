use std::any::{type_name, TypeId};

use async_trait::async_trait;
use axum::{extract::FromRequestParts, response::IntoResponse};
use http::request::Parts;
use jsonschema::{output::BasicOutput, JSONSchema};
use schemars::JsonSchema;
use serde::de::DeserializeOwned;
use serde_json::{Map, Value};

use crate::CONTEXT;

use super::SerdeSchemaRejection;

/// Wrapper type over [`axum::extract::Path`] that validates
/// requests and responds with a more helpful validation
/// message.
pub struct Path<T>(pub T);

#[async_trait]
impl<S, T> FromRequestParts<S> for Path<T>
where
    S: Send + Sync,
    T: DeserializeOwned + JsonSchema + 'static,
{
    type Rejection = PathRejection;

    /// Perform the extraction.
    async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
        let value: Value = axum::extract::Path::from_request_parts(parts, state)
            .await
            .map_err(|e| PathRejection::Path(e))?
            .0;

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
            return Err(PathRejection::SerdeSchema(SerdeSchemaRejection::Schema(
                errors,
            )));
        }

        match serde_path_to_error::deserialize(value) {
            Ok(v) => Ok(Path(v)),
            Err(error) => Err(PathRejection::SerdeSchema(SerdeSchemaRejection::Serde(
                error,
            ))),
        }
    }
}

/// Rejection for [`Path`].
#[derive(Debug)]
pub enum PathRejection {
    /// A rejection returned by [`axum::extract::Path`].
    Path(axum::extract::rejection::PathRejection),
    /// A serde or schema-validation error.
    SerdeSchema(SerdeSchemaRejection),
}

impl IntoResponse for PathRejection {
    fn into_response(self) -> axum::response::Response {
        match self {
            Self::Path(e) => e.into_response(),
            Self::SerdeSchema(e) => e.into_response(),
        }
    }
}

#[cfg(feature = "aide")]
mod impl_aide {
    use super::*;

    impl<T> aide::OperationInput for Path<T>
    where
        T: JsonSchema,
    {
        fn operation_input(
            ctx: &mut aide::gen::GenContext,
            operation: &mut aide::openapi::Operation,
        ) {
            axum::extract::Path::<T>::operation_input(ctx, operation);
        }
    }
}
