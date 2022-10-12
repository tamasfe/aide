#![allow(clippy::large_enum_variant)]
use indexmap::IndexMap;
use serde::{Deserialize, Serialize};

/// Defines a security scheme that can be used by the operations.
/// Supported schemes are HTTP authentication, an API key (either as a
/// header or as a query parameter), OAuth2's common flows (implicit, password,
/// application and access code) as defined in RFC6749, and OpenID Connect
/// Discovery.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
#[derive(schemars::JsonSchema)]
pub enum SecurityScheme {
    #[serde(rename = "apiKey")]
    ApiKey {
        #[serde(rename = "in")]
        location: ApiKeyLocation,
        name: String,
        #[serde(skip_serializing_if = "Option::is_none")]
        description: Option<String>,
        /// Inline extensions to this object.
        #[serde(flatten, deserialize_with = "crate::util::deserialize_extensions")]
        extensions: IndexMap<String, serde_json::Value>,
    },
    #[serde(rename = "http")]
    Http {
        scheme: String,
        #[serde(rename = "bearerFormat")]
        bearer_format: Option<String>,
        #[serde(skip_serializing_if = "Option::is_none")]
        description: Option<String>,
        /// Inline extensions to this object.
        #[serde(flatten, deserialize_with = "crate::util::deserialize_extensions")]
        extensions: IndexMap<String, serde_json::Value>,
    },
    #[serde(rename = "oauth2")]
    OAuth2 {
        flows: OAuth2Flows,
        #[serde(skip_serializing_if = "Option::is_none")]
        description: Option<String>,
        /// Inline extensions to this object.
        #[serde(flatten, deserialize_with = "crate::util::deserialize_extensions")]
        extensions: IndexMap<String, serde_json::Value>,
    },
    #[serde(rename = "openIdConnect")]
    OpenIdConnect {
        #[serde(rename = "openIdConnectUrl")]
        open_id_connect_url: String,
        #[serde(skip_serializing_if = "Option::is_none")]
        description: Option<String>,
        /// Inline extensions to this object.
        #[serde(flatten, deserialize_with = "crate::util::deserialize_extensions")]
        extensions: IndexMap<String, serde_json::Value>,
    },
    #[serde(rename = "mutualTLS")]
    MutualTls {
        #[serde(skip_serializing_if = "Option::is_none")]
        description: Option<String>,
        /// Inline extensions to this object.
        #[serde(flatten, deserialize_with = "crate::util::deserialize_extensions")]
        extensions: IndexMap<String, serde_json::Value>,
    },
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[derive(schemars::JsonSchema)]
pub enum ApiKeyLocation {
    Query,
    Header,
    Cookie,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq)]
#[serde(rename_all = "camelCase")]
#[derive(schemars::JsonSchema)]
pub struct OAuth2Flows {
    #[serde(flatten)]
    pub implicit: Option<OAuth2Flow>,
    #[serde(flatten)]
    pub password: Option<OAuth2Flow>,
    #[serde(flatten)]
    pub client_credentials: Option<OAuth2Flow>,
    #[serde(flatten)]
    pub authorization_code: Option<OAuth2Flow>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[derive(schemars::JsonSchema)]
pub enum OAuth2Flow {
    #[serde(rename_all = "camelCase")]
    Implicit {
        authorization_url: String,
        refresh_url: Option<String>,
        #[serde(default)]
        scopes: IndexMap<String, String>,
    },
    #[serde(rename_all = "camelCase")]
    Password {
        refresh_url: Option<String>,
        token_url: String,
        #[serde(default)]
        scopes: IndexMap<String, String>,
    },
    #[serde(rename_all = "camelCase")]
    ClientCredentials {
        refresh_url: Option<String>,
        token_url: String,
        #[serde(default)]
        scopes: IndexMap<String, String>,
    },
    #[serde(rename_all = "camelCase")]
    AuthorizationCode {
        authorization_url: String,
        token_url: String,
        refresh_url: Option<String>,
        #[serde(default)]
        scopes: IndexMap<String, String>,
    },
}
