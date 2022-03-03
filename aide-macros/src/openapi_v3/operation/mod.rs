use std::collections::HashSet;

use crate::util::{examples::Example, parse_path_params};
use binding::{Binding, BindingKind, Bindings};
use heck::MixedCase;
use param::Param;
use proc_macro2::{Span, TokenStream};
use proc_macro_error::{emit_error};
use quote::{format_ident, ToTokens};
use quote::{quote, quote_spanned};
use response::{DefaultResponse, Response};
use syn::ext::IdentExt;
use syn::{
    parse::{Parse, ParseStream},
    punctuated::Punctuated,
    spanned::Spanned,
    Error, Expr, FnArg, Ident, Item, ItemFn, LitStr, Pat, Token,
};
use syn::{ReturnType, Type};
use tamasfe_macro_utils::{
    attr::{AttrParam, AttrParams},
    path::is_option,
};
use titlecase::titlecase;

mod binding;
mod param;
mod response;

pub struct Operation {
    pub deprecated: bool,
    pub id: Option<LitStr>,
    pub path: LitStr,
    pub method: Ident,
    pub item: ItemFn,
    pub doc: Option<LitStr>,
    pub params: Vec<Param>,
    pub responses: Vec<Response>,
    pub bindings: Vec<Bindings>,
    pub tags: Vec<Expr>,
    pub default_response: Option<DefaultResponse>,
    pub skip_params: HashSet<Ident>,
    pub inputs: Vec<OperationInput>,
    pub output: Option<OperationOutput>,
}

