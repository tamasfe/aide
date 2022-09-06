//! Type definitions taken from <https://github.com/glademiller/openapiv3/pull/58>
//!
//! Expect this module to change in the future, hopefully once
//! the referenced PR is merged into `openapiv3`.
// FIXME: remove the code below when the upstream openapiv3 3.1 is available.
#![allow(clippy::all, clippy::pedantic, missing_docs)]
mod callback;
mod components;
mod contact;
mod discriminator;
mod encoding;
mod example;
mod external_documentation;
mod header;
mod info;
mod license;
mod link;
mod media_type;
mod openapi;
mod operation;
mod parameter;
mod paths;
mod reference;
mod request_body;
mod responses;
mod schema;
mod security_requirement;
mod security_scheme;
mod server;
mod server_variable;
mod status_code;
mod tag;
mod variant_or;

pub use self::callback::*;
pub use self::components::*;
pub use self::contact::*;
pub use self::discriminator::*;
pub use self::encoding::*;
pub use self::example::*;
pub use self::external_documentation::*;
pub use self::header::*;
pub use self::info::*;
pub use self::license::*;
pub use self::link::*;
pub use self::media_type::*;
pub use self::openapi::*;
pub use self::operation::*;
pub use self::parameter::*;
pub use self::paths::*;
pub use self::reference::*;
pub use self::request_body::*;
pub use self::responses::*;
pub use self::schema::*;
pub use self::security_requirement::*;
pub use self::security_scheme::*;
pub use self::server::*;
pub use self::server_variable::*;
pub use self::status_code::*;
pub use self::tag::*;
pub use self::variant_or::*;
