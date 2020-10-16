#[cfg(feature = "actix")]
use actix_web::{web, HttpRequest, HttpResponse, Resource};

#[cfg(feature = "ui-redoc")]
use askama::Template;

use super::definition::OpenApi;

#[cfg(feature = "ui-redoc")]
#[derive(Debug, Clone)]
pub struct ReDoc {
    url: Option<String>,
    spec_json: Option<String>,
}

#[cfg(feature = "ui-redoc")]
#[derive(Debug, Template)]
#[template(path = "redoc.html")]
struct ReDocTemplate {
    spec_url: String,
}

#[cfg(feature = "ui-redoc")]
impl ReDoc {
    pub fn new() -> Self {
        Self {
            url: None,
            spec_json: None,
        }
    }

    /// Uses the given OpenAPI v3 document.
    ///
    /// **Panics**
    ///
    /// If an external URL is already set.
    pub fn openapi_v3(mut self, api: &OpenApi) -> Self {
        self.spec_json = Some(serde_json::to_string(api).unwrap());
        self.check_external_url();
        self
    }

    /// Uses the given OpenAPI v2 or v3 document already serialized as JSON.
    ///
    /// **Panics**
    ///
    /// If an external URL is already set.
    pub fn openapi_json(mut self, json: &str) -> Self {
        self.spec_json = Some(json.to_string());
        self.check_external_url();
        self
    }

    /// Sets the path for the API document that will be used to serve the document.
    /// Both relative and absolute path are relative to where the ReDoc root is served from.
    ///
    /// External URLs are allowed if there is no document given.
    ///
    /// Defaults to `api.json` if there is a document provided, otherwise the official
    /// example [Pet Store API](https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/examples/v3.0/petstore.yaml) is used.
    ///
    /// **Panics**
    ///
    /// If an external URL is given and there's a document provided.
    pub fn api_at(mut self, url: &str) -> Self {
        self.url = Some(url.trim_start_matches("/").to_string());
        self.check_external_url();
        self
    }

    /// Serve ReDoc in an Actix Web service at the given path.
    /// If a local document is set, it is also served.
    #[cfg(feature = "actix")]
    pub fn actix_service(self, path: &str) -> Resource {
        let p = path.trim_end_matches('/').to_string() + "{tail:.*}";

        const REDOC_STANDALONE: &str = include_str!("../../../assets/redoc/redoc.standalone.js");

        let spec_url = self.url.unwrap_or_else(|| "api.json".to_string());
        let spec_json = self.spec_json;

        let redoc_html: String = ReDocTemplate {
            spec_url: spec_url.clone(),
        }
        .render()
        .unwrap();

        web::resource(&p).route(web::get().to(move |req: HttpRequest| -> HttpResponse {
            match req.match_info().get("tail") {
                Some(p) => {
                    if p == "" || p == "/" || p == "index" || p == "index.html" {
                        if p == "" && !req.uri().path().ends_with('/') {
                            HttpResponse::MovedPermanently()
                                .set_header("LOCATION", req.uri().path().to_string() + "/")
                                .finish()
                        } else {
                            HttpResponse::Ok()
                                .content_type("text/html;charset=utf-8")
                                .body(redoc_html.clone())
                        }
                    } else if p == "/".to_string() + &spec_url {
                        HttpResponse::Ok()
                            .content_type("application/json;charset=utf-8")
                            .body(spec_json.clone().unwrap())
                    } else if p == "/redoc.standalone.js" {
                        HttpResponse::Ok()
                            .content_type("text/javascript;charset=utf-8")
                            .body(REDOC_STANDALONE)
                    } else {
                        HttpResponse::NotFound().finish()
                    }
                }
                None => {
                    if !req.uri().path().ends_with('/') {
                        return HttpResponse::MovedPermanently()
                            .set_header("LOCATION", req.uri().path().to_string() + "/")
                            .finish();
                    } else {
                        HttpResponse::Ok()
                            .content_type("text/html")
                            .body(redoc_html.clone())
                    }
                }
            }
        }))
    }

    fn check_external_url(&self) {
        if self.spec_json.is_some() {
            if let Some(u) = &self.url {
                let lower = u.to_lowercase();

                if lower.starts_with("http://") || lower.starts_with("https://") {
                    panic!("external API URLs and local API documents are mutually exclusive")
                }
            }
        }
    }
}