impl Operation {
    pub fn from_item(item: Item) -> syn::Result<Self> {
        let mut item_fn = match item {
            Item::Fn(f) => f,
            _ => return Err(syn::Error::new(Span::call_site(), "function expected")),
        };

        let mut deprecated = false;
        let mut params: Vec<Param> = Vec::new();
        let mut responses = Vec::new();
        let mut default_response: Option<DefaultResponse> = None;
        let mut errors: Option<Error> = None;
        let mut method: Option<Ident> = None;
        let mut path: Option<LitStr> = None;
        let mut id: Option<LitStr> = None;
        let mut bindings: Vec<Bindings> = Vec::new();
        let mut path_params: Vec<String> = Vec::new();
        let mut doc_val = String::new();
        let mut tags: Vec<Expr> = Vec::new();
        let mut skip_params: HashSet<Ident> = HashSet::new();

        item_fn.attrs.retain(|attr| {
            if attr.path.is_ident("api") {
                let attr_params = match attr.parse_args::<AttrParams>() {
                    Ok(p) => p,
                    Err(err) => {
                        match &mut errors {
                            None => errors = Some(err),
                            Some(errors) => {
                                errors.combine(Error::new(attr.path.span(), err.to_string()))
                            }
                        }
                        return false;
                    }
                };

                attr_params.no_unnamed();

                for param in attr_params {
                    let (name, value) = match param {
                        AttrParam::Named { name, value } => (name, value),
                        AttrParam::Unnamed(_) => unreachable!(),
                    };

                    if name == "res" || name == "response" {
                        match value.parse_with(|input: ParseStream| input.parse::<Response>()) {
                            Ok(r) => {
                                responses.push(r);
                            }
                            Err(e) => match &mut errors {
                                None => errors = Some(e),
                                Some(errors) => {
                                    errors.combine(Error::new(attr.path.span(), e.to_string()))
                                }
                            },
                        }
                    } else if name == "param" || name == "parameter" {
                        match value.parse_with(|input: ParseStream| input.parse::<Param>()) {
                            Ok(r) => {
                                for p in &params {
                                    if p.location == r.location && p.name == r.name {
                                        emit_error!(
                                            p.name.span(),
                                            r#"{} parameter "{}" is given here"#,
                                            p.location.ident(),
                                            p.name
                                        );
                                        emit_error!(
                                            r.name.span(),
                                            r#"{} parameter "{}" already exists"#,
                                            r.location.ident(),
                                            r.name
                                        );
                                        continue;
                                    }
                                }
                                params.push(r);
                            }
                            Err(e) => match &mut errors {
                                None => errors = Some(e),
                                Some(errors) => {
                                    errors.combine(Error::new(attr.path.span(), e.to_string()))
                                }
                            },
                        }
                    } else if name == "default_response" || name == "default_res" {
                        if default_response.is_some() {
                            emit_error!(attr.path.span(), "only one default response is allowed");
                            continue;
                        }
                        match value
                            .parse_with(|input: ParseStream| input.parse::<DefaultResponse>())
                        {
                            Ok(r) => {
                                default_response = Some(r);
                            }
                            Err(e) => match &mut errors {
                                None => errors = Some(e),
                                Some(errors) => {
                                    errors.combine(Error::new(attr.path.span(), e.to_string()))
                                }
                            },
                        }
                    } else if name == "id" {
                        match value.parse_with(|input: ParseStream| input.parse::<LitStr>()) {
                            Ok(r) => {
                                id = Some(r);
                            }
                            Err(e) => match &mut errors {
                                None => errors = Some(e),
                                Some(errors) => {
                                    errors.combine(Error::new(attr.path.span(), e.to_string()))
                                }
                            },
                        }
                    } else if name == "bind" {
                        match value.parse_with(|input: ParseStream| input.parse::<Bindings>()) {
                            Ok(b) => {
                                bindings.push(b);
                            }
                            Err(e) => match &mut errors {
                                None => errors = Some(e),
                                Some(errors) => {
                                    errors.combine(Error::new(attr.path.span(), e.to_string()))
                                }
                            },
                        }
                    } else if name == "tag" {
                        match value.parse_with(|input: ParseStream| input.parse::<Expr>()) {
                            Ok(b) => {
                                tags.push(b);
                            }
                            Err(e) => match &mut errors {
                                None => errors = Some(e),
                                Some(errors) => {
                                    errors.combine(Error::new(attr.path.span(), e.to_string()))
                                }
                            },
                        }
                    } else if name == "skip" {
                        match value.parse_with(|input: ParseStream| {
                            Punctuated::<Ident, Token!(,)>::parse_terminated_with(input, |ident| {
                                Ident::parse_any(ident)
                            })
                        }) {
                            Ok(list) => {
                                for ident in list {
                                    skip_params.insert(ident);
                                }
                            }
                            Err(e) => match &mut errors {
                                None => errors = Some(e),
                                Some(errors) => {
                                    errors.combine(Error::new(attr.path.span(), e.to_string()))
                                }
                            },
                        }
                    }
                }

                false
            } else if attr.path.is_ident("deprecated") {
                deprecated = true;
                true
            } else if attr.path.is_ident("doc") {
                if let Ok(d) = syn::parse2::<DocString>(attr.tokens.clone()) {
                    let val = d.content.value();
                    let v = val.strip_prefix(' ').unwrap_or(&val).trim_end();
                    doc_val += v;
                    doc_val += "\n";
                };
                true
            } else if attr.path.is_ident("get")
                || attr.path.is_ident("post")
                || attr.path.is_ident("put")
                || attr.path.is_ident("delete")
                || attr.path.is_ident("head")
                || attr.path.is_ident("patch")
                || attr.path.is_ident("options")
                || attr.path.is_ident("trace")
                || attr.path.is_ident("connect")
            {
                method = Some(attr.path.get_ident().unwrap().clone());
                match attr.parse_args_with(|input: ParseStream| input.parse::<LitStr>()) {
                    Ok(p) => {
                        path_params = parse_path_params(&p);
                        path = Some(p);
                    }
                    Err(e) => match &mut errors {
                        None => errors = Some(e),
                        Some(errors) => errors.combine(Error::new(attr.path.span(), e.to_string())),
                    },
                };
                true
            } else {
                true
            }
        });

        if method.is_none() {
            return Err(syn::Error::new(Span::call_site(),  "HTTP request method must be known"));
        }

        if path.is_none() {
            return Err(syn::Error::new(Span::call_site(),  "request path must be known"));
        }

        let (inputs, output) = Operation::parse_sig(&item_fn, &skip_params);

        match errors {
            None => Ok(Self {
                deprecated,
                item: item_fn,
                id,
                tags,
                doc: if doc_val.is_empty() {
                    None
                } else {
                    Some(LitStr::new(&doc_val, Span::call_site()))
                },
                params,
                responses,
                default_response,
                bindings,
                path: path.unwrap(),
                method: method.unwrap(),
                skip_params,
                inputs,
                output,
            }),
            Some(errors) => Err(errors),
        }
    }
}

