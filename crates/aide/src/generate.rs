//! Thread-local context for common settings for documentation generation.

use std::cell::RefCell;

use cfg_if::cfg_if;
use schemars::{generate::SchemaSettings, Schema, SchemaGenerator};
use serde_json::Value;

use crate::error::Error;

thread_local! {
    static GEN_CTX: RefCell<GenContext> = RefCell::new(GenContext::new());
}

/// Access the current thread-local context for
/// API documentation generation.
pub fn in_context<R, F>(cb: F) -> R
where
    F: FnOnce(&mut GenContext) -> R,
{
    GEN_CTX.with(|ctx| cb(&mut ctx.borrow_mut()))
}

/// Register an error handler in the current thread-local context.
///
/// Only one handler is allowed at a time, this
/// function will overwrite the existing one.
///
/// Due to the design of the library in some cases
/// errors can be false positives that cannot be
/// avoided.
///
/// It is advised **not to panic** in this handler
/// unless you are interested in the backtrace for
/// a specific error.
pub fn on_error(handler: impl Fn(Error) + 'static) {
    in_context(|ctx| ctx.error_handler = Some(Box::new(handler)));
}

/// Collect common schemas in the thread-local context,
/// then store them under `#/components/schemas` the next
/// time generated content is merged into [`OpenApi`].
/// This feature is enabled by default.
///
/// This will automatically clear the schemas stored
/// in the context when they are merged into the documentation.
///
/// [`OpenApi`]: crate::openapi::OpenApi
pub fn extract_schemas(extract: bool) {
    in_context(|ctx| {
        ctx.set_extract_schemas(extract);
    });
}

/// Set the inferred status code of empty responses (`()`).
///
/// Some frameworks might use `204` for empty responses, whereas
/// others will set `200`.
///
/// The default value depends on the framework feature.
pub fn inferred_empty_response_status(status: u16) {
    in_context(|ctx| {
        ctx.no_content_status = status;
    });
}

/// Infer responses based on request handler
/// return types.
///
/// This is enabled by default.
pub fn infer_responses(infer: bool) {
    in_context(|ctx| {
        ctx.infer_responses = infer;
    });
}

/// Output all theoretically possible error responses
/// including framework-specific ones.
///
/// This is disabled by default.
pub fn all_error_responses(infer: bool) {
    in_context(|ctx| {
        ctx.all_error_responses = infer;
    });
}

/// Reset the state of the thread-local context.
///
/// Currently clears:
///
/// - extracted schemas if [`extract_schemas`] was enabled
/// - disables inferred responses
///
/// This function is not required in most cases.
pub fn reset_context() {
    in_context(|ctx| *ctx = GenContext::new());
}

/// A context for API document generation
/// that provides settings and a [`SchemaGenerator`].
pub struct GenContext {
    /// Generator that should be used
    /// for generating operation input schemas.
    pub input_generator: SchemaGenerator,

    /// Generator that should be used
    /// for generating operation output schemas.
    pub output_generator: SchemaGenerator,

    pub(crate) infer_responses: bool,

    pub(crate) all_error_responses: bool,

    /// Extract schemas.
    pub(crate) extract_schemas: bool,

    /// Status code for no content.
    pub(crate) no_content_status: u16,

    /// The following filter is used internally
    /// to reduce the amount of false positives
    /// when possible.
    pub(crate) show_error: fn(&Error) -> bool,
    error_handler: Option<Box<dyn Fn(Error)>>,
}

impl GenContext {
    fn new() -> Self {
        cfg_if! {
            if #[cfg(feature = "axum")] {
                let no_content_status = 200;
            } else {
                let no_content_status = 204;
            }
        }

        let mut this = Self {
            input_generator: SchemaGenerator::new(SchemaSettings::draft07().for_deserialize()),
            output_generator: SchemaGenerator::new(SchemaSettings::draft07().for_serialize()),
            infer_responses: true,
            all_error_responses: false,
            extract_schemas: true,
            show_error: default_error_filter,
            error_handler: None,
            no_content_status,
        };
        this.set_extract_schemas(true);
        this
    }

    pub(crate) fn reset_error_filter(&mut self) {
        self.show_error = default_error_filter;
    }
    fn set_extract_schemas(&mut self, extract: bool) {
        if extract {
            self.input_generator = SchemaGenerator::new(
                SchemaSettings::draft07()
                    .with(|s| {
                        s.inline_subschemas = false;
                        s.definitions_path = "#/components/schemas/".into();
                    })
                    .for_deserialize(),
            );
            self.output_generator = SchemaGenerator::new(
                SchemaSettings::draft07()
                    .with(|s| {
                        s.inline_subschemas = false;
                        s.definitions_path = "#/components/schemas/".into();
                    })
                    .for_serialize(),
            );
            self.extract_schemas = true;
        } else {
            self.input_generator = SchemaGenerator::new(
                SchemaSettings::draft07()
                    .with(|s| {
                        s.inline_subschemas = true;
                    })
                    .for_deserialize(),
            );
            self.output_generator = SchemaGenerator::new(
                SchemaSettings::draft07()
                    .with(|s| {
                        s.inline_subschemas = true;
                    })
                    .for_serialize(),
            );
            self.extract_schemas = false;
        }
    }

    /// Add an error in the current context.
    #[tracing::instrument(skip_all)]
    pub fn error(&mut self, error: Error) {
        if let Some(handler) = &self.error_handler {
            if !(self.show_error)(&error) {
                return;
            }

            handler(error);
        }
    }

    /// Resolve a schema reference to a schema that
    /// was generated by the schema generator.
    ///
    /// If the given schema is not a schema reference,
    /// or the target is not found in this generator,
    /// the given schema is returned as-is.
    ///
    /// This function is required before interacting with generated schemas
    /// if [`extract_schemas`] is enabled, in which case most generated
    /// schema objects are references.
    #[must_use]
    pub fn resolve_input_schema<'s>(&'s self, schema_or_ref: &'s Schema) -> &'s Schema {
        match &schema_or_ref.as_object().and_then(|o| o.get("$ref")) {
            Some(Value::String(r)) => self
                .input_generator
                .definitions()
                .get(r.strip_prefix("#/components/schemas/").unwrap_or(r))
                .and_then(|s| Into::<serde_json::Result<&Schema>>::into(s.try_into()).ok())
                .unwrap_or(schema_or_ref),
            _ => schema_or_ref,
        }
    }

    /// Resolve a schema reference to a schema that
    #[must_use]
    pub fn resolve_output_schema<'s>(&'s self, schema_or_ref: &'s Schema) -> &'s Schema {
        match &schema_or_ref.as_object().and_then(|o| o.get("$ref")) {
            Some(Value::String(r)) => self
                .output_generator
                .definitions()
                .get(r.strip_prefix("#/components/schemas/").unwrap_or(r))
                .and_then(|s| Into::<serde_json::Result<&Schema>>::into(s.try_into()).ok())
                .unwrap_or(schema_or_ref),
            _ => schema_or_ref,
        }
    }
}

fn default_error_filter(_: &Error) -> bool {
    true
}
