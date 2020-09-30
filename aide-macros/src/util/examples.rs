use proc_macro_error::{abort, emit_error};
use syn::{spanned::Spanned, Error, Expr, Ident};

use super::attr::{AttrParam, AttrParams};

#[derive(Debug)]
pub struct Example {
    pub value: Expr,
    pub summary: Option<Expr>,
    pub description: Option<Expr>,
}

#[derive(Debug, Default)]
pub struct Examples {
    pub default_example: Option<Expr>,
    pub named_examples: Vec<(Ident, Example)>,
}

impl Examples {
    pub fn update(&mut self, attr_params: AttrParams) -> syn::Result<()> {
        attr_params.no_names_mixed();

        let sp = attr_params.span();
        if attr_params.has_named() {
            attr_params.no_duplicates();
            attr_params.retain_known(|p| {
                p == "name" || p == "value" || p == "summary" || p == "description"
            });

            let mut ex_name: Option<Ident> = None;
            let mut ex_val: Option<Expr> = None;
            let mut ex_desc: Option<Expr> = None;
            let mut ex_summary: Option<Expr> = None;

            for example_param in attr_params.into_iter() {
                match example_param {
                    AttrParam::Named { name, value } => {
                        if name == "name" {
                            ex_name = Some(value.parse()?);
                        } else if name == "value" {
                            ex_val = Some(value.parse()?);
                        } else if name == "summary" {
                            ex_summary = Some(value.parse()?);
                        } else if name == "description" {
                            ex_desc = Some(value.parse()?);
                        }
                    }
                    AttrParam::Unnamed(_) => unreachable!(),
                }
            }

            match ex_name {
                Some(ex_name) => {
                    for (existing_name, _) in &self.named_examples {
                        if existing_name == &ex_name {
                            emit_error!(
                                existing_name.span(),
                                r#"example with name "{}" is already here"#,
                                existing_name
                            );
                            abort!(
                                ex_name.span(),
                                r#"example with name "{}" is already defined"#,
                                ex_name
                            );
                        }
                    }
                    self.named_examples.push((
                        ex_name,
                        Example {
                            value: ex_val.unwrap(),
                            summary: ex_summary,
                            description: ex_desc,
                        },
                    ));
                }
                None => {
                    if let Some(ex) = &self.default_example {
                        emit_error!(ex.span(), r#"a default example is already here"#);
                        abort!(sp, r#"a default example already exists"#);
                    }
                    self.default_example = ex_val;
                }
            }
        } else if attr_params.len() == 2 {
            let mut name: Option<Ident> = None;
            for (idx, p) in attr_params.into_iter().enumerate() {
                match idx {
                    0 => {
                        let n: Ident = p.parse()?;
                        for (ex_name, _) in &self.named_examples {
                            if ex_name == &n {
                                emit_error!(
                                    ex_name.span(),
                                    r#"example with name "{}" is already here"#,
                                    ex_name
                                );
                                abort!(n.span(), r#"example with name "{}" is already defined"#, n);
                            }
                        }
                        name = Some(n);
                    }
                    1 => {
                        self.named_examples.push((
                            name.unwrap(),
                            Example {
                                value: p.parse()?,
                                description: None,
                                summary: None,
                            },
                        ));
                        break;
                    }
                    _ => unreachable!(),
                }
            }
        } else if attr_params.len() == 1 {
            if let Some(ex) = &self.default_example {
                emit_error!(ex.span(), r#"a default example is already here"#);
                abort!(attr_params.span(), r#"a default example already exists"#);
            }
            self.default_example = Some(attr_params.into_iter().next().unwrap().parse()?);
        } else {
            return Err(Error::new(
                attr_params.span(),
                format!(
                    r#"expected 1 or 2 unnamed parameters, but got {}"#,
                    attr_params.len()
                ),
            ));
        }

        Ok(())
    }
}
