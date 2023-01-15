#![allow(clippy::large_enum_variant)]
use crate::{openapi::*, util::*};
use indexmap::IndexMap;
use serde::{Deserialize, Serialize};

/// Describes a single operation parameter.
///
/// A unique parameter is defined by a combination of a name and location.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, schemars::JsonSchema)]
pub struct ParameterData {
    /// REQUIRED. The name of the parameter. Parameter names are case sensitive.
    /// If in is "path", the name field MUST correspond to the associated path
    /// segment from the path field in the Paths Object. See Path Templating for
    /// further information.
    ///
    /// If in is "header" and the name field is "Accept", "Content-Type" or
    /// "Authorization", the parameter definition SHALL be ignored.
    ///
    /// For all other cases, the name corresponds to the parameter name
    /// used by the in property.
    pub name: String,
    /// A brief description of the parameter. This could
    /// contain examples of use. CommonMark syntax MAY be
    /// used for rich text representation.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    /// Determines whether this parameter is mandatory.
    /// If the parameter location is "path", this property
    /// is REQUIRED and its value MUST be true. Otherwise,
    /// the property MAY be included and its default value
    /// is false.
    #[serde(default, skip_serializing_if = "is_false")]
    pub required: bool,
    /// Specifies that a parameter is deprecated and SHOULD
    /// be transitioned out of usage.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub deprecated: Option<bool>,
    #[serde(flatten)]
    pub format: ParameterSchemaOrContent,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub example: Option<serde_json::Value>,
    #[serde(default, skip_serializing_if = "IndexMap::is_empty")]
    pub examples: IndexMap<String, ReferenceOr<Example>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub explode: Option<bool>,
    /// Inline extensions to this object.
    #[serde(flatten, deserialize_with = "crate::util::deserialize_extensions")]
    pub extensions: IndexMap<String, serde_json::Value>,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
#[serde(rename_all = "camelCase")]
#[derive(schemars::JsonSchema)]
pub enum ParameterSchemaOrContent {
    /// The schema defining the type used for the parameter.
    Schema(SchemaObject),
    /// A map containing the representations for the parameter. The key is the
    /// media type and the value describes it. The map MUST only contain one
    /// entry.
    Content(Content),
}

pub type Content = IndexMap<String, MediaType>;

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
#[serde(tag = "in", rename_all = "camelCase")]
#[derive(schemars::JsonSchema)]
pub enum Parameter {
    Query {
        #[serde(flatten)]
        parameter_data: ParameterData,
        /// Determines whether the parameter value SHOULD allow reserved
        /// characters, as defined by RFC3986 :/?#[]@!$&'()*+,;= to be included
        /// without percent-encoding. This property only applies to parameters
        /// with an in value of query. The default value is false.
        #[serde(default, skip_serializing_if = "is_false")]
        allow_reserved: bool,
        /// Describes how the parameter value will be serialized depending on
        /// the type of the parameter value. Default values (based on value of
        /// in): for query - form; for path - simple; for header - simple; for
        /// cookie - form.
        #[serde(default, skip_serializing_if = "SkipSerializeIfDefault::skip")]
        style: QueryStyle,
        /// Sets the ability to pass empty-valued parameters. This is
        /// valid only for query parameters and allows sending a parameter
        /// with an empty value. Default value is false. If style is used,
        /// and if behavior is n/a (cannot be serialized), the value of
        /// allowEmptyValue SHALL be ignored.
        #[serde(skip_serializing_if = "Option::is_none")]
        allow_empty_value: Option<bool>,
    },
    Header {
        #[serde(flatten)]
        parameter_data: ParameterData,
        /// Describes how the parameter value will be serialized depending on
        /// the type of the parameter value. Default values (based on value of
        /// in): for query - form; for path - simple; for header - simple; for
        /// cookie - form.
        #[serde(default, skip_serializing_if = "SkipSerializeIfDefault::skip")]
        style: HeaderStyle,
    },
    Path {
        #[serde(flatten)]
        parameter_data: ParameterData,
        /// Describes how the parameter value will be serialized depending on
        /// the type of the parameter value. Default values (based on value of
        /// in): for query - form; for path - simple; for header - simple; for
        /// cookie - form.
        #[serde(default, skip_serializing_if = "SkipSerializeIfDefault::skip")]
        style: PathStyle,
    },
    Cookie {
        #[serde(flatten)]
        parameter_data: ParameterData,
        /// Describes how the parameter value will be serialized depending on
        /// the type of the parameter value. Default values (based on value of
        /// in): for query - form; for path - simple; for header - simple; for
        /// cookie - form.
        #[serde(default, skip_serializing_if = "SkipSerializeIfDefault::skip")]
        style: CookieStyle,
    },
}

impl Parameter {
    /// Returns the `parameter_data` field of this [ParameterData].
    pub fn parameter_data(self) -> ParameterData {
        match self {
            Parameter::Query {
                parameter_data,
                allow_reserved: _,
                style: _,
                allow_empty_value: _,
            } => parameter_data,
            Parameter::Header {
                parameter_data,
                style: _,
            } => parameter_data,
            Parameter::Path {
                parameter_data,
                style: _,
            } => parameter_data,
            Parameter::Cookie {
                parameter_data,
                style: _,
            } => parameter_data,
        }
    }

