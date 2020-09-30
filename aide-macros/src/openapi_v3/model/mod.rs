use crate::util::{attr::AttrParam, attr::AttrParams, parsing::is_path};
use proc_macro2::{Span, TokenStream};
use proc_macro_error::abort;
use quote::{quote, ToTokens};
use syn::{
    parse::Parse, parse::ParseStream, parse2, parse_quote, punctuated::Punctuated, Item, LitStr,
    Path, Token,
};

#[derive(Debug, Clone)]
pub struct Model {
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

        let mut has_derive = false;

        let mut has_serialize = false;
        let mut has_deserialize = false;
        let mut has_schemars = false;

        for att in attrs.iter_mut() {
            if att.path.is_ident("derive") {
                has_derive = true;
                let mut derives =
                    att.parse_args_with(Punctuated::<Path, Token!(,)>::parse_terminated)?;

                for d in &derives {
                    if is_path(d, &path_segments!(::serde::Serialize))
                        || is_path(d, &path_segments!(::serde::ser::Serialize))
                    {
                        has_serialize = true;
                    }

                    if is_path(d, &path_segments!(::serde::Deserialize))
                        || is_path(d, &path_segments!(::serde::de::Deserialize))
                    {
                        has_deserialize = true;
                    }

                    if is_path(d, &path_segments!(::schemars::JsonSchema)) {
                        has_schemars = true;
                    }
                }

                if !has_serialize {
                    derives.push(parse_quote!(#crate_name::internal::serde::Serialize));
                }

                if !has_deserialize {
                    derives.push(parse_quote!(#crate_name::internal::serde::Deserialize));
                }

                if !has_schemars {
                    derives.push(parse_quote!(#crate_name::internal::schemars::JsonSchema));
                }

                att.tokens = quote!((#derives));
                break;
            }
        }

        if !has_derive {
            attrs.push(parse_quote! {
                    #[derive(
                        #crate_name::internal::serde::Serialize,
                        #crate_name::internal::serde::Deserialize,
                        #crate_name::internal::schemars::JsonSchema
                    )]
            });
        }

        if !has_schemars {
            let s = LitStr::new(
                &format!("{}::internal::schemars", quote!(#crate_name)),
                Span::call_site(),
            );
            attrs.push(parse_quote! {#[schemars(crate = #s)]})
        }

        if !has_serialize || !has_deserialize {
            let s = LitStr::new(
                &format!("{}::internal::serde", quote!(#crate_name)),
                Span::call_site(),
            );
            attrs.push(parse_quote! {#[serde(crate = #s)]})
        }

        Ok(Model { item })
    }
}

impl Parse for Model {
    fn parse(input: ParseStream) -> syn::Result<Self> {
        Model::from_item(input.parse()?)
    }
}

impl ToTokens for Model {
    fn to_tokens(&self, tokens: &mut TokenStream) {
        self.item.to_tokens(tokens)
    }
}
