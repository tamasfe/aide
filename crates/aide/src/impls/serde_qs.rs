use schemars::JsonSchema;

use crate::{OperationInput, openapi::Operation, operation::{ParamLocation, parameters_from_schema, add_parameters}};

#[cfg(feature = "axum")]
impl<T> OperationInput for serde_qs::axum::QsQuery<T>
where
    T: JsonSchema,
{
    fn operation_input(ctx: &mut crate::gen::GenContext, operation: &mut Operation) {
        let schema = ctx.schema.subschema_for::<T>().into_object();
        let params = parameters_from_schema(ctx, schema, ParamLocation::Query);
        add_parameters(ctx, operation, params);
    }
}
