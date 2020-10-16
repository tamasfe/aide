use proc_macro2::Span;
use quote::{quote,ToTokens};
use syn::{Expr, Ident, LitStr, parse::Parse, parse::ParseStream};
use tamasfe_macro_utils::attr::{AttrParam, AttrParams};

#[derive(Debug, Clone)]
pub struct Tag {
    pub id: Option<LitStr>,
    pub name: Expr,
    pub description: Option<Expr>,
    pub display_name: Option<Expr>,
    pub external_docs: Option<ExternalDocs>,
}

impl Parse for Tag {
    fn parse(input: ParseStream) -> syn::Result<Self> {
        let mut name: Option<Expr> = None;
        let mut description: Option<Expr> = None;
        let mut display_name: Option<Expr> = None;
        let mut external_docs: Option<ExternalDocs> = None;
        let mut id: Option<LitStr> = None;

        let params: AttrParams = input.parse()?;

        if params.is_empty() {
            return Err(input.error("expected parameters"));
        }

        params.no_duplicates();
        params.no_unnamed();
        params.retain_known(|i| {
            i == "name" || i == "desc" || i == "description" || i == "external_docs" || i == "id" || i == "display_name"
        });

        for param in params {
            match param {
                AttrParam::Named { name: ident, value } => {
                    if ident == "name" {
                        name = Some(value.parse()?);
                    } else if ident == "desc" || ident == "description" {
                        description = Some(value.parse()?);
                    } else if ident == "display_name" {
                        display_name = Some(value.parse()?);
                    } else if ident == "external_docs" {
                        external_docs = Some(value.parse()?);
                    } else if ident == "id" {
                        id = Some(value.parse()?);
                    } else {
                        unreachable!()
                    }
                }
                AttrParam::Unnamed(_) => unreachable!(),
            }
        }

        Ok(Self {
            id,
            name: name.ok_or_else(|| input.error("tag name is required"))?,
            display_name,
            description,
            external_docs,
        })
    }
}

impl ToTokens for Tag {
    fn to_tokens(&self, tokens: &mut proc_macro2::TokenStream) {
        // TODO crate name
        let crate_name = quote!(aide);

        let res_fn_name = Ident::new(
            &format!("aide_tag_{}", uuid::Uuid::new_v4().to_simple_ref()),
            Span::call_site(),
        );

        let static_res_fn_name = Ident::new(
            &(res_fn_name.to_string().to_uppercase() + "_LINK"),
            Span::call_site(),
        );

        let id = self.id.clone().unwrap_or_else(|| 
            LitStr::new("", Span::call_site()));

        
        let mut tag_fields = quote!();

        let name = &self.name;
        tag_fields.extend(quote!{
            name: #name,
        });

        tag_fields.extend(match &self.description {
            Some(d) => {quote!{description: Some(#d),}}
            None => {quote!{description: None,}}
        });

        tag_fields.extend(match &self.display_name {
            Some(d) => {quote!{display_name: Some(#d),}}
            None => {quote!{display_name: None,}}
        });

        tag_fields.extend(match &self.external_docs {
            Some(e) => {
                let url = &e.url;
                match &e.description {
                Some(d) => {
                    quote!{external_docs: Some(#crate_name::openapi::v3::gen::item::ExternalDocs {
                        url: #url,
                        description: Some(#d),
                    }),}
                }
                None => {
                    quote!{external_docs: Some(#crate_name::openapi::v3::gen::item::ExternalDocs {
                        url: #url,
                        description: None,
                    }),}
                }
            }}
            None => {quote!{external_docs: None,}}
        });

        tokens.extend(
        quote! {
                #[#crate_name::internal::linkme::distributed_slice(#crate_name::openapi::v3::gen::ITEMS)]
                #[linkme(crate = #crate_name::internal::linkme)]
                static #static_res_fn_name: #crate_name::openapi::v3::gen::ItemFn = #res_fn_name;
                fn #res_fn_name(opts: &#crate_name::openapi::v3::gen::Options) -> Result<#crate_name::openapi::v3::gen::item::Item, #crate_name::openapi::v3::gen::Error> {
                    if opts.id != #id {
                        return Err(
                            #crate_name::openapi::v3::gen::Error {
                                position: Some(#crate_name::openapi::v3::gen::item::Position {
                                    file: file!(),
                                    column: column!(),
                                    line: line!()
                                }),
                                kind: #crate_name::openapi::v3::gen::ErrorKind::IdExpected(#id.into()),
                            }
                        );
                    }
    
                    Ok(
                        #crate_name::openapi::v3::gen::item::Item {
                            id: #id,
                            position: #crate_name::openapi::v3::gen::item::Position {
                                file: file!(),
                                column: column!(),
                                line: line!()
                            },
                            content: Box::new(
                                #crate_name::openapi::v3::gen::item::ItemTag {
                                    #tag_fields
                                }
                            )
                        }
                    )
                }
            }
        )
    }
}

#[derive(Debug, Clone)]
pub struct ExternalDocs {
    pub url: Expr,
    pub description: Option<Expr>,
}

impl Parse for ExternalDocs {
    fn parse(input: ParseStream) -> syn::Result<Self> {
        let mut url: Option<Expr> = None;
        let mut description: Option<Expr> = None;

        let params: AttrParams = input.parse()?;
        params.no_duplicates();
        params.no_unnamed();
        params.retain_known(|i| i == "url" || i == "desc" || i == "description");

        for param in params {
            match param {
                AttrParam::Named { name: ident, value } => {
                    if ident == "url" {
                        url = Some(value.parse()?);
                    } else if ident == "desc" || ident == "description" {
                        description = Some(value.parse()?);
                    } else {
                        unreachable!()
                    }
                }
                AttrParam::Unnamed(_) => unreachable!(),
            }
        }

        Ok(Self {
            url: url.ok_or_else(|| input.error("external docs url is required"))?,
            description,
        })
    }
}
