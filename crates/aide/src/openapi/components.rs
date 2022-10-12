use crate::openapi::*;
use indexmap::IndexMap;
use serde::{Deserialize, Serialize};

/// Holds a set of reusable objects for different aspects of the OAS.
/// All objects defined within the components object will have no effect
/// on the API unless they are explicitly referenced from properties
/// outside the components object.
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq)]
#[serde(rename_all = "camelCase")]
#[derive(schemars::JsonSchema)]
pub struct Components {
    /// An object to hold reusable Security Scheme Objects.
    #[serde(default, skip_serializing_if = "IndexMap::is_empty")]
    pub security_schemes: IndexMap<String, ReferenceOr<SecurityScheme>>,
    /// An object to hold reusable Response Objects.
    #[serde(default, skip_serializing_if = "IndexMap::is_empty")]
    pub responses: IndexMap<String, ReferenceOr<Response>>,
    /// An object to hold reusable Parameter Objects.
    #[serde(default, skip_serializing_if = "IndexMap::is_empty")]
    pub parameters: IndexMap<String, ReferenceOr<Parameter>>,
    /// An object to hold reusable Example Objects.
    #[serde(default, skip_serializing_if = "IndexMap::is_empty")]
    pub examples: IndexMap<String, ReferenceOr<Example>>,
    /// An object to hold reusable Request Body Objects.
    #[serde(default, skip_serializing_if = "IndexMap::is_empty")]
    pub request_bodies: IndexMap<String, ReferenceOr<RequestBody>>,
    /// An object to hold reusable Header Objects.
    #[serde(default, skip_serializing_if = "IndexMap::is_empty")]
    pub headers: IndexMap<String, ReferenceOr<Header>>,
    /// An object to hold reusable Schema Objects.
    #[serde(default, skip_serializing_if = "IndexMap::is_empty")]
    pub schemas: IndexMap<String, SchemaObject>,
    /// An object to hold reusable Link Objects.
    #[serde(default, skip_serializing_if = "IndexMap::is_empty")]
    pub links: IndexMap<String, ReferenceOr<Link>>,
    /// An object to hold reusable Callback Objects.
    #[serde(default, skip_serializing_if = "IndexMap::is_empty")]
    pub callbacks: IndexMap<String, ReferenceOr<Callback>>,
    #[serde(default, skip_serializing_if = "IndexMap::is_empty")]
    /// An object to hold reusable Path Item Objects.
    pub path_items: IndexMap<String, ReferenceOr<PathItem>>,
    /// Inline extensions to this object.
    #[serde(flatten, deserialize_with = "crate::util::deserialize_extensions")]
    pub extensions: IndexMap<String, serde_json::Value>,
}
