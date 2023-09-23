#![doc = include_str!("../README.md")]

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
