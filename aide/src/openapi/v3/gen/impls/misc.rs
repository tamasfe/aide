use crate::openapi::v3::gen::{item, OperationOutput};

impl OperationOutput for String {
    fn operation_output(
        opts: &crate::openapi::v3::gen::Options,
        id: &'static str,
        position: item::Position,
        route: item::Route,
    ) -> Option<item::Item> {
        Some(item::Item {
            id,
            position,
            content: Box::new(item::ItemResponse {
                route,
                status: Some(200),
                schema: Some(opts.generate_schema::<String>()),
                content_type: Some("text/plain"),
                description: None,
                example: None,
                examples: Default::default(),
            }),
        })
    }
}

impl OperationOutput for () {
    fn operation_output(
        _opts: &crate::openapi::v3::gen::Options,
        id: &'static str,
        position: item::Position,
        route: item::Route,
    ) -> Option<item::Item> {
        Some(item::Item {
            id,
            position,
            content: Box::new(item::ItemResponse {
                route,
                status: Some(204),
                schema: None,
                content_type: None,
                description: None,
                example: None,
                examples: Default::default(),
            }),
        })
    }
}
