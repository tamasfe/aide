use super::{
    definition::{
        Components, MediaType, OpenApi, Operation, Parameter, ParameterLocation, ParameterValue,
        PathItem, RefOr, RequestBody,
    },
    transform::remove_parameter_nullable,
};
use core::fmt;
use item::BindingKind;
use linkme::distributed_slice;
use schemars::{
    gen::{SchemaGenerator, SchemaSettings},
    schema::Schema,
    JsonSchema, Map,
};
use std::cell::RefCell;

pub mod item;

pub type ItemFn = fn(&Options) -> Result<item::Item, Error>;

#[distributed_slice]
pub static ITEMS: [ItemFn] = [..];

pub type PluginFn = fn(&mut OpenApi, items: &[ItemFn], &Options) -> Result<(), Error>;

#[distributed_slice]
pub static PLUGIN: [PluginFn] = [..];

pub struct Options {
    pub id: String,
    schema_gen: RefCell<SchemaGenerator>,
}

impl Options {
    pub fn generate_schema<T: JsonSchema>(&self) -> Schema {
        T::json_schema(&mut *self.schema_gen.borrow_mut())
    }

    pub fn into_schema_generator(self) -> SchemaGenerator {
        self.schema_gen.into_inner()
    }
}

impl Default for Options {
    fn default() -> Self {
        Options {
            id: "".into(),
            schema_gen: RefCell::new(SchemaGenerator::new(SchemaSettings::openapi3())),
        }
    }
}

pub fn generate<'a, V: Into<Option<&'a str>>>(id: V) -> Result<OpenApi, Error> {
    let mut opts = Options::default();

    if let Some(v) = id.into() {
        opts.id = v.into()
    }

    generate_with_options(opts)
}

