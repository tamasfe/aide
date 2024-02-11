use std::ops::Deref;

use aide::{
    gen::GenContext,
    openapi::{MediaType, Operation, RequestBody, SchemaObject},
    operation::set_body,
    OperationInput,
};
use axum::{async_trait, extract::multipart::Field};
use axum_typed_multipart::{FieldData, TryFromField, TypedMultipartError};
use indexmap::IndexMap;
use schemars::JsonSchema;

#[derive(Debug)]
pub struct ApiFieldData<T>(FieldData<T>);

pub struct TypedMultipart<T>(axum_typed_multipart::TypedMultipart<T>);

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

impl<T> OperationInput for TypedMultipart<T>
where
    T: JsonSchema,
{
    fn operation_input(ctx: &mut GenContext, operation: &mut Operation) {
        let schema = ctx.schema.subschema_for::<T>().into_object();
        let resolved_schema = ctx.resolve_schema(&schema);

        set_body(
            ctx,
            operation,
            RequestBody {
                description: resolved_schema
                    .metadata
                    .as_ref()
                    .and_then(|m| m.description.clone()),
                content: IndexMap::from_iter([(
                    "multipart/form-data".into(),
                    MediaType {
                        schema: Some(SchemaObject {
                            json_schema: schema.into(),
                            example: None,
                            external_docs: None,
                        }),
                        ..Default::default()
                    },
                )]),
                required: true,
                extensions: IndexMap::default(),
            },
        );
    }
}
