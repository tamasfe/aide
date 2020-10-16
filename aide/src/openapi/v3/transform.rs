//! This module is for transform functions and utilities that can be
//! applied to OpenApi specifications.

use std::mem;

use super::{
    definition::{
        Components, MediaType, OpenApi, Operation, ParameterValue, PathItem, RefOr, Response,
    },
    definition_ext::OperationMethod,
};
use schemars::{gen::SchemaSettings, schema::Schema, JsonSchema, Map};
use serde::{Deserialize, Serialize};

#[derive(Debug)]
pub enum Error {
    SerdeJson(serde_json::Error),
}

impl core::fmt::Display for Error {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Error::SerdeJson(e) => e.fmt(f),
        }
    }
}

impl std::error::Error for Error {}

impl From<serde_json::Error> for Error {
    fn from(e: serde_json::Error) -> Self {
        Error::SerdeJson(e)
    }
}

/// Sets the default response for all operations that don't yet have one.
///
/// Panics if the value cannot be JSON serialized.
pub fn default_response<D, R>(description: D, value: R) -> impl FnOnce(OpenApi) -> OpenApi
where
    D: ToString,
    R: JsonSchema + Serialize,
{
    default_response_when(description, value, |(_, _, _, o)| {
        o.responses.default.is_none()
    })
}

/// Define a tag group for ReDoc.
pub fn tag_group(group: TagGroup) -> impl FnOnce(OpenApi) -> OpenApi {
    |mut api: OpenApi| {
        let mut tag_groups: Vec<TagGroup> = api
            .extensions
            .remove("x-tagGroups")
            .map(|v| serde_json::from_value(v).unwrap())
            .unwrap_or_default();
        tag_groups.push(group);
        api.extensions.insert(
            "x-tagGroups".into(),
            serde_json::to_value(&tag_groups).unwrap(),
        );
        api
    }
}

/// Define tag groups for ReDoc.
///
/// Example usage:
/// ```no_run
/// api.transform(
///     tag_groups(&[
///         ("A Tag Group", &["tag_1", "tag_2"]),
///         ("Another Tag Group", &["tag_3", "tag_4"]),
///     ])
/// )
/// ```
pub fn tag_groups<'t>(
    groups: &'t [(&'t str, &'t [&'t str])],
) -> impl FnOnce(OpenApi) -> OpenApi + 't {
    move |mut api: OpenApi| {
        for (group, tags) in groups {
            api = api.transform(tag_group(TagGroup {
                name: group.to_string(),
                tags: tags.into_iter().map(|t| t.to_string()).collect(),
            }));
        }

        api
    }
}

/// A tag group used in ReDoc.
#[derive(Debug, Serialize, Deserialize)]
pub struct TagGroup {
    pub name: String,
    tags: Vec<String>,
}

/// Sets the default response for operations that match the predicate.
///
/// Panics if the value cannot be JSON serialized.
pub fn default_response_when<D, R, P>(
    description: D,
    value: R,
    predicate: P,
) -> impl FnOnce(OpenApi) -> OpenApi
where
    D: ToString,
    R: JsonSchema + Serialize,
    P: Fn((&String, &PathItem, OperationMethod, &Operation)) -> bool,
{
    move |mut spec: OpenApi| {
        let defs = spec
            .components
            .as_mut()
            .map(|c| mem::take(&mut c.schemas))
            .unwrap_or_default();

        let mut gen = SchemaSettings::openapi3()
            .into_generator()
            .with_definitions(
                defs.into_iter()
                    .map(|(name, o)| (name, Schema::Object(o)))
                    .collect(),
            );

        let s = gen.subschema_for::<R>().into_object();

        match &mut spec.components {
            Some(c) => {
                c.schemas = gen
                    .take_definitions()
                    .into_iter()
                    .map(|(name, s)| (name, s.into_object()))
                    .collect();
            }
            None => {
                let mut c = Components::default();
                c.schemas = gen
                    .take_definitions()
                    .into_iter()
                    .map(|(name, s)| (name, s.into_object()))
                    .collect();
                spec.components = c.into();
            }
        }

        let ex = serde_json::to_value(value).unwrap();

        for (path, pt) in &mut spec.paths {
            // This is done this way because the of the mutable and
            // immutable borrows of the PathItem.
            let mut methods: Vec<OperationMethod> = Vec::new();

            for (om, op) in pt.operations() {
                if predicate((path, pt, om, op)) {
                    methods.push(om);
                }
            }

            for om in methods {
                pt.operation_mut(om).as_mut().unwrap().responses.default =
                    Some(RefOr::Object(Response {
                        description: description.to_string(),
                        content: {
                            let mut m = Map::new();
                            m.insert(
                                "application/json".into(),
                                MediaType {
                                    schema: Some(s.clone()),
                                    example: Some(ex.clone()),
                                    ..Default::default()
                                },
                            );
                            m
                        },
                        ..Default::default()
                    }));
            }
        }

        spec
    }
}

/// Removes the nullable property from parameters.
pub fn remove_parameter_nullable(mut spec: OpenApi) -> OpenApi {
    for (_, pt) in &mut spec.paths {
        for (_, op) in pt.operations_mut() {
            if let Some(op) = op {
                for param in &mut op.parameters {
                    match param {
                        RefOr::Ref(_) => { /* we don't touch it, as it can used anywhere else */ }
                        RefOr::Object(p) => match &mut p.value {
                            ParameterValue::Schema { schema, .. } => {
                                schema.extensions.remove("nullable");
                            }
                            ParameterValue::Content { content } => {
                                for (_, c) in content {
                                    match &mut c.schema {
                                        Some(s) => {
                                            s.extensions.remove("nullable");
                                        }
                                        None => {}
                                    }
                                }
                            }
                        },
                    }
                }
            }
        }
    }

    spec
}
