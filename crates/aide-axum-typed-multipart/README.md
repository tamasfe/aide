# aide-axum-typed-multipart

Wrapper around [`axum_typed_multipart`](https://docs.rs/axum_typed_multipart/0.11.0/axum_typed_multipart/)
to generate documentation for multipart requests.

## Example

```rust
use aide_axum_typed_multipart::{FieldData, TypedMultipart};
use axum::{body::Bytes, http::StatusCode};
use axum_typed_multipart::TryFromMultipart;
use schemars::JsonSchema;

#[derive(TryFromMultipart, JsonSchema)]
struct MyMultipart {
    title: String,
    description: String,
    #[form_data(limit = "unlimited")]
    image: FieldData<Bytes>,
}

async fn post_hello_world(TypedMultipart<MyMultipart>) -> StatusCode {
    // do something
    return StatusCode::OK;
}
```
