//! # Aide
//!
//! `aide` is a code-first [Open API](https://www.openapis.org/) documentation
//! generator library. It aims for tight integrations with frameworks and
//! following their conventions, while tries to be out
//! of the way when it is not needed.
//!
//! The goal is to minimize the learning curve, mental context switches
//! and make documentation somewhat slightly less of a chore.
//!
//! See the [examples](https://github.com/tamasfe/aide/tree/master/examples)
//! to see how Aide is used with various frameworks.
//!
//! Currently only Open API version `3.1.0` is supported.
//!
//! Previous releases of aide relied heavily on macros, and the
//! [`linkme`](https://docs.rs/linkme/latest/linkme/) crate for automagic global state.
//! While it all worked, macros were hard to reason about,
//! rustfmt did not work with them, code completion was hit-and-miss.
//!
//! With `0.5.0`, aide was rewritten and instead it is based on on good old functions,
//! type inference and declarative APIs based on the builder pattern.
//!
//! Now all documentation can be traced in the source code[^1],
//! no more macro and global magic all over the place.[^2]
//!
//! [^1]: and with [tracing] spans
//!
//! [^2]: A thread-local context is still used for some settings and
//! shared state.
//!
//! ## Type-based Generation
//!
//! The library uses [`schemars`] for schema generation for types.
//! It should be enough to slap [`JsonSchema`](schemars::JsonSchema)
//! alongside [serde]'s `Serialize/Deserialize` for JSON-based APIs.
//!
//! Additionally the [`OperationInput`] and [`OperationOutput`] traits
//! are used for extractor and response types in frameworks to automatically generate
//! expected HTTP parameter and response documentation.
//!
//! For example a `Json<T>` extractor will generate an `application/json`
//! request body with the schema of `T` if it implements
//! [`JsonSchema`](schemars::JsonSchema).
//!
//! ## Declarative Documentation
//!
//! All manual documentation is based on composable [`transform`]
//! functions and builder-pattern-like API.
//!
//! ## Supported Frameworks
//!
//! - [axum](https://docs.rs/axum/latest/axum/): [`aide::axum`](axum).
//! - [actix-web](https://docs.rs/actix-web/latest/actix_web/) is **not
//!   supported** since `0.5.0` only due to lack of developer capacity,
//!   but it's likely to be supported again in the future. If you use
//!   `actix-web` you can still use the macro-based `0.4.*` version of the
//!   library for the time being.
//!
//! ## Errors
//!
//! Some errors occur during code generation, these
//! are usually safe to ignore but might indicate bugs.
//!
//! By default no action is taken on errors, in order to handle them
//! it is possible to register an error handler in the thread-local context
//! with [`aide::gen::on_error`](crate::gen::on_error).
//!
//! False positives are chosen over silently swallowing potential
//! errors, these might happen when there is not enough contextual
//! information to determine whether an error is in fact an error.
//! It is important to keep this in mind, without any filters
//! **simply panicking on all errors is not advised**, especially
//! not in production.
//!
//! ## Feature Flags
//!
//! No features are enabled by default.
//!
//! - `macros`: additional helper macros
//!
//! ### Third-party trait implementations
//!
//! - `bytes`
//! - `http`
//! - `serde_qs` (when used with `axum`)
//!
//! ### axum integration
//!
//! `axum` and its features gates:
//!
//! - `axum`
//! - `axum-ws`
//! - `axum-multipart`
//! - `axum-headers`
//!
//! `axum-extra` and its features gates:
//!
//! - `axum-extra`
//! - `axum-extra-cookie`
//! - `axum-extra-cookie-private`
//! - `axum-extra-form`
//! - `axum-extra-query`
//! - `axum-extra-json-deserializer`
//!
//! ## MSRV
//!
//! The library will always support the latest stable Rust version,
//! it might support older versions but without guarantees.
//!
#![cfg_attr(docsrs, feature(doc_auto_cfg))]
#![warn(clippy::pedantic, missing_docs)]
#![allow(
    clippy::default_trait_access,
    clippy::module_name_repetitions,
    clippy::wildcard_imports,
    clippy::too_many_lines,
    clippy::single_match_else,
    clippy::manual_let_else
)]

#[macro_use]
mod macros;
mod impls;

pub mod error;
pub mod gen;
pub mod operation;

pub mod openapi;
pub mod transform;
pub mod util;

#[cfg(feature = "axum")]
pub mod axum;

mod helpers;
#[cfg(feature = "redoc")]
pub mod redoc;

#[cfg(feature = "scalar")]
pub mod scalar;

pub use helpers::{
    no_api::NoApi, use_api::IntoApi, use_api::UseApi, with_api::ApiOverride, with_api::WithApi,
};

pub use error::Error;
pub use operation::{OperationInput, OperationOutput};

#[cfg(feature = "macros")]
pub use aide_macros::OperationIo;
