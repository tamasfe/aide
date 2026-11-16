//! Responses use the schemars `Serialize` contract, request inputs the
//! `Deserialize` contract (tamasfe/aide#250).

#![allow(dead_code)]

use super::{routing::post, ApiRouter};
use crate::openapi::OpenApi;
use axum::{extract::Query, Json};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};

/// Differs by contract: `Option` without `skip_serializing_if`.
#[derive(Serialize, Deserialize, JsonSchema)]
struct Rating {
    rating: Option<i64>,
}

/// Same schema under both contracts.
#[derive(Serialize, Deserialize, JsonSchema)]
struct Plain {
    id: i64,
}

/// Identical text under both contracts, but refers to a split type.
#[derive(Serialize, Deserialize, JsonSchema)]
struct Outer {
    inner: Rating,
    plain: Plain,
}

#[derive(Serialize, Deserialize, JsonSchema)]
struct Request {
    note: Option<String>,
}

#[derive(Serialize, Deserialize, JsonSchema)]
struct Response {
    note: Option<String>,
}

/// `skip_serializing_if` keeps the field optional in responses too.
#[derive(Serialize, JsonSchema)]
struct Sparse {
    #[serde(skip_serializing_if = "Option::is_none")]
    note: Option<String>,
}

#[derive(Deserialize, JsonSchema)]
struct Filter {
    limit: Option<u32>,
}

async fn only_in(Json(_): Json<Request>) {}

async fn only_out() -> Json<Response> {
    Json(Response { note: None })
}

async fn sparse() -> Json<Sparse> {
    Json(Sparse { note: None })
}

async fn round_trip(Json(o): Json<Outer>) -> Json<Outer> {
    Json(o)
}

async fn query(Query(_): Query<Filter>) -> Json<Plain> {
    Json(Plain { id: 1 })
}

fn document() -> Value {
    crate::generate::reset_context();
    let mut api = OpenApi::default();
    let _ = ApiRouter::<()>::new()
        .api_route("/in", post(only_in))
        .api_route("/out", post(only_out))
        .api_route("/sparse", post(sparse))
        .api_route("/both", post(round_trip))
        .api_route("/query", post(query))
        .finish_api(&mut api);
    serde_json::to_value(&api).unwrap()
}

fn component(doc: &Value, name: &str) -> Value {
    doc["components"]["schemas"][name].clone()
}

fn request_ref(doc: &Value, path: &str) -> Value {
    doc["paths"][path]["post"]["requestBody"]["content"]["application/json"]["schema"]["$ref"]
        .clone()
}

fn response_ref(doc: &Value, path: &str) -> Value {
    doc["paths"][path]["post"]["responses"]["200"]["content"]["application/json"]["schema"]["$ref"]
        .clone()
}

#[test]
fn response_option_without_skip_is_required() {
    let doc = document();
    assert_eq!(
        response_ref(&doc, "/out"),
        json!("#/components/schemas/Response")
    );
    assert_eq!(component(&doc, "Response")["required"], json!(["note"]));
}

#[test]
fn response_option_with_skip_stays_optional() {
    let doc = document();
    assert_eq!(component(&doc, "Sparse").get("required"), None);
}

#[test]
fn request_option_stays_optional() {
    let doc = document();
    assert_eq!(
        request_ref(&doc, "/in"),
        json!("#/components/schemas/Request")
    );
    assert_eq!(component(&doc, "Request").get("required"), None);
}

#[test]
fn query_option_stays_optional() {
    let doc = document();
    let params = doc["paths"]["/query"]["post"]["parameters"]
        .as_array()
        .unwrap();
    assert_eq!(params.len(), 1);
    assert_eq!(params[0]["name"], json!("limit"));
    assert_ne!(params[0]["required"], json!(true));
}

#[test]
fn type_on_both_sides_is_split_and_refs_follow_the_side() {
    let doc = document();
    let schemas = doc["components"]["schemas"].as_object().unwrap();

    assert!(!schemas.contains_key("Rating"));
    assert_eq!(component(&doc, "Rating-Input").get("required"), None);
    assert_eq!(
        component(&doc, "Rating-Output")["required"],
        json!(["rating"])
    );

    // `Outer` has the same text under both contracts but refers to `Rating`,
    // so it is split too, and each side points at its own `Rating`.
    assert!(!schemas.contains_key("Outer"));
    assert_eq!(
        request_ref(&doc, "/both"),
        json!("#/components/schemas/Outer-Input")
    );
    assert_eq!(
        response_ref(&doc, "/both"),
        json!("#/components/schemas/Outer-Output")
    );
    assert_eq!(
        component(&doc, "Outer-Input")["properties"]["inner"]["$ref"],
        json!("#/components/schemas/Rating-Input")
    );
    assert_eq!(
        component(&doc, "Outer-Output")["properties"]["inner"]["$ref"],
        json!("#/components/schemas/Rating-Output")
    );

    // `Plain` is the same under both contracts: one shared component.
    assert!(schemas.contains_key("Plain"));
    assert!(!schemas.contains_key("Plain-Input"));
    assert!(!schemas.contains_key("Plain-Output"));
    assert_eq!(
        component(&doc, "Outer-Output")["properties"]["plain"]["$ref"],
        json!("#/components/schemas/Plain")
    );
}

#[test]
fn every_ref_resolves_and_no_private_path_leaks() {
    fn refs(v: &Value, out: &mut Vec<String>) {
        match v {
            Value::Object(m) => {
                for (k, v) in m {
                    match (k.as_str(), v) {
                        ("$ref", Value::String(r)) => out.push(r.clone()),
                        _ => refs(v, out),
                    }
                }
            }
            Value::Array(a) => a.iter().for_each(|v| refs(v, out)),
            _ => {}
        }
    }

    let doc = document();
    let mut all = Vec::new();
    refs(&doc, &mut all);
    assert_ne!(all.len(), 0, "the document has no $ref to check");
    let schemas = doc["components"]["schemas"].as_object().unwrap();
    for r in all {
        let name = r
            .strip_prefix("#/components/schemas/")
            .unwrap_or_else(|| panic!("unexpected $ref {r}"));
        assert!(schemas.contains_key(name), "dangling $ref {r}");
    }
}
