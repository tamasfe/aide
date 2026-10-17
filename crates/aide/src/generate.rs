//! Thread-local context for common settings for documentation generation.

use std::{cell::RefCell, collections::BTreeSet};

use cfg_if::cfg_if;
use schemars::{generate::SchemaSettings, Schema, SchemaGenerator};
use serde_json::{Map, Value};

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

/// Automatically strip null types from query parameter schemas.
///
/// Query strings cannot express null values - a parameter is either
/// present with a value or absent. When enabled, null types are
/// automatically removed from query parameter schemas during finalization.
///
/// This is enabled by default.
pub fn strip_query_null_types(strip: bool) {
    in_context(|ctx| {
        ctx.strip_query_null_types = strip;
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
    /// Schema generator for data the API **receives**: request bodies,
    /// query, path and header parameters.
    ///
    /// It uses the schemars [`Deserialize`](schemars::generate::Contract::Deserialize)
    /// contract, describing every value serde would accept.
    pub schema: SchemaGenerator,

    /// Schema generator for data the API **sends**: response bodies.
    ///
    /// It uses the schemars [`Serialize`](schemars::generate::Contract::Serialize)
    /// contract, describing exactly what serde produces. For example an
    /// `Option<T>` field without `skip_serializing_if` is always present in
    /// the output, so it is `required` here while it is optional for inputs.
    ///
    /// Types whose schema is the same under both contracts share one
    /// component. Types whose schemas differ are emitted as two components,
    /// `{Name}-Input` and `{Name}-Output`.
    pub output_schema: SchemaGenerator,

    pub(crate) infer_responses: bool,

    pub(crate) all_error_responses: bool,

    /// Extract schemas.
    pub(crate) extract_schemas: bool,

    /// Strip null types from query parameter schemas.
    pub(crate) strip_query_null_types: bool,

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
            schema: SchemaGenerator::new(SchemaSettings::draft07().for_deserialize()),
            output_schema: SchemaGenerator::new(SchemaSettings::draft07().for_serialize()),
            infer_responses: true,
            all_error_responses: false,
            extract_schemas: true,
            strip_query_null_types: true,
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
            self.schema =
                SchemaGenerator::new(SchemaSettings::draft07().for_deserialize().with(|s| {
                    s.inline_subschemas = false;
                    s.definitions_path = COMPONENTS_SCHEMAS_PATH.into();
                }));
            self.output_schema =
                SchemaGenerator::new(SchemaSettings::draft07().for_serialize().with(|s| {
                    s.inline_subschemas = false;
                    s.definitions_path = OUTPUT_DEFINITIONS_PATH.into();
                }));
            self.extract_schemas = true;
        } else {
            self.schema =
                SchemaGenerator::new(SchemaSettings::draft07().for_deserialize().with(|s| {
                    s.inline_subschemas = true;
                }));
            self.output_schema =
                SchemaGenerator::new(SchemaSettings::draft07().for_serialize().with(|s| {
                    s.inline_subschemas = true;
                }));
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
    pub fn resolve_schema<'s>(&'s self, schema_or_ref: &'s Schema) -> &'s Schema {
        resolve_in(&self.schema, COMPONENTS_SCHEMAS_PATH, schema_or_ref)
    }

    /// Like [`resolve_schema`](Self::resolve_schema), for a schema
    /// generated by [`output_schema`](Self::output_schema).
    #[must_use]
    pub fn resolve_output_schema<'s>(&'s self, schema_or_ref: &'s Schema) -> &'s Schema {
        resolve_in(&self.output_schema, OUTPUT_DEFINITIONS_PATH, schema_or_ref)
    }

    /// Resolve a schema reference and apply the schema generator's
    /// transforms to the result.
    ///
    /// Unlike [`resolve_schema`](Self::resolve_schema) this returns an owned
    /// schema, because the transforms mutate it.
    ///
    /// Use this instead of [`resolve_schema`](Self::resolve_schema) whenever
    /// the resolved schema is embedded into the documentation directly rather
    /// than as a reference. `schemars` only applies the transforms configured
    /// in its settings when generating root schemas or when taking the
    /// definitions out of the generator, so schemas that `aide` inlines would
    /// otherwise ignore those settings entirely.
    #[must_use]
    pub fn resolve_schema_transformed(&mut self, schema_or_ref: &Schema) -> Schema {
        let mut schema = self.resolve_schema(schema_or_ref).clone();
        self.apply_transforms(&mut schema);
        schema
    }

    /// Apply the schema generator's transforms to a generated schema in place.
    ///
    /// Schema references are left untouched, as the definitions they point at
    /// are transformed when they are merged into the documentation.
    pub fn apply_transforms(&mut self, schema: &mut Schema) {
        if schema.as_object().is_some_and(|o| o.contains_key("$ref")) {
            return;
        }

        for transform in self.schema.transforms_mut() {
            transform.transform(schema);
        }
    }

    /// Like [`apply_transforms`](Self::apply_transforms), with the
    /// transforms of [`output_schema`](Self::output_schema).
    pub fn apply_output_transforms(&mut self, schema: &mut Schema) {
        if schema.as_object().is_some_and(|o| o.contains_key("$ref")) {
            return;
        }

        for transform in self.output_schema.transforms_mut() {
            transform.transform(schema);
        }
    }

    /// Take the definitions out of both generators and merge them into one
    /// set of component schemas.
    ///
    /// Returns the components and the [`RefRenames`] that must be applied to
    /// every `$ref` in the rest of the document: output schemas are generated
    /// under a private definitions path, and split components are renamed.
    pub(crate) fn take_merged_definitions(&mut self) -> (Vec<(String, Value)>, RefRenames) {
        let input: Map<String, Value> = self.schema.take_definitions(true).into_iter().collect();
        let output: Map<String, Value> = self
            .output_schema
            .take_definitions(true)
            .into_iter()
            .map(|(name, mut schema)| {
                rewrite_refs(&mut schema, &|r| {
                    r.strip_prefix(OUTPUT_DEFINITIONS_PATH)
                        .map(|name| format!("{COMPONENTS_SCHEMAS_PATH}{name}"))
                });
                (name, schema)
            })
            .collect();

        // A name is split when its two schemas differ, or when it refers to a
        // split name (the same `$ref` text would then mean a different schema
        // in each contract). Iterate to a fixed point.
        let shared: Vec<&String> = input.keys().filter(|n| output.contains_key(*n)).collect();
        let mut split: BTreeSet<String> = shared
            .iter()
            .filter(|n| input[n.as_str()] != output[n.as_str()])
            .map(|n| (*n).clone())
            .collect();
        loop {
            let before = split.len();
            for name in &shared {
                if !split.contains(name.as_str())
                    && (refers_to_any(&input[name.as_str()], &split)
                        || refers_to_any(&output[name.as_str()], &split))
                {
                    split.insert((*name).clone());
                }
            }
            if split.len() == before {
                break;
            }
        }

        let renames = RefRenames { split };
        let mut merged: Vec<(String, Value)> = Vec::new();
        for (name, mut schema) in input {
            rewrite_refs(&mut schema, &|r| renames.input(r));
            merged.push((renames.input_name(&name), schema));
        }
        for (name, mut schema) in output {
            let new_name = renames.output_name(&name);
            // A shared, unsplit name is already present from the input side
            // with an identical schema.
            if renames.split.contains(&name) || !merged.iter().any(|(n, _)| *n == name) {
                rewrite_refs(&mut schema, &|r| renames.output_normalised(r));
                merged.push((new_name, schema));
            }
        }

        let mut seen = BTreeSet::new();
        for (name, _) in &merged {
            assert!(
                seen.insert(name.as_str()),
                "aide: component schema name `{name}` is generated twice; \
                 a type's schema name collides with an `-Input`/`-Output` split name"
            );
        }

        (merged, renames)
    }
}

/// `$ref` prefix of OpenAPI component schemas.
pub(crate) const COMPONENTS_SCHEMAS_PATH: &str = "#/components/schemas/";

/// Private `$ref` prefix of schemas generated by
/// [`GenContext::output_schema`]. It is rewritten to
/// [`COMPONENTS_SCHEMAS_PATH`] when the document is finished.
pub(crate) const OUTPUT_DEFINITIONS_PATH: &str = "#/components/x-aide-output-schemas/";

/// How references are renamed when input and output definitions are merged.
pub(crate) struct RefRenames {
    split: BTreeSet<String>,
}

impl RefRenames {
    fn input_name(&self, name: &str) -> String {
        if self.split.contains(name) {
            format!("{name}-Input")
        } else {
            name.to_owned()
        }
    }

    fn output_name(&self, name: &str) -> String {
        if self.split.contains(name) {
            format!("{name}-Output")
        } else {
            name.to_owned()
        }
    }

    fn input(&self, r: &str) -> Option<String> {
        let name = r.strip_prefix(COMPONENTS_SCHEMAS_PATH)?;
        self.split
            .contains(name)
            .then(|| format!("{COMPONENTS_SCHEMAS_PATH}{}", self.input_name(name)))
    }

    fn output_normalised(&self, r: &str) -> Option<String> {
        let name = r.strip_prefix(COMPONENTS_SCHEMAS_PATH)?;
        self.split
            .contains(name)
            .then(|| format!("{COMPONENTS_SCHEMAS_PATH}{}", self.output_name(name)))
    }

    /// Rewrite every `$ref` in a part of the document outside the merged
    /// components (paths, webhooks, other components).
    ///
    /// # Panics
    ///
    /// If the part does not round-trip through `serde_json`.
    pub(crate) fn apply<T: serde::Serialize + serde::de::DeserializeOwned>(&self, part: &mut T) {
        let mut value = serde_json::to_value(&*part).expect("OpenAPI part serialises");
        rewrite_refs(&mut value, &|r| self.rewrite(r));
        *part = serde_json::from_value(value).expect("OpenAPI part round-trips");
    }

    fn rewrite(&self, r: &str) -> Option<String> {
        if let Some(name) = r.strip_prefix(OUTPUT_DEFINITIONS_PATH) {
            return Some(format!(
                "{COMPONENTS_SCHEMAS_PATH}{}",
                self.output_name(name)
            ));
        }
        self.input(r)
    }
}

/// Rewrite every `$ref` string in `value` for which `f` returns a new value.
fn rewrite_refs(value: &mut Value, f: &dyn Fn(&str) -> Option<String>) {
    match value {
        Value::Object(map) => {
            for (key, v) in map.iter_mut() {
                if key == "$ref" {
                    if let Value::String(r) = v {
                        if let Some(new) = f(r) {
                            *r = new;
                        }
                    }
                } else {
                    rewrite_refs(v, f);
                }
            }
        }
        Value::Array(items) => {
            for v in items {
                rewrite_refs(v, f);
            }
        }
        _ => {}
    }
}

fn refers_to_any(value: &Value, names: &BTreeSet<String>) -> bool {
    match value {
        Value::Object(map) => map.iter().any(|(key, v)| match (key.as_str(), v) {
            ("$ref", Value::String(r)) => r
                .strip_prefix(COMPONENTS_SCHEMAS_PATH)
                .is_some_and(|n| names.contains(n)),
            _ => refers_to_any(v, names),
        }),
        Value::Array(items) => items.iter().any(|v| refers_to_any(v, names)),
        _ => false,
    }
}

fn resolve_in<'s>(
    generator: &'s SchemaGenerator,
    prefix: &str,
    schema_or_ref: &'s Schema,
) -> &'s Schema {
    match &schema_or_ref.as_object().and_then(|o| o.get("$ref")) {
        Some(Value::String(r)) => generator
            .definitions()
            .get(r.strip_prefix(prefix).unwrap_or(r))
            .and_then(|s| Into::<serde_json::Result<&Schema>>::into(s.try_into()).ok())
            .unwrap_or(schema_or_ref),
        _ => schema_or_ref,
    }
}

fn default_error_filter(_: &Error) -> bool {
    true
}
