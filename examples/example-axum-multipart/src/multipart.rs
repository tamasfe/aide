// Manual OperationInput + FromRequest wrapper for TypedMultipart.
//
// This can be replaced with a single import once `aide-axum-typed-multipart-2`
// is updated to aide 0.16 + schemars 1.x:
//
//   use aide_axum_typed_multipart_2::TypedMultipart;

use aide::{
    openapi::{MediaType, Operation, RequestBody, SchemaObject},
    operation::set_body,
    OperationInput,
};
use axum::extract::{FromRequest, Request};
use axum_typed_multipart::TypedMultipart;
use indexmap::IndexMap;
use schemars::JsonSchema;

pub struct DocTypedMultipart<T>(pub T);

impl<T: JsonSchema> OperationInput for DocTypedMultipart<T> {
    fn operation_input(ctx: &mut aide::generate::GenContext, operation: &mut Operation) {
        let schema = ctx.schema.subschema_for::<T>();
        set_body(
            ctx,
            operation,
            RequestBody {
                description: Some("Multipart file upload".into()),
                content: IndexMap::from_iter([(
                    "multipart/form-data".into(),
                    MediaType {
                        schema: Some(SchemaObject {
                            json_schema: schema.try_into().expect("invalid schema"),
                            external_docs: None,
                            example: None,
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

impl<T, S> FromRequest<S> for DocTypedMultipart<T>
where
    TypedMultipart<T>: FromRequest<S>,
    S: Send + Sync,
{
    type Rejection = <TypedMultipart<T> as FromRequest<S>>::Rejection;

    async fn from_request(req: Request, state: &S) -> Result<Self, Self::Rejection> {
        let TypedMultipart(inner) = TypedMultipart::from_request(req, state).await?;
        Ok(Self(inner))
    }
}
