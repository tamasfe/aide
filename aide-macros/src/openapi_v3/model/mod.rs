use proc_macro2::{Span, TokenStream};
use proc_macro_error::abort;
use quote::{quote, ToTokens};
use syn::{Ident, Item, LitStr, Path, parse::Parse, parse::ParseStream, parse2, parse_quote};
use tamasfe_macro_utils::{attr::AttrParam, attr::AttrParams};

#[derive(Debug, Clone)]
pub struct Model {
    id: Option<LitStr>,
    item: Item,
}

impl Model {
    pub fn from_item(mut item: Item) -> syn::Result<Self> {
        let attrs = match &mut item {
            Item::Enum(en) => &mut en.attrs,
            Item::Struct(s) => &mut s.attrs,
            _ => {
                return Err(syn::Error::new(
                    Span::call_site(),
                    "a model can only be applied to an enum or struct",
                ))
            }
        };

        let mut crate_name: Path = parse_quote!(aide);
        let mut id: Option<LitStr> = None;

        attrs.retain(|a| {
            if a.path.is_ident("api") || a.path.is_ident("aide") {
                match parse2::<AttrParams>(a.tokens.clone()) {
                    Ok(params) => {
                        params.no_unnamed();
                        params.no_names_mixed();
                        params.no_duplicates();
                        params.retain_known(|n| n == "crate");

                        for p in params {
                            match p {
                                AttrParam::Named { name, value } => {
                                    if name == "crate" {
                                        // TODO duplicate
                                        crate_name = match value.parse() {
                                            Ok(c) => c,
                                            Err(e) => abort!(e),
                                        };
                                    }
                                }
                                AttrParam::Unnamed(_) => unreachable!(),
                            }
                        }
                    }
                    Err(e) => abort!(e),
                }
                false
            } else {
                true
            }
        });

        for att in attrs.iter_mut() {
             if att.path.is_ident("api") {
                let params: AttrParams = parse2(att.tokens.clone())?;
                params.no_duplicates();
                params.no_unnamed();

                for param in params {
                    match param {
                        AttrParam::Named { name, value } => {
                            if name == "id" {
                                id = Some(value.parse()?);
                            }
                        },
                        AttrParam::Unnamed(_) => unreachable!(),
                    };
                }

            }
        }

        Ok(Model { id, item })
    }
}

impl Parse for Model {
    fn parse(input: ParseStream) -> syn::Result<Self> {
        Model::from_item(input.parse()?)
    }
}

impl ToTokens for Model {
    fn to_tokens(&self, tokens: &mut TokenStream) {
        // self.item.to_tokens(tokens);

        // TODO crate name
        let crate_name = quote!(aide);

        let res_fn_name = Ident::new(
            &format!("aide_model_{}", uuid::Uuid::new_v4().to_simple_ref()),
            Span::call_site(),
        );

        let static_res_fn_name = Ident::new(
            &(res_fn_name.to_string().to_uppercase() + "_LINK"),
            Span::call_site(),
        );

        let id = self.id.clone().unwrap_or_else(|| 
            LitStr::new("", Span::call_site()));

        let ty  =match &self.item {
            Item::Enum(en) => & en.ident,
            Item::Struct(s) => & s.ident,
            _ => 
                unreachable!()
        };

        let name = LitStr::new(&ty.to_string(), ty.span());

        tokens.extend(
        quote! {
                #[allow(clippy::all)]
                #[#crate_name::internal::linkme::distributed_slice(#crate_name::openapi::v3::gen::ITEMS)]
                #[linkme(crate = #crate_name::internal::linkme)]
                static #static_res_fn_name: #crate_name::openapi::v3::gen::ItemFn = #res_fn_name;
                #[allow(clippy::all)]
                #[allow(unused_parens)]
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
                                #crate_name::openapi::v3::gen::item::ItemModel {
                                    name: #name,
                                    schema: opts.generate_schema::<#ty>(),
                                }
                            )
                        }
                    )
                }
            }
        )
    }
}
