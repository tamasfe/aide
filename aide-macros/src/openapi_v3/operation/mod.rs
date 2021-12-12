use crate::util::{examples::Example, examples::Examples, parse_path_params};
use binding::{Binding, BindingKind, Bindings};
use heck::MixedCase;
use param::{Param, ParamLocation};
use proc_macro2::{Span, TokenStream};
use proc_macro_error::{abort, emit_error, emit_warning};
use quote::ToTokens;
use quote::{quote, quote_spanned};
use response::{DefaultResponse, Response};
use syn::{
    parse::{Parse, ParseStream},
    punctuated::Punctuated,
    spanned::Spanned,
    Error, Expr, FnArg, GenericArgument, Ident, Item, ItemFn, LitStr, Pat, PathArguments, Token,
    Type,
};
use tamasfe_macro_utils::{
    attr::{AttrParam, AttrParams},
    path::{is_option, is_type, type_args},
    path_segments,
};
use titlecase::titlecase;

mod binding;
mod param;
mod response;

pub struct Operation {
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
}

impl Operation {
    pub fn from_item(item: Item) -> syn::Result<Self> {
        let mut item_fn = match item {
            Item::Fn(f) => f,
            _ => abort!(Span::call_site(), "function expected"),
        };

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
                                        abort!(
                                            r.name.span(),
                                            r#"{} parameter "{}" already exists"#,
                                            r.location.ident(),
                                            r.name
                                        );
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
                            abort!(attr.path.span(), "only one default response is allowed");
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
                    }
                }

                false
            } else if attr.path.is_ident("doc") {
                if let Ok(d) = syn::parse2::<DocString>(attr.tokens.clone()) {
                    doc_val += &d.content.value();
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

            // false
        });

        if method.is_none() {
            abort!(Span::call_site(), "HTTP request method must be known");
        }

        if path.is_none() {
            abort!(Span::call_site(), "request path must be known");
        }

        let (mut arg_bindings, arg_path_params) = Operation::parse_args(&item_fn, &path_params);

        let mut body_binding = false;
        let mut query_binding = false;
        let mut path_binding = false;

        for b in &bindings {
            if b.query.is_some() {
                query_binding = true;
            }

            if b.body.is_some() {
                body_binding = true;
            }

            if b.path.is_some() {
                path_binding = true;
            }
        }

        if body_binding {
            arg_bindings.body = None
        }

        if query_binding {
            arg_bindings.query = None
        }

        if path_binding {
            arg_bindings.path = None
        }

        if arg_bindings.path.is_some()
            || arg_bindings.query.is_some()
            || arg_bindings.body.is_some()
        {
            bindings.push(arg_bindings);
        }

        if let Some(arg_params) = arg_path_params {
            for p in arg_params {
                let mut exists = false;
                for existing_p in &params {
                    if existing_p.name.to_string() == p.name.to_string() {
                        exists = true;
                        break;
                    }
                }

                if !exists {
                    params.push(p);
                }
            }
        }

        match errors {
            None => Ok(Self {
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
    fn parse_args(f: &ItemFn, path_param_names: &[String]) -> (Bindings, Option<Vec<Param>>) {
        let mut bindings = Bindings::default();
        let mut path_params: Vec<Param> = Vec::new();

        for input in &f.sig.inputs {
            if let FnArg::Typed(arg) = &input {
                if is_type(&*arg.ty, &path_segments!(actix_web::web::Json)) {
                    if let Some(inner_type) = type_args(&*arg.ty).and_then(|a| match a {
                        PathArguments::None => None,
                        PathArguments::Parenthesized(_) => None,
                        PathArguments::AngleBracketed(t) => {
                            t.args.iter().next().and_then(|g| match g {
                                GenericArgument::Lifetime(_) => None,
                                GenericArgument::Binding(_) => None,
                                GenericArgument::Constraint(_) => None,
                                GenericArgument::Const(_) => None,
                                GenericArgument::Type(ty) => Some(ty),
                            })
                        }
                    }) {
                        if let Some(b) = &bindings.body {
                            emit_error!(b.kind.ident().span(), "previous binding here");
                            abort!(arg.span(), "the request body is already bound");
                        }

                        bindings.body = Some(Binding {
                            kind: BindingKind::Body(Ident::new("body", arg.span())),
                            content_type: Some(LitStr::new("application/json", arg.span())),
                            ty: inner_type.clone(),
                        })
                    }
                } else if is_type(&*arg.ty, &path_segments!(actix_web::web::Path)) {
                    if let Some(inner_type) = type_args(&*arg.ty).and_then(|a| match a {
                        PathArguments::None => None,
                        PathArguments::Parenthesized(_) => None,
                        PathArguments::AngleBracketed(t) => {
                            t.args.iter().next().and_then(|g| match g {
                                GenericArgument::Lifetime(_) => None,
                                GenericArgument::Binding(_) => None,
                                GenericArgument::Constraint(_) => None,
                                GenericArgument::Const(_) => None,
                                GenericArgument::Type(ty) => Some(ty),
                            })
                        }
                    }) {
                        if let Some(b) = &bindings.path {
                            emit_error!(b.kind.ident().span(), "previous binding here");
                            abort!(arg.span(), "the request path is already bound");
                        }

                        if !path_params.is_empty() {
                            abort!(arg.span(), "the request path is already bound");
                        }

                        if let Type::Tuple(param_tuple) = inner_type {
                            if param_tuple.elems.len() != path_param_names.len() {
                                abort!(
                                    param_tuple.span(),
                                    "the path binding expects {} path parameters, but there are {} in the path",
                                    param_tuple.elems.len(), path_param_names.len()
                                );
                            }

                            if let Pat::TupleStruct(ts) = &*arg.pat {
                                if let Some(Pat::Tuple(t)) = ts.pat.elems.iter().next() {
                                    for (i, elem) in t.elems.iter().enumerate() {
                                        if let Pat::Ident(p_ident) = elem {
                                            for (j, p_name) in path_param_names.iter().enumerate() {
                                                if p_ident.ident == p_name && i != j {
                                                    if cfg!(feature = "warn-as-error") {
                                                        abort!(
                                                            p_ident.span(),
                                                            r#"parameter "{}" is at position {} in the binding, but {} in the path"#,
                                                            p_name,
                                                            i,
                                                            j
                                                        );
                                                    } else {
                                                        emit_warning!(
                                                            p_ident.span(),
                                                            r#"parameter "{}" is at position {} in the binding, but {} in the path"#,
                                                            p_name,
                                                            i,
                                                            j
                                                        );
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            for (i, path_ty) in param_tuple.elems.iter().enumerate() {
                                path_params.push(Param {
                                    location: ParamLocation::Path(Ident::new(
                                        "path",
                                        path_ty.span(),
                                    )),
                                    name: param::ParamName::LitStr(LitStr::new(
                                        &path_param_names[i],
                                        path_ty.span(),
                                    )),
                                    default_value: None,
                                    deprecated: None,
                                    description: None,
                                    ty: path_ty.clone(),
                                    examples: Examples::default(),
                                })
                            }
                            continue;
                        }

                        bindings.path = Some(Binding {
                            kind: BindingKind::Path(Ident::new("path", arg.span())),
                            content_type: None,
                            ty: inner_type.clone(),
                        })
                    }
                } else if is_type(&*arg.ty, &path_segments!(actix_web::web::Query)) {
                    if let Some(inner_type) = type_args(&*arg.ty).and_then(|a| match a {
                        PathArguments::None => None,
                        PathArguments::Parenthesized(_) => None,
                        PathArguments::AngleBracketed(t) => {
                            t.args.iter().next().and_then(|g| match g {
                                GenericArgument::Lifetime(_) => None,
                                GenericArgument::Binding(_) => None,
                                GenericArgument::Constraint(_) => None,
                                GenericArgument::Const(_) => None,
                                GenericArgument::Type(ty) => Some(ty),
                            })
                        }
                    }) {
                        if let Some(b) = &bindings.query {
                            emit_error!(b.kind.ident().span(), "previous binding here");
                            abort!(arg.span(), "the request query is already bound");
                        }

                        bindings.query = Some(Binding {
                            kind: BindingKind::Query(Ident::new("query", arg.span())),
                            content_type: None,
                            ty: inner_type.clone(),
                        })
                    }
                } else if is_type(&*arg.ty, &path_segments!(actix_web::web::Form)) {
                    if let Some(inner_type) = type_args(&*arg.ty).and_then(|a| match a {
                        PathArguments::None => None,
                        PathArguments::Parenthesized(_) => None,
                        PathArguments::AngleBracketed(t) => {
                            t.args.iter().next().and_then(|g| match g {
                                GenericArgument::Lifetime(_) => None,
                                GenericArgument::Binding(_) => None,
                                GenericArgument::Constraint(_) => None,
                                GenericArgument::Const(_) => None,
                                GenericArgument::Type(ty) => Some(ty),
                            })
                        }
                    }) {
                        if let Some(b) = &bindings.body {
                            emit_error!(b.kind.ident().span(), "previous binding here");
                            abort!(arg.span(), "the request body is already bound");
                        }

                        bindings.body = Some(Binding {
                            kind: BindingKind::Body(Ident::new("body", arg.span())),
                            content_type: Some(LitStr::new(
                                "application/x-www-form-urlencoded",
                                arg.span(),
                            )),
                            ty: inner_type.clone(),
                        })
                    }
                }
            }
        }

        (
            bindings,
            if path_params.is_empty() {
                None
            } else {
                Some(path_params)
            },
        )
    }

    fn gen_operation(
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

        let summary = titlecase(&fn_name_string.replace("_", " "));
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

        let op = Operation::gen_operation(
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
            #params
            #responses
            #bindings
            #original_handler
        })
    }
}

#[derive(Debug, Clone)]
struct DocString {
    eq: Token!(=),
    content: LitStr,
}

impl Parse for DocString {
    fn parse(input: ParseStream) -> syn::Result<Self> {
        Ok(Self {
            eq: input.parse()?,
            content: input.parse()?,
        })
    }
}