impl Parse for Operation {
    fn parse(input: ParseStream) -> syn::Result<Self> {
        Operation::from_item(input.parse()?)
    }
}

impl Operation {
    fn parse_sig(
        f: &ItemFn,
        skipped: &HashSet<Ident>,
    ) -> (Vec<OperationInput>, Option<OperationOutput>) {
        let mut inputs: Vec<OperationInput> = Vec::new();
        let mut output: Option<OperationOutput> = None;

        for input in &f.sig.inputs {
            if let FnArg::Typed(arg) = &input {
                if let Pat::Ident(id) = &*arg.pat {
                    if skipped.contains(&id.ident) {
                        continue;
                    }
                }

                inputs.push(OperationInput {
                    ty: (*arg.ty).clone(),
                });
            }
        }

        // TODO: separate attribute
        if !skipped.contains(&format_ident!("return")) {
            if let ReturnType::Type(_, ty) = &f.sig.output {
                match &**ty {
                    Type::ImplTrait(_) | Type::Infer(_) | Type::Never(_) => {},
                    _ => {
                        output = Some(OperationOutput { ty: (**ty).clone() })
                    }
                }

                
            }
        }

        (inputs, output)
    }

    fn gen_inputs(
        inputs: &[OperationInput],
        id: &LitStr,
        method: &LitStr,
        crate_name: TokenStream,
        path: &LitStr,
    ) -> TokenStream {
        let mut input_tokens = TokenStream::new();

        for input in inputs {
            let res_fn_name = Ident::new(
                &format!("aide_operation_input{}", uuid::Uuid::new_v4().to_simple_ref()),
                Span::call_site(),
            );
    
            let static_res_fn_name = Ident::new(
                &(res_fn_name.to_string().to_uppercase() + "_LINK"),
                Span::call_site(),
            );

            let ty = &input.ty;
            input_tokens.extend(quote! {
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
                                kind: #crate_name::openapi::v3::gen::ErrorKind::IdExpected(#id),
                            }
                        );
                    }
    
                    Ok(
                        match <#ty as #crate_name::openapi::v3::gen::OperationInput>::operation_input(
                            opts,
                            #id,
                            #crate_name::openapi::v3::gen::item::Position {
                                file: file!(),
                                column: column!(),
                                line: line!()
                            },
                            #crate_name::openapi::v3::gen::item::Route {
                                method: #method,
                                path: #path
                            }
                        ) {
                            Some(it) => it,
                            None => #crate_name::openapi::v3::gen::item::Item {
                                id: #id,
                                position: #crate_name::openapi::v3::gen::item::Position {
                                    file: file!(),
                                    column: column!(),
                                    line: line!()
                                },
                                content: Box::new(
                                    #crate_name::openapi::v3::gen::item::ItemNothing
                                )
                            }
                        }
                    )
                }

                
            });
        }

        input_tokens
    }

    fn gen_output(
        output: &OperationOutput,
        id: &LitStr,
        method: &LitStr,
        crate_name: TokenStream,
        path: &LitStr,
    ) -> TokenStream {
        let res_fn_name = Ident::new(
            &format!("aide_operation_output{}", uuid::Uuid::new_v4().to_simple_ref()),
            Span::call_site(),
        );

        let static_res_fn_name = Ident::new(
            &(res_fn_name.to_string().to_uppercase() + "_LINK"),
            Span::call_site(),
        );

        let ty = &output.ty;

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
                            kind: #crate_name::openapi::v3::gen::ErrorKind::IdExpected(#id),
                        }
                    );
                }

                Ok(
                    match <#ty as #crate_name::openapi::v3::gen::OperationOutput>::operation_output(
                        opts,
                        #id,
                        #crate_name::openapi::v3::gen::item::Position {
                            file: file!(),
                            column: column!(),
                            line: line!()
                        },
                        #crate_name::openapi::v3::gen::item::Route {
                            method: #method,
                            path: #path
                        }
                    ) {
                        Some(it) => it,
                        None => #crate_name::openapi::v3::gen::item::Item {
                            id: #id,
                            position: #crate_name::openapi::v3::gen::item::Position {
                                file: file!(),
                                column: column!(),
                                line: line!()
                            },
                            content: Box::new(
                                #crate_name::openapi::v3::gen::item::ItemNothing
                            )
                        }
                    }
                )
            }
        }
    }

    #[allow(clippy::too_many_arguments)]
    fn gen_operation(
        deprecated: bool,
        id: &LitStr,
        crate_name: TokenStream,
        doc: Option<&LitStr>,
        tags: &[Expr],
        path: &LitStr,
        method: &LitStr,
        fn_name: &Ident,
    ) -> TokenStream {
        let mut op_fields = TokenStream::new();

        op_fields.extend(quote! {
            route: #crate_name::openapi::v3::gen::item::Route {
                method: #method,
                path: #path
            },
        });

        let fn_name_string = fn_name.to_string();

        let operation_id = fn_name_string.to_mixed_case();
        let op_id_lit = LitStr::new(&operation_id, fn_name.span());

        let summary = titlecase(&fn_name_string.replace('_', " "));
        let summary_lit = LitStr::new(&summary, fn_name.span());

        op_fields.extend(quote! {
            operation_id: #op_id_lit,
        });

        op_fields.extend(quote! {
            summary: #summary_lit,
        });

        op_fields.extend(match doc {
            Some(d) => {
                quote! {
                    description: Some(#d),
                }
            }
            None => {
                quote! {
                    description: None,
                }
            }
        });

        let mut tag_values: Punctuated<Expr, Token!(,)> = Punctuated::new();

        for tag in tags {
            tag_values.push(tag.clone());
        }

        op_fields.extend(quote! {
            tags: &[#tag_values],
        });

        let res_fn_name = Ident::new(
            &format!("aide_operation_{}", uuid::Uuid::new_v4().to_simple_ref()),
            Span::call_site(),
        );

        let static_res_fn_name = Ident::new(
            &(res_fn_name.to_string().to_uppercase() + "_LINK"),
            Span::call_site(),
        );

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
                            kind: #crate_name::openapi::v3::gen::ErrorKind::IdExpected(#id),
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
                            #crate_name::openapi::v3::gen::item::ItemOperation {
                                deprecated: #deprecated,
                                #op_fields
                            }
                        )
                    }
                )
            }
        }
    }

    fn gen_response(
        id: &LitStr,
        crate_name: TokenStream,
        method: &LitStr,
        path: &LitStr,
        res: &Response,
    ) -> TokenStream {
        let Response {
            description,
            examples,
            status_code,
            ty,
            content_type,
        } = res;

        let mut res_fields = quote! {};

        res_fields.extend(quote! {
            route: #crate_name::openapi::v3::gen::item::Route {
                method: #method,
                path: #path
            },
        });

        res_fields.extend(match status_code {
            Some(c) => {
                quote! {status: Some((#c).into()),}
            }
            None => {
                quote! {status: None,}
            }
        });

        res_fields.extend(match description {
            Some(d) => {
                quote! {description: Some(#d),}
            }
            None => {
                quote! {description: None,}
            }
        });

        res_fields.extend(match content_type {
            Some(ct) => {
                quote! {content_type: Some(#ct),}
            }
            None => {
                quote! {content_type: None,}
            }
        });

        res_fields.extend(match &examples.default_example {
            Some(ex) => {
                quote! {
                    example: Some(#crate_name::internal::serde_json::to_value::<#ty>(#ex)
                        .map_err(|e|
                            #crate_name::openapi::v3::gen::Error {
                                position: Some(#crate_name::openapi::v3::gen::item::Position {
                                    file: file!(),
                                    column: column!(),
                                    line: line!()
                                }),
                                kind: #crate_name::openapi::v3::gen::ErrorKind::SerdeJson(e),
                            }
                        )?
                    ),
                }
            }
            None => {
                quote! {example: None,}
            }
        });

        if examples.named_examples.is_empty() {
            res_fields.extend(quote! {
                examples: Default::default(),
            });
        } else {
            let mut ex_items = quote! {};

            for (
                name,
                Example {
                    value,
                    summary,
                    description,
                },
            ) in &examples.named_examples
            {
                let n = LitStr::new(&name.to_string(), name.span());

                let mut ex_fields = quote! {};

                ex_fields.extend(quote!{
                    value: {
                        let v: #ty = (#value).into();

                        #crate_name::openapi::v3::definition::ExampleValue::Value(#crate_name::internal::serde_json::to_value(v)
                            .map_err(|e|
                                #crate_name::openapi::v3::gen::Error {
                                    position: Some(#crate_name::openapi::v3::gen::item::Position {
                                        file: file!(),
                                        column: column!(),
                                        line: line!()
                                    }),
                                    kind: #crate_name::openapi::v3::gen::ErrorKind::SerdeJson(e),
                                }
                        )?)
                    },
                });

                ex_fields.extend(match summary {
                    Some(s) => {
                        quote! {summary: Some((#s).into()),}
                    }
                    None => {
                        quote! {summary: None,}
                    }
                });

                ex_fields.extend(match description {
                    Some(s) => {
                        quote! {description: Some((#s).into()),}
                    }
                    None => {
                        quote! {description: None,}
                    }
                });

                ex_fields.extend(quote! {extensions: Default::default(),});

                ex_items.extend(quote! {
                    {
                        let v: #ty = #value;

                        ex_hs.insert(
                            #n.into(),
                            #crate_name::openapi::v3::definition::Example {
                                #ex_fields
                            },
                        );
                    }
                });
            }

            res_fields.extend(quote! {
                examples: {
                    let mut ex_hs = #crate_name::internal::schemars::Map::new();
                    #ex_items
                    ex_hs
                },
            });
        }

        res_fields.extend(match ty {
            Some(ty) => {
                quote_spanned! {ty.span()=> schema: Some(opts.generate_schema::<#ty>()),}
            }
            None => {
                quote! {schema: None,}
            }
        });

        let res_fn_name = Ident::new(
            &format!("aide_response_{}", uuid::Uuid::new_v4().to_simple_ref()),
            Span::call_site(),
        );

        let static_res_fn_name = Ident::new(
            &(res_fn_name.to_string().to_uppercase() + "_LINK"),
            Span::call_site(),
        );

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
                            kind: #crate_name::openapi::v3::gen::ErrorKind::IdExpected(#id),
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
                            #crate_name::openapi::v3::gen::item::ItemResponse {
                                #res_fields
                            }
                        )
                    }
                )
            }
        }
    }

    fn gen_binding(
        id: &LitStr,
        crate_name: TokenStream,
        method: &LitStr,
        path: &LitStr,
        binding: &Binding,
    ) -> TokenStream {
        let Binding {
            kind,
            content_type,
            ty,
        } = binding;

        let mut binding_fields = quote! {};

        binding_fields.extend(quote! {
            route: #crate_name::openapi::v3::gen::item::Route {
                method: #method,
                path: #path
            },
        });

        binding_fields.extend(quote_spanned! {ty.span()=> schema: opts.generate_schema::<#ty>(),});

        binding_fields.extend(match kind {
            BindingKind::Path(v) => quote_spanned!(v.span() => kind: #crate_name::openapi::v3::gen::item::BindingKind::Path,),
            BindingKind::Query(v) => quote_spanned!(v.span() => kind: #crate_name::openapi::v3::gen::item::BindingKind::Query,),
            BindingKind::Body(v) => quote_spanned!(v.span() => kind: #crate_name::openapi::v3::gen::item::BindingKind::Body,),
        });

        binding_fields.extend(match content_type {
            Some(c) => {
                quote_spanned! {c.span()=> content_type: Some((#c).into()),}
            }
            None => {
                quote! {content_type: None,}
            }
        });

        let res_fn_name = Ident::new(
            &format!("aide_parameter_{}", uuid::Uuid::new_v4().to_simple_ref()),
            Span::call_site(),
        );

        let static_res_fn_name = Ident::new(
            &(res_fn_name.to_string().to_uppercase() + "_LINK"),
            Span::call_site(),
        );

        quote! {
            #[allow(clippy::all)]
            #[#crate_name::internal::linkme::distributed_slice(#crate_name::openapi::v3::gen::ITEMS)]
            #[linkme(crate = #crate_name::internal::linkme)]
            static #static_res_fn_name: #crate_name::openapi::v3::gen::ItemFn = #res_fn_name;
            #[allow(clippy::all)]
            fn #res_fn_name(opts: &#crate_name::openapi::v3::gen::Options) -> Result<#crate_name::openapi::v3::gen::item::Item, #crate_name::openapi::v3::gen::Error> {
                if opts.id != #id {
                    return Err(
                        #crate_name::openapi::v3::gen::Error {
                            position: Some(#crate_name::openapi::v3::gen::item::Position {
                                file: file!(),
                                column: column!(),
                                line: line!()
                            }),
                            kind: #crate_name::openapi::v3::gen::ErrorKind::IdExpected(#id),
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
                            #crate_name::openapi::v3::gen::item::ItemBinding {
                                #binding_fields
                            }
                        )
                    }
                )
            }
        }
    }

    fn gen_param(
        id: &LitStr,
        crate_name: TokenStream,
        method: &LitStr,
        path: &LitStr,
        param: &Param,
    ) -> TokenStream {
        let Param {
            default_value,
            deprecated,
            description,
            examples,
            location,
            name,
            ty,
        } = param;

        let mut param_fields = quote! {};

        param_fields.extend(quote! {
            route: #crate_name::openapi::v3::gen::item::Route {
                method: #method,
                path: #path
            },
        });

        param_fields.extend(match deprecated {
            Some(d) => {
                quote! {deprecated: (#d).into(),}
            }
            None => {
                quote! {deprecated: false,}
            }
        });

        param_fields.extend(match description {
            Some(d) => {
                quote! {description: Some(#d),}
            }
            None => {
                quote! {description: None,}
            }
        });

        param_fields.extend(match location {
            param::ParamLocation::Path(v) => quote_spanned!(v.span() => location: #crate_name::openapi::v3::definition::ParameterLocation::Path,),
            param::ParamLocation::Query(v) => quote_spanned!(v.span() => location: #crate_name::openapi::v3::definition::ParameterLocation::Query,),
            param::ParamLocation::Header(v) => quote_spanned!(v.span() => location: #crate_name::openapi::v3::definition::ParameterLocation::Header,),
            param::ParamLocation::Cookie(v) => quote_spanned!(v.span() => location: #crate_name::openapi::v3::definition::ParameterLocation::Cookie,),
        });

        param_fields.extend(match &examples.default_example {
            Some(ex) => {
                quote! {
                    example: Some(#crate_name::internal::serde_json::to_value::<#ty>(#ex)
                        .map_err(|e|
                            #crate_name::openapi::v3::gen::Error {
                                position: Some(#crate_name::openapi::v3::gen::item::Position {
                                    file: file!(),
                                    column: column!(),
                                    line: line!()
                                }),
                                kind: #crate_name::openapi::v3::gen::ErrorKind::SerdeJson(e),
                            }
                        )?),
                }
            }
            None => {
                quote! {example: None,}
            }
        });

        param_fields.extend(match default_value {
            Some(ex) => {
                quote! {default_value: Some(#crate_name::internal::serde_json::to_value::<#ty>(#ex)
                .map_err(|e|
                    #crate_name::openapi::v3::gen::Error {
                        position: Some(#crate_name::openapi::v3::gen::item::Position {
                            file: file!(),
                            column: column!(),
                            line: line!()
                        }),
                        kind: #crate_name::openapi::v3::gen::ErrorKind::SerdeJson(e),
                    }
                )?),}
            }
            None => {
                quote! {default_value: None,}
            }
        });

        if examples.named_examples.is_empty() {
            param_fields.extend(quote! {
                examples: Default::default(),
            });
        } else {
            let mut ex_items = quote! {};

            for (
                name,
                Example {
                    value,
                    summary,
                    description,
                },
            ) in &examples.named_examples
            {
                let n = LitStr::new(&name.to_string(), name.span());

                let mut ex_fields = quote! {};

                ex_fields.extend(quote!{
                    value: {
                        let v: #ty = (#value).into();

                        #crate_name::openapi::v3::definition::ExampleValue::Value(#crate_name::internal::serde_json::to_value(v)
                            .map_err(|e|
                                #crate_name::openapi::v3::gen::Error {
                                    position: Some(#crate_name::openapi::v3::gen::item::Position {
                                        file: file!(),
                                        column: column!(),
                                        line: line!()
                                    }),
                                    kind: #crate_name::openapi::v3::gen::ErrorKind::SerdeJson(e),
                                }
                        )?)
                    },
                });

                ex_fields.extend(match summary {
                    Some(s) => {
                        quote! {summary: Some((#s).into()),}
                    }
                    None => {
                        quote! {summary: None,}
                    }
                });

                ex_fields.extend(match description {
                    Some(s) => {
                        quote! {description: Some((#s).into()),}
                    }
                    None => {
                        quote! {description: None,}
                    }
                });

                ex_fields.extend(quote! {extensions: Default::default(),});

                ex_items.extend(quote! {
                    {
                        let v: #ty = #value;

                        ex_hs.insert(
                            #n.into(),
                            #crate_name::openapi::v3::definition::Example {
                                #ex_fields
                            },
                        );
                    }
                });
            }

            param_fields.extend(quote! {
                examples: {
                    let mut ex_hs = #crate_name::internal::schemars::Map::new();
                    #ex_items
                    ex_hs
                },
            });
        }

        param_fields.extend(quote_spanned! {ty.span()=> schema: opts.generate_schema::<#ty>(),});
        param_fields.extend(if is_option(ty) || param.location.is_path() {
            quote! {required: true,}
        } else {
            quote! {required: false,}
        });

        let name_lit = match name {
            param::ParamName::Ident(i) => LitStr::new(&i.to_string(), i.span()),
            param::ParamName::LitStr(n) => n.clone(),
        };

        param_fields.extend(quote!(name: (#name_lit).into(),));

        let res_fn_name = Ident::new(
            &format!("aide_parameter_{}", uuid::Uuid::new_v4().to_simple_ref()),
            Span::call_site(),
        );

        let static_res_fn_name = Ident::new(
            &(res_fn_name.to_string().to_uppercase() + "_LINK"),
            Span::call_site(),
        );

        quote! {
            #[allow(clippy::all)]
            #[#crate_name::internal::linkme::distributed_slice(#crate_name::openapi::v3::gen::ITEMS)]
            #[linkme(crate = #crate_name::internal::linkme)]
            static #static_res_fn_name: #crate_name::openapi::v3::gen::ItemFn = #res_fn_name;
            #[allow(clippy::all)]
            fn #res_fn_name(opts: &#crate_name::openapi::v3::gen::Options) -> Result<#crate_name::openapi::v3::gen::item::Item, #crate_name::openapi::v3::gen::Error> {
                if opts.id != #id {
                    return Err(
                        #crate_name::openapi::v3::gen::Error {
                            position: Some(#crate_name::openapi::v3::gen::item::Position {
                                file: file!(),
                                column: column!(),
                                line: line!()
                            }),
                            kind: #crate_name::openapi::v3::gen::ErrorKind::IdExpected(#id),
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
                            #crate_name::openapi::v3::gen::item::ItemParameter {
                                #param_fields
                            }
                        )
                    }
                )
            }
        }
    }
}

impl ToTokens for Operation {
    fn to_tokens(&self, tokens: &mut TokenStream) {
        // TODO: crate name
        let crate_name = quote!(aide);
        let doc = self.doc.as_ref();

        let id = self
            .id
            .clone()
            .unwrap_or_else(|| LitStr::new("", Span::call_site()));

        let method = LitStr::new(&self.method.to_string().to_lowercase(), self.method.span());
        let path = &self.path;

        let inputs = Operation::gen_inputs(&self.inputs, &id, &method, crate_name.clone(), path);

        let output = match &self.output {
            Some(o) => {
                Operation::gen_output(o, &id, &method, crate_name.clone(), path)
            },
            None => TokenStream::new(),
        };

        let op = Operation::gen_operation(
            self.deprecated,
            &id,
            crate_name.clone(),
            doc,
            &self.tags,
            path,
            &method,
            &self.item.sig.ident,
        );

        let mut bindings = quote! {};

        for b in &self.bindings {
            if let Some(binding) = &b.path {
                bindings.extend(Operation::gen_binding(
                    &id,
                    crate_name.clone(),
                    &method,
                    path,
                    binding,
                ));
            }

            if let Some(binding) = &b.query {
                bindings.extend(Operation::gen_binding(
                    &id,
                    crate_name.clone(),
                    &method,
                    path,
                    binding,
                ));
            }

            if let Some(binding) = &b.body {
                bindings.extend(Operation::gen_binding(
                    &id,
                    crate_name.clone(),
                    &method,
                    path,
                    binding,
                ));
            }
        }

        let mut params = quote! {};

        for param in &self.params {
            params.extend(Operation::gen_param(
                &id,
                crate_name.clone(),
                &method,
                path,
                param,
            ));
        }

        let mut responses = quote! {};

        for res in &self.responses {
            responses.extend(Operation::gen_response(
                &id,
                crate_name.clone(),
                &method,
                path,
                res,
            ));
        }

        if let Some(default_res) = &self.default_response {
            responses.extend(Operation::gen_response(
                &id,
                crate_name,
                &method,
                path,
                &default_res.0,
            ));
        }

        let original_handler = &self.item;

        tokens.extend(quote! {
            #op
            #inputs
            #output
            #params
            #responses
            #bindings
            #original_handler
        })
    }
}

#[derive(Debug, Clone)]
struct DocString {
    _eq: Token!(=),
    content: LitStr,
}

impl Parse for DocString {
    fn parse(input: ParseStream) -> syn::Result<Self> {
        Ok(Self {
            _eq: input.parse()?,
            content: input.parse()?,
        })
    }
}

pub struct OperationInput {
    ty: Type,
}

pub struct OperationOutput {
    ty: Type,
}
