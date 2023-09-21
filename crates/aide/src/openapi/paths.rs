use std::marker::PhantomData;

use crate::{openapi::*, util::*};
use indexmap::IndexMap;
use serde::{Deserialize, Deserializer, Serialize};
use tracing::warn;

/// Describes the operations available on a single path.
/// A Path Item MAY be empty, due to ACL constraints.
/// The path itself is still exposed to the documentation
/// viewer but they will not know which operations and
/// parameters are available.
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq, schemars::JsonSchema)]
pub struct PathItem {
    /// Allows for a referenced definition of this path item. The referenced
    /// structure MUST be in the form of a Path Item Object.  In case a Path
    /// Item Object field appears both in the defined object and the referenced
    /// object, the behavior is undefined. See the rules for resolving Relative
    /// References.
    #[serde(rename = "$ref", skip_serializing_if = "Option::is_none")]
    pub reference: Option<String>,
    /// An optional, string summary, intended to apply to all operations in
    /// this path.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub summary: Option<String>,
    /// An optional, string description, intended to apply to all operations in
    /// this path. CommonMark syntax MAY be used for rich text representation.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub get: Option<Operation>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub put: Option<Operation>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub post: Option<Operation>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub delete: Option<Operation>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub options: Option<Operation>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub head: Option<Operation>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub patch: Option<Operation>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub trace: Option<Operation>,
    /// An alternative server array to service all operations in this path.
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub servers: Vec<Server>,
    /// A list of parameters that are applicable for all the
    /// operations described under this path. These parameters
    /// can be overridden at the operation level, but cannot be
    /// removed there. The list MUST NOT include duplicated parameters.
    /// A unique parameter is defined by a combination of a name and location.
    /// The list can use the Reference Object to link to parameters that
    /// are defined at the OpenAPI Object's components/parameters.
    #[serde(default)]
    #[serde(skip_serializing_if = "Vec::is_empty")]
    pub parameters: Vec<ReferenceOr<Parameter>>,
    /// Inline extensions to this object.
    #[serde(flatten, deserialize_with = "crate::util::deserialize_extensions")]
    pub extensions: IndexMap<String, serde_json::Value>,
}

impl PathItem {
    /// Returns an iterator of references to the [Operation]s in the [PathItem].
    pub fn iter(&self) -> impl Iterator<Item = (&str, &'_ Operation)> {
        vec![
            ("get", &self.get),
            ("put", &self.put),
            ("post", &self.post),
            ("delete", &self.delete),
            ("options", &self.options),
            ("head", &self.head),
            ("patch", &self.patch),
            ("trace", &self.trace),
        ]
        .into_iter()
        .filter_map(|(method, maybe_op)| maybe_op.as_ref().map(|op| (method, op)))
    }

    /// Merges two path items as well as it can. Global settings will likely conflict. Conflicts always favor self.
    pub fn merge(mut self, other: Self) -> Self {
        self.merge_with(other);
        self
    }

    /// Merges self with other path item as well as it can. Global settings will likely conflict. Conflicts always favor self.
    pub fn merge_with(&mut self, mut other: Self) {
        self.servers.append(&mut other.servers);

        self.parameters.append(&mut other.parameters);

        for (k, ext) in other.extensions {
            self.extensions
                .entry(k.clone())
                .and_modify(|_| warn!("Conflict on merging extension {}", k))
                .or_insert(ext);
        }
        macro_rules! merge {
            ($id:ident) => {
                if let Some($id) = other.$id {
                    if self.$id.is_some() {
                        warn!(
                            "Conflict on merging {}, ignoring duplicate",
                            stringify!($id)
                        );
                    } else {
                        let _ = self.$id.insert($id);
                    }
                }
            };
        }
        merge!(reference);
        merge!(summary);
        merge!(description);
        merge!(get);
        merge!(put);
        merge!(post);
        merge!(delete);
        merge!(options);
        merge!(head);
        merge!(patch);
        merge!(trace);
    }
}

impl IntoIterator for PathItem {
    type Item = (&'static str, Operation);

    type IntoIter = std::vec::IntoIter<Self::Item>;

    /// Returns an iterator of the [Operation]s in the [PathItem].
    fn into_iter(self) -> Self::IntoIter {
        vec![
            ("get", self.get),
            ("put", self.put),
            ("post", self.post),
            ("delete", self.delete),
            ("options", self.options),
            ("head", self.head),
            ("patch", self.patch),
            ("trace", self.trace),
        ]
        .into_iter()
        .filter_map(|(method, maybe_op)| maybe_op.map(|op| (method, op)))
        .collect::<Vec<_>>()
        .into_iter()
    }
}

/// Holds the relative paths to the individual endpoints and
/// their operations. The path is appended to the URL from the
/// Server Object in order to construct the full URL. The Paths
/// MAY be empty, due to Access Control List (ACL) constraints.
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq, schemars::JsonSchema)]
pub struct Paths {
    /// A map of PathItems or references to them.
    #[serde(flatten, deserialize_with = "deserialize_paths")]
    pub paths: IndexMap<String, ReferenceOr<PathItem>>,
    /// Inline extensions to this object.
    #[serde(flatten, deserialize_with = "crate::util::deserialize_extensions")]
    pub extensions: IndexMap<String, serde_json::Value>,
}

impl Paths {
    /// Iterate over path items.
    pub fn iter(&self) -> indexmap::map::Iter<String, ReferenceOr<PathItem>> {
        self.paths.iter()
    }
}

impl IntoIterator for Paths {
    type Item = (String, ReferenceOr<PathItem>);

    type IntoIter = indexmap::map::IntoIter<String, ReferenceOr<PathItem>>;

    fn into_iter(self) -> Self::IntoIter {
        self.paths.into_iter()
    }
}

fn deserialize_paths<'de, D>(
    deserializer: D,
) -> Result<IndexMap<String, ReferenceOr<PathItem>>, D::Error>
where
    D: Deserializer<'de>,
{
    deserializer.deserialize_map(PredicateVisitor(
        |key: &String| key.starts_with('/'),
        PhantomData,
    ))
}
