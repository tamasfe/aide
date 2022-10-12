use crate::{openapi::*, util::*};
use indexmap::IndexMap;
use serde::{Deserialize, Serialize};

/// Describes a single API operation on a path.
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq)]
#[serde(rename_all = "camelCase")]
#[derive(schemars::JsonSchema)]
pub struct Operation {
    /// A list of tags for API documentation control.
    /// Tags can be used for logical grouping of operations
    /// by resources or any other qualifier.
    #[serde(default)]
    #[serde(skip_serializing_if = "Vec::is_empty")]
    pub tags: Vec<String>,
    /// A short summary of what the operation does.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub summary: Option<String>,
    /// A verbose explanation of the operation behavior.
    /// CommonMark syntax MAY be used for rich text representation.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    /// Additional external documentation for this operation.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub external_docs: Option<ExternalDocumentation>,
    /// Unique string used to identify the operation.
    /// The id MUST be unique among all operations described in the API.
    /// Tools and libraries MAY use the operationId to uniquely identify
    /// an operation, therefore, it is RECOMMENDED to follow common
    /// programming naming conventions.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub operation_id: Option<String>,
    /// A list of parameters that are applicable for this operation.
    /// If a parameter is already defined at the Path Item, the new
    /// definition will override it but can never remove it.
    /// The list MUST NOT include duplicated parameters. A unique
    /// parameter is defined by a combination of a name and location.
    /// The list can use the Reference Object to link to parameters
    /// that are defined at the OpenAPI Object's components/parameters.
    #[serde(default)]
    #[serde(skip_serializing_if = "Vec::is_empty")]
    pub parameters: Vec<ReferenceOr<Parameter>>,
    /// The request body applicable for this operation.
    /// The requestBody is fully supported in HTTP methods
    /// where the HTTP 1.1 specification RFC7231 has explicitly
    /// defined semantics for request bodies. In other cases where
    /// the HTTP spec is vague (such as
    /// [GET](https://tools.ietf.org/html/rfc7231#section-4.3.1),
    /// [HEAD](https://tools.ietf.org/html/rfc7231#section-4.3.2) and
    /// [DELETE](https://tools.ietf.org/html/rfc7231#section-4.3.5)),
    /// requestBody is permitted but does not have well-defined semantics and
    /// SHOULD be avoided if possible.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub request_body: Option<ReferenceOr<RequestBody>>,
    /// The list of possible responses as they are returned
    /// from executing this operation.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub responses: Option<Responses>,
    /// Declares this operation to be deprecated.Default value is false.
    #[serde(default, skip_serializing_if = "is_false")]
    pub deprecated: bool,
    /// A declaration of which security mechanisms can be used for this
    /// operation. The list of values includes alternative security
    /// requirement objects that can be used. Only one of the security
    /// requirement objects need to be satisfied to authorize a request.
    /// This definition overrides any declared top-level security. To remove
    /// a top-level security declaration, an empty array can be used.
    #[serde(default)]
    #[serde(skip_serializing_if = "Vec::is_empty")]
    pub security: Vec<SecurityRequirement>,
    /// An alternative server array to service this operation.
    /// If an alternative server object is specified at the
    /// Path Item Object or Root level, it will be overridden by this value.
    #[serde(default)]
    #[serde(skip_serializing_if = "Vec::is_empty")]
    pub servers: Vec<Server>,
    /// Callbacks for the operation.
    #[serde(default, skip_serializing_if = "IndexMap::is_empty")]
    pub callbacks: IndexMap<String, ReferenceOr<Callback>>,
    /// Inline extensions to this object.
    #[serde(flatten, deserialize_with = "crate::util::deserialize_extensions")]
    pub extensions: IndexMap<String, serde_json::Value>,
}
