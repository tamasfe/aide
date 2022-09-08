//! Crate-wide error types.

use crate::openapi::StatusCode;
use thiserror::Error;

/// Errors during documentation generation.
///
/// ## False Positives
///
/// In some cases there is not enough contextual
/// information to determine whether an error is indeed
/// an error, in these cases the error is reported anyway
/// just to be sure.
#[allow(missing_docs)]
#[derive(Debug, Error)]
#[non_exhaustive]
pub enum Error {
    #[error(r#"parameter "{0}" does not exist for the operation"#)]
    ParameterNotExists(String),
    #[error("the default response already exists for the operation")]
    DefaultResponseExists,
    #[error(r#"the response for status "{0}" already exists for the operation"#)]
    ResponseExists(StatusCode),
    #[error(r#"the operation "{1}" already exists for the path "{0}""#)]
    OperationExists(String, &'static str),
    #[error(r#"duplicate request body for the operation"#)]
    DuplicateRequestBody,
    #[error(r#"duplicate parameter "{0}" for the operation"#)]
    DuplicateParameter(String),
    #[error(r#"transformations do not support references"#)]
    UnexpectedReference,
    #[error("did not apply inferred response because a response for status {0} already exists")]
    InferredResponseConflict(u16),
    #[error("did not apply inferred default response because a default response already exists")]
    InferredDefaultResponseConflict,
    #[error("{0}")]
    Other(Box<dyn std::error::Error + Send>),
}
