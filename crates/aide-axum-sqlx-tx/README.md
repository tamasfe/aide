# aide-axum-sqlx-tx

A drop-in replacement for `axum-sqlx-tx` that provides an [aide](https://github.com/tamasfe/aide) compatible re-export.

It is not the original type, but it implements deref and deref-mut, so if you have issues and need the real `axum-sqlx-tx::Tx` type try using the deref operator:
`*tx` or `&*tx` or `&mut *tx`

## Features
 - `default` or `sqlx-07`: uses `axum-sqlx-tx:0.6.0` and is compatible with `sqlx:0.7`
 - `sqlx-06`: overrides default sqlx-07 and uses `axum-sqlx-tx:0.5.0` and is compatible with `sqlx:0.6`
 - all the `axum-sqlx-tx` features except `sqlite` due to build issues.

## Example

```rust
use aide_axum_sqlx_tx::Tx;
use sqlx::{Postgres, query};

async fn get_hello_world(
     mut tx: Tx<Postgres>,
 ) -> Result<String, String> {
    let (res,): (String,) = sqlx::query_as("select 'hello world'")
    .fetch_one(&mut *tx) // deref mut
    .await.map_err(|err|err.to_string())?;
    Ok(res)
 }
```