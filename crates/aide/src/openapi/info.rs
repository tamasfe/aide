use crate::openapi::*;
use indexmap::IndexMap;
use serde::{Deserialize, Serialize};

/// The object provides metadata about the API.
/// The metadata MAY be used by the clients if needed,
/// and MAY be presented in editing or documentation generation tools for
/// convenience.
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq, schemars::JsonSchema)]
pub struct Info {
    /// REQUIRED. The title of the application.
    pub title: String,
    /// A short summary of the API.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub summary: Option<String>,
    /// A description of the API.
    /// CommonMark syntax MAY be used for rich text representation.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    /// A URL to the Terms of Service for the API.
    /// This MUST be in the format of a URL.
    #[serde(rename = "termsOfService", skip_serializing_if = "Option::is_none")]
    pub terms_of_service: Option<String>,
    /// The contact information for the exposed API.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub contact: Option<Contact>,
    /// The license information for the exposed API.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub license: Option<License>,
    /// REQUIRED. The version of the OpenAPI document (which is distinct from
    /// the OpenAPI Specification version or the API implementation version).
    pub version: String,
    /// Inline extensions to this object.
    #[serde(flatten, deserialize_with = "crate::util::deserialize_extensions")]
    pub extensions: IndexMap<String, serde_json::Value>,
}
