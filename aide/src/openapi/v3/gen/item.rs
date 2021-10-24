use crate::openapi::v3::definition::{
    self, Example, MediaType, Parameter, ParameterLocation, ParameterValue, Response, Tag,
};
use schemars::{schema::Schema, Map};
use std::any::Any;

#[derive(Debug, Clone, Copy, Eq, PartialEq)]
pub struct Position {
    pub file: &'static str,
    pub line: u32,
    pub column: u32,
}

impl core::fmt::Display for Position {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}:{}:{}", self.file, self.line, self.column)
    }
}

#[derive(Debug)]
pub struct Item {
    pub id: &'static str,
    pub position: Position,
    pub content: Box<dyn Any>,
}

#[derive(Debug, Clone)]
pub struct ItemModel {
    pub name: &'static str,
    pub schema: Schema,
}

#[derive(Debug, Clone)]
pub struct ItemResponse {
    pub route: Route,
    // Default responses have no status codes.
    pub status: Option<i32>,
    pub schema: Option<Schema>,
    pub content_type: Option<&'static str>,
    pub description: Option<&'static str>,
    pub example: Option<serde_json::Value>,
    pub examples: Map<String, Example>,
}

impl From<ItemResponse> for Response {
    fn from(val: ItemResponse) -> Self {
        let mut content = Map::new();

        if val.schema.is_some()
            || val.example.is_some()
            || !val.examples.is_empty()
            || val.content_type.is_some()
        {
            let ct = val.content_type.unwrap_or("application/json");

            content.insert(
                ct.to_string(),
                MediaType {
                    schema: val.schema.map(|s| s.into_object()),
                    example: val.example,
                    examples: if val.examples.is_empty() {
                        None
                    } else {
                        Some(val.examples)
                    },
                    ..Default::default()
                },
            );
        }

        Response {
            description: val.description.map(|s| s.to_string()).unwrap_or_default(),
            content,
            ..Default::default()
        }
    }
}

#[derive(Debug, Clone)]
pub enum BindingKind {
    Query,
    Path,
    Body,
}

#[derive(Debug, Clone)]
pub struct ItemBinding {
    pub route: Route,
    pub kind: BindingKind,
    pub content_type: Option<&'static str>,
    pub schema: Schema,
}

#[derive(Debug, Clone)]
pub struct ItemParameter {
    pub route: Route,
    pub name: &'static str,
    pub location: ParameterLocation,
    pub schema: Schema,
    pub description: Option<&'static str>,
    pub deprecated: bool,
    pub required: bool,
    pub default_value: Option<serde_json::Value>,
    pub example: Option<serde_json::Value>,
    pub examples: Map<String, Example>,
}

impl From<ItemParameter> for Parameter {
    fn from(val: ItemParameter) -> Self {
        Parameter {
            name: val.name.into(),
            location: val.location,
            description: val.description.map(|s| s.to_string()),
            required: val.required,
            deprecated: val.deprecated,
            allow_empty_value: false,
            allow_reserved: false,
            value: ParameterValue::Schema {
                style: None,
                explode: None,
                allow_reserved: false,
                schema: val.schema.into_object(),
                example: val.example,
                examples: if val.examples.is_empty() {
                    None
                } else {
                    Some(val.examples)
                },
            },
            extensions: Default::default(),
        }
    }
}

#[derive(Debug, Clone)]
pub struct ItemOperation {
    pub route: Route,
    pub operation_id: &'static str,
    pub summary: &'static str,
    pub tags: &'static [&'static str],
    pub description: Option<&'static str>,
}

#[derive(Debug, Clone)]
pub struct ItemTag {
    pub name: &'static str,
    pub description: Option<&'static str>,
    pub display_name: Option<&'static str>,
    pub external_docs: Option<ExternalDocs>,
}

impl From<ItemTag> for Tag {
    fn from(val: ItemTag) -> Self {
        let mut t = Tag {
            name: val.name.into(),
            description: val.description.map(|s| s.to_string()),
            external_docs: val.external_docs.map(|e| definition::ExternalDocs {
                description: e.description.map(|d| d.to_string()),
                url: e.url.into(),
                extensions: Default::default(),
            }),
            extensions: Default::default(),
        };

        if let Some(dn) = val.display_name {
            t.extensions
                .insert("x-displayName".into(), serde_json::to_value(dn).unwrap());
        }

        t
    }
}

#[derive(Debug, Clone)]
pub struct ExternalDocs {
    pub description: Option<&'static str>,
    pub url: &'static str,
}

#[derive(Debug, Clone, Eq, PartialEq)]
pub struct Route {
    pub method: &'static str,
    pub path: &'static str,
}
