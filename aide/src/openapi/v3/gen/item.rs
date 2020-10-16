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
    pub create_tag: bool,
    pub tag_display_name: Option<&'static str>,
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

impl Into<Response> for ItemResponse {
    fn into(self) -> Response {
        let mut content = Map::new();

        if self.schema.is_some()
            || self.example.is_some()
            || !self.examples.is_empty()
            || self.content_type.is_some()
        {
            let ct = match self.content_type {
                Some(c) => c,
                None => "application/json".into(),
            };

            content.insert(
                ct.to_string(),
                MediaType {
                    schema: self.schema.map(|s| s.into_object()),
                    example: self.example,
                    examples: if self.examples.is_empty() {
                        None
                    } else {
                        Some(self.examples)
                    },
                    ..Default::default()
                },
            );
        }

        Response {
            description: self.description.map(|s| s.to_string()).unwrap_or_default(),
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

impl Into<Parameter> for ItemParameter {
    fn into(self) -> Parameter {
        Parameter {
            name: self.name.into(),
            location: self.location,
            description: self.description.map(|s| s.to_string()),
            required: self.required,
            deprecated: self.deprecated,
            allow_empty_value: false,
            allow_reserved: false,
            value: ParameterValue::Schema {
                style: None,
                explode: None,
                allow_reserved: false,
                schema: self.schema.into_object(),
                example: self.example,
                examples: if self.examples.is_empty() {
                    None
                } else {
                    Some(self.examples)
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

impl Into<Tag> for ItemTag {
    fn into(self) -> Tag {
        let mut t = Tag {
            name: self.name.into(),
            description: self.description.map(|s| s.to_string()),
            external_docs: self.external_docs.map(|e| definition::ExternalDocs {
                description: e.description.map(|d| d.to_string()),
                url: e.url.into(),
                extensions: Default::default(),
            }),
            extensions: Default::default(),
        };

        if let Some(dn) = self.display_name {
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
