use tamasfe_macro_utils::attr::{AttrParam, AttrParams};
use syn::{parse::Parse, spanned::Spanned, Error, Ident, LitStr, Type};

pub enum BindingKind {
    Path(Ident),
    Query(Ident),
    Body(Ident),
}

impl BindingKind {
    pub fn ident(&self) -> &Ident {
        match self {
            BindingKind::Path(v) => v,
            BindingKind::Query(v) => v,
            BindingKind::Body(v) => v,
        }
    }
}

pub struct Binding {
    pub kind: BindingKind,
    pub content_type: Option<LitStr>,
    pub ty: Type,
}

#[derive(Default)]
pub struct Bindings {
    pub query: Option<Binding>,
    pub path: Option<Binding>,
    pub body: Option<Binding>,
}

impl Bindings {
    #[allow(dead_code)]
    pub fn conflicts_with(&self, other: &Binding) -> bool {
        match &other.kind {
            BindingKind::Path(_) => self.path.is_some(),
            BindingKind::Query(_) => self.query.is_some(),
            BindingKind::Body(_) => self.body.is_some(),
        }
    }
}

impl Parse for Bindings {
    fn parse(input: syn::parse::ParseStream) -> syn::Result<Self> {
        let mut query: Option<Binding> = None;
        let mut path: Option<Binding> = None;
        let mut body: Option<Binding> = None;

        let params = input.parse::<AttrParams>()?;
        params.no_names_mixed();

        if params.has_named() {
            params.no_duplicates();
            params.retain_known(|p| p == "query" || p == "path" || p == "body");

            for param in params.into_iter() {
                match param {
                    AttrParam::Named { name, value } => {
                        if name == "query" {
                            query = Some(Binding {
                                kind: BindingKind::Query(name),
                                content_type: None,
                                ty: value.parse()?,
                            })
                        } else if name == "path" {
                            path = Some(Binding {
                                kind: BindingKind::Path(name),
                                content_type: None,
                                ty: value.parse()?,
                            })
                        } else if name == "body" {
                            body = Some(Binding {
                                content_type: Some(LitStr::new("application/json", name.span())),
                                kind: BindingKind::Body(name),
                                ty: value.parse()?,
                            })
                        } else {
                            unreachable!()
                        }
                    }
                    AttrParam::Unnamed(_) => unreachable!(),
                }
            }
        } else {
            return Err(Error::new(
                params.span(),
                "expected named parameters",
            ));
        }

        Ok(Bindings { query, path, body })
    }
}
