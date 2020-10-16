use proc_macro2::{Span, TokenStream};
use proc_macro_error::abort;
use quote::{quote, ToTokens};
use syn::{Expr, Ident, Item, LitStr, Path, Token, parse::Parse, parse::ParseStream, parse2, parse_quote, punctuated::Punctuated};
use tamasfe_macro_utils::{attr::AttrParam, attr::AttrParams, path::is_path, path_segments};

#[derive(Debug, Clone)]
pub struct Model {
    id: Option<LitStr>,
    create_tag: bool,
    tag_display_name: Option<Expr>,
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
        let mut create_tag = false;
        let mut tag_display_name: Option<Expr> = None;

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
            } else if att.path.is_ident("id") {
                id = Some(parse2(att.tokens.clone())?);
            } else if att.path.is_ident("create_tag") {
                create_tag = true;
                if !att.tokens.is_empty() {
                    tag_display_name = Some(parse2(att.tokens.clone())?);
                }
            }
        }

        attrs.retain(|att| !att.path.is_ident("id") && !att.path.is_ident("create_tag"));

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

        Ok(Model { id, item, create_tag, tag_display_name })
    }
}

impl Parse for Model {
    fn parse(input: ParseStream) -> syn::Result<Self> {
        Model::from_item(input.parse()?)
    }
}

impl ToTokens for Model {
    fn to_tokens(&self, tokens: &mut TokenStream) {
        self.item.to_tokens(tokens);

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
        let create_tag = self.create_tag;

        let tag_display_name = match &self.tag_display_name {
            Some(d) => {
                quote!(tag_display_name: Some(#d),)
            }
            None => {
                quote!(tag_display_name: None,)
            }
        };

        tokens.extend(
        quote! {
                #[#crate_name::internal::linkme::distributed_slice(#crate_name::openapi::v3::gen::ITEMS)]
                #[linkme(crate = #crate_name::internal::linkme)]
                static #static_res_fn_name: #crate_name::openapi::v3::gen::ItemFn = #res_fn_name;
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
                                    create_tag: #create_tag,
                                    schema: opts.generate_schema::<#ty>(),
                                    #tag_display_name
                                }
                            )
                        }
                    )
                }
            }
        )
    }
}
