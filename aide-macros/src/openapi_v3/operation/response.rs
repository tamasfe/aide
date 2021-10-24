use crate::util::examples::Examples;
use proc_macro_error::abort;
use quote::ToTokens;
use syn::{
    parse::{Parse, ParseStream},
    spanned::Spanned,
    Error, Expr, LitInt, Type,
};
use tamasfe_macro_utils::attr::{AttrParam, AttrParams};

pub struct Response {
    pub status_code: Option<StatusCode>,
    pub ty: Option<Type>,
    pub content_type: Option<Expr>,
    pub description: Option<Expr>,
    pub examples: Examples,
}

impl Parse for Response {
    fn parse(input: syn::parse::ParseStream) -> syn::Result<Self> {
        let mut status_code: Option<StatusCode> = None;
        let mut ty: Option<Type> = None;
        let mut content_type: Option<Expr> = None;
        let mut examples = Examples::default();
        let mut description = None;

        let params = input.parse::<AttrParams>()?;
        params.no_names_mixed();

        let sp = params.span();

        if params.has_named() {
            params.no_duplicates();
            params.retain_known(|p| {
                p == "type"
                    || p == "status"
                    || p == "content"
                    || p == "content_type"
                    || p == "description"
                    || p == "desc"
                    || p == "example"
            });

            for param in params.into_iter() {
                match param {
                    AttrParam::Named { name, value } => {
                        if name == "type" {
                            ty = Some(value.parse()?)
                        } else if name == "content" || name == "content_type" {
                            content_type = Some(value.parse()?)
                        } else if name == "desc" || name == "description" {
                            description = Some(value.parse()?)
                        } else if name == "example" || name == "examples" {
                            examples.update(value.parse()?).map_err(|e| {
                                Error::new(
                                    e.span().join(name.span()).unwrap_or_else(|| e.span()),
                                    e.to_string(),
                                )
                            })?;
                        } else {
                            status_code = Some(value.parse()?)
                        }
                    }
                    AttrParam::Unnamed(_) => unreachable!(),
                }
            }
        } else if params.len() == 2 {
            for (i, attr) in params.into_iter().enumerate() {
                if i == 0 {
                    status_code = Some(StatusCode::LitInt(attr.parse()?));
                } else {
                    ty = Some(attr.parse()?);
                }
            }
        } else if params.len() == 1 {
            status_code = Some(params.into_iter().next().unwrap().parse()?);
        } else {
            return Err(Error::new(
                params.span(),
                format!(
                    r#"expected 1 or 2 unnamed parameters, but got {}"#,
                    params.len()
                ),
            ));
        }

        if status_code.is_none() {
            abort!(sp, "status code must be known");
        }

        Ok(Response {
            status_code,
            ty,
            content_type,
            description,
            examples,
        })
    }
}

/// Mostly the same as Response, but parsed differently.
pub struct DefaultResponse(pub Response);

impl Parse for DefaultResponse {
    fn parse(input: syn::parse::ParseStream) -> syn::Result<Self> {
        let mut ty: Option<Type> = None;
        let mut content_type: Option<Expr> = None;
        let mut examples = Examples::default();
        let mut description = None;

        let params = input.parse::<AttrParams>()?;
        params.no_names_mixed();

        if params.has_named() {
            params.no_duplicates();
            params.retain_known(|p| {
                p == "type"
                    || p == "content"
                    || p == "content_type"
                    || p == "description"
                    || p == "desc"
                    || p == "default"
                    || p == "default_value"
                    || p == "example"
                    || p == "examples"
            });

            for param in params.into_iter() {
                match param {
                    AttrParam::Named { name, value } => {
                        if name == "type" {
                            ty = Some(value.parse()?)
                        } else if name == "content" || name == "content_type" {
                            content_type = Some(value.parse()?)
                        } else if name == "desc" || name == "description" {
                            description = Some(value.parse()?)
                        } else if name == "example" || name == "examples" {
                            examples.update(value.parse()?).map_err(|e| {
                                Error::new(
                                    e.span().join(name.span()).unwrap_or_else(||e.span()),
                                    e.to_string(),
                                )
                            })?;
                        }
                    }
                    AttrParam::Unnamed(_) => unreachable!(),
                }
            }
        } else if params.len() == 1 {
            ty = Some(params.into_iter().next().unwrap().parse()?);
        } else {
            abort!(
                params.span(),
                r#"expected exactly 1 unnamed parameter, but got {}"#,
                params.len()
            );
        }

        Ok(DefaultResponse(Response {
            status_code: None,
            ty,
            content_type,
            description,
            examples,
        }))
    }
}

pub enum StatusCode {
    Expr(Expr),
    LitInt(LitInt),
}

impl Parse for StatusCode {
    fn parse(input: ParseStream) -> syn::Result<Self> {
        if input.peek(LitInt) {
            Ok(StatusCode::LitInt(input.parse()?))
        } else {
            Ok(StatusCode::Expr(input.parse()?))
        }
    }
}

impl ToTokens for StatusCode {
    fn to_tokens(&self, tokens: &mut proc_macro2::TokenStream) {
        match self {
            StatusCode::Expr(v) => v.to_tokens(tokens),
            StatusCode::LitInt(v) => v.to_tokens(tokens),
        }
    }
}
