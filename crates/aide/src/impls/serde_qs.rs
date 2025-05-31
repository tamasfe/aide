use schemars::JsonSchema;

use crate::{
    openapi::Operation,
    operation::{add_parameters, parameters_from_schema, ParamLocation},
    OperationInput,
};

#[cfg(feature = "axum")]
impl<T> OperationInput for serde_qs::axum::QsQuery<T>
where
    T: JsonSchema,
{
    fn operation_input(ctx: &mut crate::generate::GenContext, operation: &mut Operation) {
        let schema = ctx.schema.subschema_for::<T>();
        let params = parameters_from_schema(ctx, schema, ParamLocation::Query);
        add_parameters(ctx, operation, params);
    }
}

#[cfg(feature = "axum")]
impl<T> OperationInput for serde_qs::axum::OptionalQsQuery<T>
where
    T: JsonSchema,
{
    fn operation_input(ctx: &mut crate::generate::GenContext, operation: &mut Operation) {
        let schema = ctx.schema.subschema_for::<T>();
        let params = parameters_from_schema(ctx, schema, ParamLocation::Query);
        add_parameters(ctx, operation, params);
    }
}
