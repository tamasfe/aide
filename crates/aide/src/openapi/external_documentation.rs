use indexmap::IndexMap;
use serde::{Deserialize, Serialize};

/// Allows referencing an external resource for extended documentation.
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq, schemars::JsonSchema)]
pub struct ExternalDocumentation {
    /// A description of the target documentation.
    /// CommonMark syntax MAY be used for rich text representation.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    /// REQUIRED. The URL for the target documentation.
    /// This MUST be in the format of a URL.
    pub url: String,
    /// Inline extensions to this object.
    #[serde(flatten, deserialize_with = "crate::util::deserialize_extensions")]
    pub extensions: IndexMap<String, serde_json::Value>,
}