    /// Returns the `parameter_data` field of this [ParameterData] by reference.
    pub fn parameter_data_ref(&self) -> &ParameterData {
        match self {
            Parameter::Query {
                parameter_data,
                allow_reserved: _,
                style: _,
                allow_empty_value: _,
            } => parameter_data,
            Parameter::Header {
                parameter_data,
                style: _,
            } => parameter_data,
            Parameter::Path {
                parameter_data,
                style: _,
            } => parameter_data,
            Parameter::Cookie {
                parameter_data,
                style: _,
            } => parameter_data,
        }
    }

    /// Returns the `parameter_data` field of this [ParameterData] by mutable reference.
    pub fn parameter_data_mut(&mut self) -> &mut ParameterData {
        match self {
            Parameter::Query {
                parameter_data,
                allow_reserved: _,
                style: _,
                allow_empty_value: _,
            } => parameter_data,
            Parameter::Header {
                parameter_data,
                style: _,
            } => parameter_data,
            Parameter::Path {
                parameter_data,
                style: _,
            } => parameter_data,
            Parameter::Cookie {
                parameter_data,
                style: _,
            } => parameter_data,
        }
    }
}

struct SkipSerializeIfDefault;
impl SkipSerializeIfDefault {
    #[cfg(feature = "skip_serializing_defaults")]
    fn skip<D: Default + std::cmp::PartialEq>(value: &D) -> bool {
        value == &Default::default()
    }
    #[cfg(not(feature = "skip_serializing_defaults"))]
    fn skip<D: Default + std::cmp::PartialEq>(_value: &D) -> bool {
        false
    }
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
#[derive(schemars::JsonSchema)]
pub enum PathStyle {
    Matrix,
    Label,
    Simple,
}

impl Default for PathStyle {
    fn default() -> Self {
        PathStyle::Simple
    }
}
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
#[derive(schemars::JsonSchema)]
pub enum QueryStyle {
    Form,
    SpaceDelimited,
    PipeDelimited,
    DeepObject,
}

impl Default for QueryStyle {
    fn default() -> Self {
        QueryStyle::Form
    }
}
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
#[derive(schemars::JsonSchema)]
pub enum CookieStyle {
    Form,
}

impl Default for CookieStyle {
    fn default() -> CookieStyle {
        CookieStyle::Form
    }
}
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
#[derive(schemars::JsonSchema)]
pub enum HeaderStyle {
    Simple,
}

impl Default for HeaderStyle {
    fn default() -> HeaderStyle {
        HeaderStyle::Simple
    }
}
