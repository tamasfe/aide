use std::any::{type_name, TypeId};

use async_trait::async_trait;
use axum::extract::FromRequestParts;
use http::request::Parts;
use jsonschema::{output::BasicOutput, JSONSchema};
use schemars::JsonSchema;
use serde::de::DeserializeOwned;
use serde_json::{Map, Value};

use crate::{JsonSchemaRejection, CONTEXT};

/// Type emulate [`axum::extract::Path`] that validates
/// requests with a more helpful validation
/// message.
pub struct Path<T>(pub T);

#[async_trait]
impl<S, T> FromRequestParts<S> for Path<T>
where
    S: Send + Sync,
    T: DeserializeOwned + JsonSchema + 'static,
{
    type Rejection = JsonSchemaRejection;

    /// Perform the extraction.
    async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
        let raw_parrams = match axum::extract::RawPathParams::from_request_parts(parts, state).await
        {
            Ok(p) => p,
            Err(e) => return Err(JsonSchemaRejection::Path(e)),
        };
        let value = Value::Object(
            raw_parrams
                .into_iter()
                .map(|p| (p.0.to_owned(), Value::String(p.1.to_owned())))
                .collect::<Map<_, _>>(),
        );

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

        match serde_path_to_error::deserialize(value) {
            Ok(v) => Ok(Path(v)),
            Err(error) => Err(JsonSchemaRejection::Serde(error)),
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
