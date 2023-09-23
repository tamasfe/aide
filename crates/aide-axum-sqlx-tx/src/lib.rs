//! # Aide Axum Sqlx Tx
//!
//! Aide Axum Salx Tx is a re-export of the crate axum-sqlx-tx to be used in aide requests  
//!
//!
//! ## Features
//! - `default` or `sqlx-07`: uses `axum-sqlx-tx:0.6.0` and is compatible with `sqlx:0.7`
//! - `sqlx-06`: overrides default sqlx-07 and uses `axum-sqlx-tx:0.5.0` and is compatible with `sqlx:0.6`
//!
#![cfg_attr(
    all(feature = "sqlx-07", feature = "postgres"),
    doc = r##"
## Example

```
# use aide_axum_sqlx_tx::Tx;
# use sqlx::{Postgres, query};

async fn get_hello_world(
     mut tx: Tx<Postgres>,
 ) -> Result<String, String> {
    let (res,): (String,) = sqlx::query_as("select 'hello world'")
    .fetch_one(&mut *tx) // deref mut
    .await.map_err(|err|err.to_string())?;
    Ok(res)
 }
```
"##
)]

#[cfg(all(feature = "sqlx-07", feature = "sqlx-06"))]
compile_error!(
    "aide-axum-sqlx-tx features \"sqlx-07\" and \"sqlx-06\" cannot be enabled at the same time"
);

#[cfg(all(not(feature = "sqlx-07"), not(feature = "sqlx-06")))]
compile_error!("aide-axum-sqlx-tx feature \"sqlx-07\" or \"sqlx-06\" must be enabled");

use aide::NoApi;

#[cfg(feature = "sqlx-06")]
use sqlx_06 as tx;
#[cfg(all(feature = "sqlx-07", not(feature = "sqlx-06")))]
use sqlx_07 as tx;

#[cfg(any(feature = "sqlx-07", feature = "sqlx-06"))]
#[doc(inline)]
pub use tx::{Error, Layer, Service};

#[cfg(any(feature = "sqlx-07", feature = "sqlx-06"))]
pub type Tx<T> = NoApi<tx::Tx<T>>;
