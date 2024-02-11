use std::ops::Deref;

use axum::{async_trait, extract::multipart::Field};
use axum_typed_multipart::{FieldData, TryFromField, TypedMultipartError};
use schemars::JsonSchema;

#[derive(Debug)]
pub struct ApiFieldData<T>(FieldData<T>);

impl<T> Deref for ApiFieldData<T> {
    type Target = FieldData<T>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

#[async_trait]
impl<T: TryFromField> TryFromField for ApiFieldData<T> {
    async fn try_from_field(
        field: Field<'_>,
        limit_bytes: Option<usize>,
    ) -> Result<Self, TypedMultipartError> {
        Ok(Self(FieldData::try_from_field(field, limit_bytes).await?))
    }
}

impl<T: JsonSchema> JsonSchema for ApiFieldData<T> {
    fn schema_name() -> String {
        T::schema_name()
    }

    fn json_schema(gen: &mut schemars::gen::SchemaGenerator) -> schemars::schema::Schema {
        T::json_schema(gen)
    }
}
