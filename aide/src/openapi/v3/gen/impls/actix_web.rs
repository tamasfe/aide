use crate::openapi::v3::gen::{
    item::{self, Position},
    OperationInput, OperationOutput, Options,
};
use actix_web::{
    web::{Data, Form, Header, Json, Path, Payload, Query},
    HttpResponse, HttpResponseBuilder, HttpRequest,
};
use schemars::JsonSchema;

impl<T> OperationInput for Json<T>
where
    T: JsonSchema,
{
    fn operation_input(
        opts: &Options,
        id: &'static str,
        position: Position,
        route: item::Route,
    ) -> Option<item::Item> {
        Some(item::Item {
            id,
            position,
            content: Box::new(item::ItemBinding {
                route,
                kind: item::BindingKind::Body,
                content_type: Some("application/json"),
                schema: opts.generate_schema::<T>(),
            }),
        })
    }
}

impl<T> OperationInput for Path<T>
where
    T: JsonSchema,
{
    fn operation_input(
        opts: &Options,
        id: &'static str,
        position: Position,
        route: item::Route,
    ) -> Option<item::Item> {
        Some(item::Item {
            id,
            position,
            content: Box::new(item::ItemBinding {
                route,
                kind: item::BindingKind::Path,
                content_type: None,
                schema: opts.generate_schema::<T>(),
            }),
        })
    }
}

impl<T> OperationInput for Query<T>
where
    T: JsonSchema,
{
    fn operation_input(
        opts: &Options,
        id: &'static str,
        position: Position,
        route: item::Route,
    ) -> Option<item::Item> {
        Some(item::Item {
            id,
            position,
            content: Box::new(item::ItemBinding {
                route,
                kind: item::BindingKind::Query,
                content_type: None,
                schema: opts.generate_schema::<T>(),
            }),
        })
    }
}

impl<T> OperationInput for Form<T>
where
    T: JsonSchema,
{
    fn operation_input(
        opts: &Options,
        id: &'static str,
        position: Position,
        route: item::Route,
    ) -> Option<item::Item> {
        Some(item::Item {
            id,
            position,
            content: Box::new(item::ItemBinding {
                route,
                kind: item::BindingKind::Body,
                content_type: Some("application/x-www-form-urlencoded"),
                schema: opts.generate_schema::<T>(),
            }),
        })
    }
}

impl<T> OperationInput for Header<T>
where
    T: JsonSchema,
{
    fn operation_input(
        opts: &Options,
        id: &'static str,
        position: Position,
        route: item::Route,
    ) -> Option<item::Item> {
        Some(item::Item {
            id,
            position,
            content: Box::new(item::ItemBinding {
                route,
                kind: item::BindingKind::Header,
                content_type: None,
                schema: opts.generate_schema::<T>(),
            }),
        })
    }
}

impl<T> OperationInput for Data<T>
where
    T: ?Sized,
{
    fn operation_input(
        _opts: &Options,
        _id: &'static str,
        _position: Position,
        _route: item::Route,
    ) -> Option<item::Item> {
        None
    }
}

impl OperationInput for HttpRequest {
    fn operation_input(
        _opts: &Options,
        _id: &'static str,
        _position: Position,
        _route: item::Route,
    ) -> Option<item::Item> {
        None
    }
}

impl OperationInput for Payload {
    fn operation_input(
        _opts: &Options,
        _id: &'static str,
        _position: Position,
        _route: item::Route,
    ) -> Option<item::Item> {
        None
    }
}

impl<T> OperationOutput for Json<T>
where
    T: JsonSchema,
{
    fn operation_output(
        opts: &Options,
        id: &'static str,
        position: Position,
        route: item::Route,
    ) -> Option<item::Item> {
        Some(item::Item {
            id,
            position,
            content: Box::new(item::ItemResponse {
                route,
                status: Some(200),
                schema: Some(opts.generate_schema::<T>()),
                content_type: Some("application/json"),
                description: None,
                example: None,
                examples: Default::default(),
            }),
        })
    }
}

impl OperationOutput for HttpResponse {
    fn operation_output(
        _opts: &Options,
        _id: &'static str,
        _position: Position,
        _route: item::Route,
    ) -> Option<item::Item> {
        None
    }
}

impl OperationOutput for HttpResponseBuilder {
    fn operation_output(
        _opts: &Options,
        _id: &'static str,
        _position: Position,
        _route: item::Route,
    ) -> Option<item::Item> {
        None
    }
}