pub fn generate_with_options(options: Options) -> Result<OpenApi, Error> {
    let mut spec = OpenApi {
        openapi: "3.1.0".into(),
        ..OpenApi::default()
    };

    for item_fn in ITEMS {
        let item: item::Item = match item_fn(&options) {
            Ok(i) => i,
            Err(e) => match &e.kind {
                ErrorKind::IdExpected(_) => continue,
                _ => return Err(e),
            },
        };

        if let Some(v) = item.content.downcast_ref::<item::ItemOperation>() {
            let item_op: &item::ItemOperation = v;
            let mut p = spec.paths.get_mut(item_op.route.path);
            if p.is_none() {
                spec.paths
                    .insert(item_op.route.path.into(), PathItem::default());

                p = spec.paths.get_mut(item_op.route.path);
            }
            let path_item = p.unwrap();

            for (method, op) in path_item.operations_mut() {
                if method != item_op.route.method {
                    continue;
                }

                if op.is_none() {
                    *op = Some(Operation::default());
                } else {
                    return Err(Error {
                        position: Some(item.position),
                        kind: ErrorKind::DuplicateOperation {
                            path: item_op.route.path.into(),
                            operation_id: item_op.operation_id.into(),
                        },
                    });
                }

                let mut o = op.take().unwrap();

                o.operation_id = Some(item_op.operation_id.into());
                o.summary = Some(item_op.summary.into());
                o.description = item_op.description.map(|d| d.to_string());
                o.tags = item_op.tags.iter().map(|t| t.to_string()).collect();

                *op = Some(o);
                break;
            }
        }

        if let Some(v) = item.content.downcast_ref::<item::ItemParameter>() {
            let param: &item::ItemParameter = v;
            let mut p = spec.paths.get_mut(param.route.path);
            if p.is_none() {
                spec.paths
                    .insert(param.route.path.into(), PathItem::default());

                p = spec.paths.get_mut(param.route.path);
            }
            let path_item = p.unwrap();

            for (method, op) in path_item.operations_mut() {
                if method != param.route.method {
                    continue;
                }

                if op.is_none() {
                    *op = Some(Operation::default());
                }

                let mut o = op.take().unwrap();

                for p in &o.parameters {
                    if let RefOr::Object(p) = p {
                        if p.name == param.name {
                            return Err(Error {
                                position: Some(item.position),
                                kind: ErrorKind::DuplicateParameter {
                                    name: param.name.into(),
                                    path: param.route.path.into(),
                                },
                            });
                        }
                    }
                }

                o.parameters.push(RefOr::Object(param.clone().into()));

                *op = Some(o);
                break;
            }
        }

        if let Some(v) = item.content.downcast_ref::<item::ItemTag>() {
            let item_tag: &item::ItemTag = v;
            if spec.tags.iter().any(|t| t.name == item_tag.name) {
                return Err(Error {
                    position: Some(item.position),
                    kind: ErrorKind::DuplicateTag {
                        name: item_tag.name.into(),
                    },
                });
            }

            spec.tags.push(item_tag.clone().into());
        }

        if let Some(v) = item.content.downcast_ref::<item::ItemModel>() {
            let item_model: &item::ItemModel = v;

            let mut components = match spec.components {
                Some(c) => c,
                None => Components::default(),
            };

            let schema_obj = item_model.schema.clone().into_object();

            components
                .schemas
                .insert(item_model.name.to_string(), schema_obj);

            spec.components = Some(components);
        }

        if let Some(v) = item.content.downcast_ref::<item::ItemBinding>() {
            let binding: &item::ItemBinding = v;
            let mut p = spec.paths.get_mut(binding.route.path);
            if p.is_none() {
                spec.paths
                    .insert(binding.route.path.into(), PathItem::default());

                p = spec.paths.get_mut(binding.route.path);
            }
            let path_item = p.unwrap();

            for (method, op) in path_item.operations_mut() {
                if method != binding.route.method {
                    continue;
                }

                if op.is_none() {
                    *op = Some(Operation::default());
                }

                let mut o = op.take().unwrap();

                // TODO: checks

                match binding.kind {
                    BindingKind::Query | BindingKind::Path => {
                        let schema_obj = binding.schema.clone().into_object();

                        if let Some(obj) = schema_obj.object {
                            for (name, schema) in &obj.properties {
                                for p in &o.parameters {
                                    if let RefOr::Object(p) = p {
                                        if p.name == name.as_str() {
                                            return Err(Error {
                                                position: Some(item.position),
                                                kind: ErrorKind::DuplicateParameter {
                                                    name: p.name.clone(),
                                                    path: binding.route.path.into(),
                                                },
                                            });
                                        }
                                    }
                                }

                                let s = schema.clone().into_object();

                                o.parameters.push(RefOr::Object(Parameter {
                                    name: name.clone(),
                                    location: match binding.kind {
                                        BindingKind::Query => ParameterLocation::Query,
                                        BindingKind::Path => ParameterLocation::Path,
                                        BindingKind::Body => unreachable!(),
                                    },
                                    description: s
                                        .metadata
                                        .as_ref()
                                        .and_then(|m| m.description.clone()),
                                    required: obj.required.contains(name),
                                    deprecated: false,
                                    allow_empty_value: false,
                                    allow_reserved: false,
                                    value: ParameterValue::Schema {
                                        style: None,
                                        explode: None,
                                        allow_reserved: false,
                                        schema: s,
                                        example: None,
                                        examples: None,
                                    },
                                    extensions: Default::default(),
                                }));
                            }
                        }
                    }
                    BindingKind::Body => {
                        o.request_body = Some(RefOr::Object(RequestBody {
                            content: {
                                let mut m = Map::new();
                                m.insert(
                                    binding
                                        .content_type
                                        .map(|s| s.to_string())
                                        .unwrap_or_else(|| "application/json".into()),
                                    MediaType {
                                        schema: Some(binding.schema.clone().into_object()),
                                        ..Default::default()
                                    },
                                );
                                m
                            },
                            required: true,
                            ..Default::default()
                        }))
                    }
                }

                *op = Some(o);
                break;
            }
        }

        if let Some(v) = item.content.downcast_ref::<item::ItemResponse>() {
            let res: &item::ItemResponse = v;
            let mut p = spec.paths.get_mut(res.route.path);
            if p.is_none() {
                spec.paths
                    .insert(res.route.path.into(), PathItem::default());

                p = spec.paths.get_mut(res.route.path);
            }
            let path_item = p.unwrap();

            for (method, op) in path_item.operations_mut() {
                if method != res.route.method {
                    continue;
                }

                if op.is_none() {
                    *op = Some(Operation::default());
                }

                let mut o = op.take().unwrap();

                match res.status {
                    Some(status) => {
                        if o.responses
                            .responses
                            .insert(status.to_string(), RefOr::Object(res.clone().into()))
                            .is_some()
                        {
                            return Err(Error {
                                position: Some(item.position),
                                kind: ErrorKind::DuplicateResponse {
                                    status: status.to_string(),
                                    path: res.route.path.into(),
                                },
                            });
                        }
                    }
                    None => {
                        if o.responses.default.is_some() {
                            return Err(Error {
                                position: Some(item.position),
                                kind: ErrorKind::DuplicateResponse {
                                    status: "default".into(),
                                    path: res.route.path.into(),
                                },
                            });
                        }
                        o.responses.default = Some(RefOr::Object(res.clone().into()));
                    }
                };

                *op = Some(o);
                break;
            }
        }
    }

    for plugin in PLUGIN {
        if let Err(e) = plugin(&mut spec, &ITEMS, &options) {
            return Err(e);
        }
    }

    let mut components = match spec.components {
        Some(c) => c,
        None => Components::default(),
    };

    components.schemas.extend(
        options
            .schema_gen
            .into_inner()
            .take_definitions()
            .into_iter()
            .map(|(name, schema)| (name, schema.into_object())),
    );

    spec.components = Some(components);

    Ok(spec.transform(remove_parameter_nullable))
}

