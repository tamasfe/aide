#![cfg_attr(docsrs, feature(doc_auto_cfg))]
//! A simple crate provides a drop-in replacement for [`axum::Json`]
//! and friends in [`axum::extract`] that uses [`jsonschema`] to
//! validate requests schemas generated via [`schemars`].
//!
//! You might want to do this in order to provide a better
//! experience for your clients and not leak serde's error messages.
//!
//! All schemas are cached in a thread-local storage for
//! the life of the application (or thread).
//!
//! # Features
//!
//! - aide: support for [aide](https://docs.rs/aide/latest/aide/)

#![warn(clippy::pedantic, missing_docs)]
#![allow(clippy::wildcard_imports)]
use std::{any::TypeId, cell::RefCell, collections::HashMap};

use jsonschema::JSONSchema;
use schemars::gen::{SchemaGenerator, SchemaSettings};

/// Extra extractors similar to [`axum::extract`].
pub mod extract;

thread_local! {
    pub(crate) static CONTEXT: RefCell<SchemaContext> = RefCell::new(SchemaContext::new());
}

struct SchemaContext {
    generator: SchemaGenerator,
    schemas: HashMap<TypeId, JSONSchema>,
}

impl SchemaContext {
    fn new() -> Self {
        Self {
            generator: SchemaSettings::draft07()
                .with(|g| g.inline_subschemas = true)
                .into_generator(),
            schemas: HashMap::default(),
        }
    }
}
