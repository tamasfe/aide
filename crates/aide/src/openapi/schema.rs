#![allow(clippy::large_enum_variant)]
use crate::openapi::*;
use schemars::Schema;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, schemars::JsonSchema)]
pub struct SchemaObject {
    #[serde(flatten)]
    pub json_schema: Schema,
    /// Additional external documentation for this schema.
    #[serde(rename = "externalDocs")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub external_docs: Option<ExternalDocumentation>,
    /// A free-form property to include an example of an instance for this
    /// schema. To represent examples that cannot be naturally represented in
    /// JSON or YAML, a string value can be used to contain the example with
    /// escaping where necessary. **Deprecated:** The `example` property has
    /// been deprecated in favor of the JSON Schema `examples` keyword. Use
    /// of `example` is discouraged, and later versions of this
    /// specification may remove it.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub example: Option<serde_json::Value>,
}

#[cfg(test)]
mod tests {
    use crate::openapi::ExternalDocumentation;

    use super::SchemaObject;
    use schemars::Schema;
    use serde_json::json;

    #[test]
    fn test_serialize_ref_schema() {
        let serialized = serde_json::to_value(SchemaObject {
            json_schema: Schema::new_ref("test".to_owned()),
            external_docs: None,
            example: None,
        })
        .unwrap();

        assert_eq!(serialized, json!({ "$ref": "test" }));
    }

    #[test]
    fn test_serialize_ref_schema_with_external_docs() {
        let serialized = serde_json::to_value(SchemaObject {
            json_schema: Schema::new_ref("test".to_owned()),
            external_docs: Some(ExternalDocumentation {
                description: None,
                url: "http://example.org".to_owned(),
                extensions: Default::default(),
            }),
            example: None,
        })
        .unwrap();

        assert_eq!(
            serialized,
            json!({
                "$ref": "test",
                "externalDocs": { "url": "http://example.org" },
            })
        );
    }
}