#[derive(Debug)]
pub struct Error {
    pub position: Option<item::Position>,
    pub kind: ErrorKind,
}

impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        if let Some(pos) = &self.position {
            write!(f, "error for item at {}: ", pos)?
        }

        self.kind.fmt(f)
    }
}

impl std::error::Error for Error {}

#[derive(Debug)]
pub enum ErrorKind {
    /// Should be returned where items expect
    /// a different id. It only exists in order to
    /// enumerate items even if we don't know the id they're valid for.
    IdExpected(&'static str),
    DuplicateParameter {
        path: String,
        name: String,
    },
    DuplicateOperation {
        path: String,
        operation_id: String,
    },
    DuplicateResponse {
        path: String,
        status: String,
    },
    DuplicateTag {
        name: String,
    },
    SerdeJson(serde_json::Error),
    Other(Box<dyn std::error::Error + Send + Sync + 'static>),
}

impl fmt::Display for ErrorKind {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            ErrorKind::IdExpected(id) => write!(f, r#"item is for id "{}""#, id),
            ErrorKind::DuplicateParameter { name, path } => {
                write!(f, r#"duplicate parameter "{}" for path "{}""#, name, path)
            }
            ErrorKind::DuplicateResponse { status, path } => {
                write!(f, r#"duplicate response "{}" for path "{}""#, status, path)
            }
            ErrorKind::DuplicateOperation { operation_id, path } => write!(
                f,
                r#"duplicate operation "{}" for path "{}""#,
                operation_id, path
            ),
            ErrorKind::Other(e) => e.fmt(f),
            ErrorKind::SerdeJson(e) => e.fmt(f),
            ErrorKind::DuplicateTag { name } => write!(f, "duplicate tag {}", name),
        }
    }
}

impl From<serde_json::Error> for ErrorKind {
    fn from(e: serde_json::Error) -> Self {
        ErrorKind::SerdeJson(e)
    }
}
