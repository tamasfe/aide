#[cfg(any(feature = "openapi-v3"))]
pub mod openapi;

/// Not part of the public API for end-users, however
/// it contains reexports that can be relied on.
pub mod internal {
    pub use linkme;
    pub use serde;
    pub use serde_json;
}
