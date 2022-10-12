use crate::openapi::*;
use indexmap::IndexMap;
use serde::{Deserialize, Serialize};

/// The Link object represents a possible design-time link for a response.
/// The presence of a link does not guarantee the caller's ability to
/// successfully invoke it, rather it provides a known relationship and
/// traversal mechanism between responses and other operations.
///
/// Unlike dynamic links (i.e. links provided in the response payload),
/// the OAS linking mechanism does not require link information in the runtime
/// response.
///
/// For computing links, and providing instructions to execute them,
/// a runtime expression is used for accessing values in an operation
/// and using them as parameters while invoking the linked operation.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[derive(schemars::JsonSchema)]
pub struct Link {
    /// A description of the link.
    /// CommonMark syntax MAY be used for rich text representation.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    /// Either a operationRef or operationId
    #[serde(flatten)]
    pub operation: LinkOperation,
    /// A literal value or {expression} to use as a request body
    /// when calling the target operation.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub request_body: Option<serde_json::Value>,
    /// A map representing parameters to pass to an operation
    /// as specified with operationId or identified via operationRef.
    /// The key is the parameter name to be used, whereas the value
    /// can be a constant or an expression to be evaluated and passed
    /// to the linked operation. The parameter name can be qualified
    /// using the parameter location [{in}.]{name} for operations
    /// that use the same parameter name in different locations (e.g. path.id).
    #[serde(default, skip_serializing_if = "IndexMap::is_empty")]
    pub parameters: IndexMap<String, serde_json::Value>,
    /// A server object to be used by the target operation.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub server: Option<Server>,
    /// Inline extensions to this object.
    #[serde(flatten, deserialize_with = "crate::util::deserialize_extensions")]
    pub extensions: IndexMap<String, serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[derive(schemars::JsonSchema)]
pub enum LinkOperation {
    /// A relative or absolute reference to an OAS operation.
    /// This field is mutually exclusive of the operationId field,
    /// and MUST point to an Operation Object. Relative operationRef
    /// values MAY be used to locate an existing Operation Object
    /// in the OpenAPI definition. See the rules for resolving Relative
    /// References.
    OperationRef(String),
    /// The name of an existing, resolvable OAS operation,
    /// as defined with a unique operationId. This field is
    /// mutually exclusive of the operationRef field.
    OperationId(String),
}
