use crate::util::examples::Examples;
use proc_macro_error::abort;
use quote::ToTokens;
use std::fmt;
use syn::{parse::Parse, spanned::Spanned, Error, Expr, Ident, LitStr, Type};
use tamasfe_macro_utils::{
    attr::{AttrParam, AttrParams},
    path::is_option,
};

pub enum ParamLocation {
    Path(Ident),
    Query(Ident),
    Header(Ident),
    Cookie(Ident),
}

impl ParamLocation {
    pub fn is_path(&self) -> bool {
        matches!(self, ParamLocation::Path(_))
    }

    pub fn ident(&self) -> &Ident {
        match self {
            ParamLocation::Path(v) => v,
            ParamLocation::Query(v) => v,
            ParamLocation::Header(v) => v,
            ParamLocation::Cookie(v) => v,
        }
    }
}

impl Parse for ParamLocation {
    fn parse(input: syn::parse::ParseStream) -> syn::Result<Self> {
        let id = input.parse::<Ident>()?;

        if id == "path" {
            Ok(ParamLocation::Path(id))
        } else if id == "query" {
            Ok(ParamLocation::Query(id))
        } else if id == "header" {
            Ok(ParamLocation::Header(id))
        } else if id == "cookie" {
            Ok(ParamLocation::Cookie(id))
        } else {
            Err(Error::new(
                id.span(),
                r#"expected one of "path", "query", "header" or "cookie""#,
            ))
        }
    }
}

impl PartialEq for ParamLocation {
    fn eq(&self, other: &Self) -> bool {
        match self {
            ParamLocation::Path(_) => matches!(other, ParamLocation::Path(_)),
            ParamLocation::Query(_) => matches!(other, ParamLocation::Query(_)),
            ParamLocation::Header(_) => matches!(other, ParamLocation::Header(_)),
            ParamLocation::Cookie(_) => matches!(other, ParamLocation::Cookie(_)),
        }
    }
}

pub enum ParamName {
    Ident(Ident),
    LitStr(LitStr),
}

impl Parse for ParamName {
    fn parse(input: syn::parse::ParseStream) -> syn::Result<Self> {
        if input.peek(Ident) {
            Ok(Self::Ident(input.parse()?))
        } else {
            Ok(Self::LitStr(input.parse()?))
        }
    }
}

impl PartialEq for ParamName {
    fn eq(&self, other: &Self) -> bool {
        match self {
            ParamName::Ident(s) => match other {
                ParamName::Ident(o) => s == o,
                ParamName::LitStr(o) => s == &o.value(),
            },
            ParamName::LitStr(s) => match other {
                ParamName::Ident(o) => o == &s.value(),
                ParamName::LitStr(o) => o.value() == s.value(),
            },
        }
    }
}

impl ToTokens for ParamName {
    fn to_tokens(&self, tokens: &mut proc_macro2::TokenStream) {
        match self {
            ParamName::Ident(v) => v.to_tokens(tokens),
            ParamName::LitStr(v) => v.to_tokens(tokens),
        }
    }
}

impl fmt::Display for ParamName {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            ParamName::Ident(v) => v.fmt(f),
            ParamName::LitStr(v) => v.value().fmt(f),
        }
    }
}

pub struct Param {
    pub location: ParamLocation,
    pub name: ParamName,
    pub ty: Type,
    pub description: Option<Expr>,
    pub deprecated: Option<Expr>,
    pub examples: Examples,
    pub default_value: Option<Expr>,
}

impl Parse for Param {
    fn parse(input: syn::parse::ParseStream) -> syn::Result<Self> {
        let mut ty: Option<Type> = None;
        let mut examples = Examples::default();
        let mut description = None;
        let mut deprecated = None;
        let mut default_value = None;
        let mut location: Option<ParamLocation> = None;
        let mut param_name: Option<ParamName> = None;

        let params = input.parse::<AttrParams>()?;
        params.no_names_mixed();

        let sp = params.span();

        if params.has_named() {
            params.no_duplicates();
            params.retain_known(|p| {
                p == "type"
                    || p == "description"
                    || p == "desc"
                    || p == "deprecated"
                    || p == "default"
                    || p == "default_value"
                    || p == "example"
                    || p == "in"
                    || p == "location"
                    || p == "name"
            });

            for param in params.into_iter() {
                match param {
                    AttrParam::Named { name, value } => {
                        if name == "type" {
                            ty = Some(value.parse()?)
                        } else if name == "name" {
                            param_name = Some(value.parse()?);
                        } else if name == "deprecated" {
                            deprecated = Some(value.parse()?)
                        } else if name == "desc" || name == "description" {
                            description = Some(value.parse()?)
                        } else if name == "default" || name == "default_value" {
                            default_value = Some(value.parse()?)
                        } else if name == "example" {
                            examples.update(value.parse()?).map_err(|e| {
                                Error::new(
                                    e.span().join(name.span()).unwrap_or_else(|| e.span()),
                                    e.to_string(),
                                )
                            })?;
                        } else if name == "in" || name == "location" {
                            location = Some(value.parse()?);
                        }
                    }
                    AttrParam::Unnamed(_) => unreachable!(),
                }
            }
        } else if params.len() == 3 {
            for (i, attr) in params.into_iter().enumerate() {
                if i == 0 {
                    param_name = Some(attr.parse()?);
                } else if i == 1 {
                    location = Some(attr.parse()?);
                } else {
                    ty = Some(attr.parse()?);
                }
            }
        } else {
            return Err(Error::new(
                params.span(),
                format!(r#"expected 3 unnamed parameters, but got {}"#, params.len()),
            ));
        }

        if location.is_none() {
            abort!(sp, "parameter location must be known");
        }

        if param_name.is_none() {
            abort!(sp, "parameter name must be known");
        }

        if ty.is_none() {
            abort!(sp, "type must be known");
        }

        if let ParamLocation::Path(_) = location.as_ref().unwrap() {
            if is_option(ty.as_ref().unwrap()) {
                abort!(ty.span(), "path parameter cannot be optional");
            }
        }

        Ok(Param {
            examples,
            ty: ty.unwrap(),
            deprecated,
            default_value,
            description,
            location: location.unwrap(),
            name: param_name.unwrap(),
        })
    }
}
