#![allow(clippy::large_enum_variant)]
use crate::openapi::*;
use schemars::Schema;
use serde::{ser::SerializeMap, Deserialize, Serialize};
use serde_json::json;

#[derive(Debug, Clone, Deserialize, PartialEq, schemars::JsonSchema)]
pub struct SchemaObject {
    #[serde(flatten)]
    pub json_schema: Schema,
    /// Additional external documentation for this schema.
    #[serde(rename = "externalDocs")]
    pub external_docs: Option<ExternalDocumentation>,
    /// A free-form property to include an example of an instance for this
    /// schema. To represent examples that cannot be naturally represented in
    /// JSON or YAML, a string value can be used to contain the example with
    /// escaping where necessary. **Deprecated:** The `example` property has
    /// been deprecated in favor of the JSON Schema `examples` keyword. Use
    /// of `example` is discouraged, and later versions of this
    /// specification may remove it.
    pub example: Option<serde_json::Value>,
}

impl Serialize for SchemaObject {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        if self.external_docs.is_none() && self.example.is_none() {
            return self.json_schema.serialize(serializer);
        }

        let mut map = serializer.serialize_map(None)?;
        match self.json_schema.as_bool() {
            Some(true) => {}
            Some(false) => {
                map.serialize_entry("not", &json!({}))?;
            }
            _ => {
                let object = self
                    .json_schema
                    .as_object()
                    .expect("JSON schema must be either a bool or an object");
                for (k, v) in object {
                    map.serialize_entry(k, v)?;
                }
            }
        }

        if let Some(value) = &self.external_docs {
            map.serialize_entry("externalDocs", value)?;
        }
        if let Some(value) = &self.example {
            map.serialize_entry("example", value)?;
        }

        map.end()
    }
}

#[cfg(test)]
mod tests {
    use crate::openapi::ExternalDocumentation;

    use super::SchemaObject;
    use schemars::{json_schema, Schema};
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

    #[test]
    fn test_serialize_true_schema() {
        let serialized = serde_json::to_value(SchemaObject {
            json_schema: json_schema!(true),
            external_docs: None,
            example: None,
        })
        .unwrap();

        assert_eq!(serialized, json!(true));
    }

    #[test]
    fn test_serialize_true_schema_with_external_docs() {
        let serialized = serde_json::to_value(SchemaObject {
            json_schema: json_schema!(true),
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
                "externalDocs": { "url": "http://example.org" },
            })
        );
    }

    #[test]
    fn test_serialize_false_schema_with_example() {
        let example = json!({
            "what a useless schema": "even this example is wrong",
        });
        let serialized = serde_json::to_value(SchemaObject {
            json_schema: json_schema!(false),
            external_docs: None,
            example: Some(example.clone()),
        })
        .unwrap();

        assert_eq!(
            serialized,
            json!({
                "not": {},
                "example": example,
            })
        );
    }
}
