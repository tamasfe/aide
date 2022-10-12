use indexmap::IndexMap;
use serde::{Deserialize, Serialize};

/// An object representing a Server Variable
/// for server URL template substitution.
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq, schemars::JsonSchema)]
pub struct ServerVariable {
    /// An enumeration of string values to be
    /// used if the substitution options are from a limited set.
    #[serde(rename = "enum")]
    #[serde(default)]
    #[serde(skip_serializing_if = "Vec::is_empty")]
    pub enumeration: Vec<String>,
    /// REQUIRED. The default value to use for substitution,
    /// and to send, if an alternate value is not supplied.
    /// Unlike the Schema Object's default, this value MUST
    /// be provided by the consumer.
    pub default: String,
    /// An optional description for the server
    /// variable. CommonMark syntax MAY be used
    /// for rich text representation.
    pub description: Option<String>,
    /// Inline extensions to this object.
    #[serde(flatten, deserialize_with = "crate::util::deserialize_extensions")]
    pub extensions: IndexMap<String, serde_json::Value>,
}
