use std::marker::PhantomData;

use crate::{openapi::*, util::*};
use indexmap::IndexMap;
use serde::{Deserialize, Deserializer, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq, schemars::JsonSchema)]
pub struct Responses {
    /// The documentation of responses other than the ones declared
    /// for specific HTTP response codes. Use this field to cover
    /// undeclared responses.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub default: Option<ReferenceOr<Response>>,
    /// Any HTTP status code can be used as the property name,
    /// but only one property per code, to describe the expected
    /// response for that HTTP status code. This field MUST be enclosed in
    /// quotation marks (for example, "200") for compatibility between
    /// JSON and YAML. To define a range of response codes, this field
    /// MAY contain the uppercase wildcard character X. For example,
    /// 2XX represents all response codes between [200-299]. The following
    /// range definitions are allowed: 1XX, 2XX, 3XX, 4XX, and 5XX.
    /// If a response range is defined using an explicit code, the
    /// explicit code definition takes precedence over the range
    /// definition for that code.
    #[serde(flatten, deserialize_with = "deserialize_responses")]
    pub responses: IndexMap<StatusCode, ReferenceOr<Response>>,
    /// Inline extensions to this object.
    #[serde(flatten, deserialize_with = "crate::util::deserialize_extensions")]
    pub extensions: IndexMap<String, serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq, schemars::JsonSchema)]
pub struct Response {
    /// REQUIRED. A description of the response.
    /// CommonMark syntax MAY be used for rich text representation.
    pub description: String,

    /// Maps a header name to its definition.
    /// RFC7230 states header names are case insensitive.
    /// If a response header is defined with the name "Content-Type",
    /// it SHALL be ignored.
    #[serde(default, skip_serializing_if = "IndexMap::is_empty")]
    pub headers: IndexMap<String, ReferenceOr<Header>>,

    /// A map containing descriptions of potential response payloads.
    /// The key is a media type or media type range and the value
    /// describes it. For responses that match multiple keys,
    /// only the most specific key is applicable. e.g. text/plain
    /// overrides text/*
    #[serde(default, skip_serializing_if = "IndexMap::is_empty")]
    pub content: IndexMap<String, MediaType>,

    /// A map of operations links that can be followed from the response.
    /// The key of the map is a short name for the link, following
    /// the naming constraints of the names for Component Objects.
    #[serde(default, skip_serializing_if = "IndexMap::is_empty")]
    pub links: IndexMap<String, ReferenceOr<Link>>,

    /// Inline extensions to this object.
    #[serde(flatten, deserialize_with = "crate::util::deserialize_extensions")]
    pub extensions: IndexMap<String, serde_json::Value>,
}

fn deserialize_responses<'de, D>(
    deserializer: D,
) -> Result<IndexMap<StatusCode, ReferenceOr<Response>>, D::Error>
where
    D: Deserializer<'de>,
{
    // We rely on the result of StatusCode::deserialize to act as our
    // predicate; it will succeed only for status code.
    deserializer.deserialize_map(PredicateVisitor(|_: &StatusCode| true, PhantomData))
}
