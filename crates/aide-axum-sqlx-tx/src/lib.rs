#![doc = include_str!("../README.md")]


#[cfg(all(not(feature = "axum-sqlx-tx-09"), not(feature = "axum-sqlx-tx-08"), not(feature = "axum-sqlx-tx-07"), not(feature = "axum-sqlx-tx-06")))]
compile_error!("aide-axum-sqlx-tx feature \"axum-sqlx-tx-09\", \"axum-sqlx-tx-08\", \"axum-sqlx-tx-07\", \"axum-sqlx-tx-06\" must be enabled");

use aide::NoApi;

#[cfg(all(feature = "axum-sqlx-tx-06", not(all(feature = "axum-sqlx-tx-09", feature = "axum-sqlx-tx-08", feature = "axum-sqlx-tx-07", feature = "axum-sqlx-tx-06"))))]
use axum_sqlx_tx_06 as tx;

#[cfg(all(feature = "axum-sqlx-tx-07", not(all(feature = "axum-sqlx-tx-09", feature = "axum-sqlx-tx-08", feature = "axum-sqlx-tx-07", feature = "axum-sqlx-tx-06"))))]
use axum_sqlx_tx_07 as tx;

#[cfg(all(feature = "axum-sqlx-tx-08", not(all(feature = "axum-sqlx-tx-09", feature = "axum-sqlx-tx-08", feature = "axum-sqlx-tx-07", feature = "axum-sqlx-tx-06"))))]
use axum_sqlx_tx_08 as tx;

#[cfg(all(feature = "axum-sqlx-tx-09", not(all(feature = "axum-sqlx-tx-09", feature = "axum-sqlx-tx-08", feature = "axum-sqlx-tx-07", feature = "axum-sqlx-tx-06"))))]
use axum_sqlx_tx_09 as tx;

// compile with `--all--features`
#[cfg(all(feature = "axum-sqlx-tx-09", feature = "axum-sqlx-tx-08", feature = "axum-sqlx-tx-07", feature = "axum-sqlx-tx-06"))]
use axum_sqlx_tx_09 as tx;

#[doc(inline)]
pub use tx::{Error, Layer, Service};
pub type Tx<T> = NoApi<tx::Tx<T>>;
