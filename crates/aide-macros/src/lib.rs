use darling::FromDeriveInput;
use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, parse_quote, DeriveInput, Type};

extern crate proc_macro;

#[derive(Default, FromDeriveInput)]
#[darling(default, attributes(aide))]
struct OperationIoOpts {
    input: bool,
    input_with: Option<Type>,
    output: bool,
    output_with: Option<Type>,
    json_schema: bool,
}

/// A helper to reduce boilerplate for implementing [`OperationInput`]
/// and [`OperationOutput`] for common use-cases.
///
/// # Examples
///
/// The following implements an empty [`OperationInput`] and
/// [`OperationOutput`] so that the type can be used in documented
/// handlers but does not modify the documentation generation in any way.
///
/// ```ignore
/// use aide::{OperationInput, OperationOutput};
/// # use aide_macros::{OperationInput, OperationOutput};
///
/// #[derive(OperationIo)]
/// struct MyExtractor;
/// ```
///
/// By default both [`OperationInput`] and [`OperationOutput`] are implemented.
/// It is possible to restrict either with the `input` and `output` parameters.
///
/// The following will only implement [`OperationOutput`]:
///
/// ```ignore
/// #[derive(OperationIo)]
/// #[aide(output)]
/// struct MyExtractor;
/// ```
///
/// We can use the implementations of another type,
/// this is useful for wrapping other (e.g. `Json`) extractors
/// that might alter runtime behaviour but the documentation remains the same.
///
/// Additionally passing the `json_schema` flag will put a
/// [`JsonSchema`] bound to all generic parameters.
///
/// ```ignore
/// #[derive(OperationIo)]
/// #[aide(
///     input_with = "some_other::Json<T>",
///     output_with = "some_other::Json<T>",
///     json_schema
/// )]
/// struct Json<T>(pub T);
/// ```
///
/// [`JsonSchema`]: https://docs.rs/schemars/latest/schemars/trait.JsonSchema.html
/// [`OperationInput`]: https://docs.rs/aide/latest/aide/operation/trait.OperationInput.html
/// [`OperationOutput`]: https://docs.rs/aide/latest/aide/operation/trait.OperationOutput.html
#[proc_macro_derive(OperationIo, attributes(aide))]
pub fn derive_operation_io(ts: TokenStream) -> TokenStream {
    let mut derive_input = parse_macro_input!(ts as DeriveInput);

    let OperationIoOpts {
        input_with,
        output_with,
        input,
        output,
        json_schema,
    } = OperationIoOpts::from_derive_input(&derive_input).unwrap();

    let name = &derive_input.ident;

    let generic_params = derive_input
        .generics
        .params
        .iter()
        .filter_map(|p| match p {
            syn::GenericParam::Type(t) => Some(t.ident.clone()),
            _ => None,
        })
        .collect::<Vec<_>>();

    if json_schema {
        let wh = derive_input.generics.make_where_clause();

        for param in generic_params {
            wh.predicates
                .push(parse_quote!(#param: schemars::JsonSchema));
        }
    }

    let (i_gen, t_gen, w_gen) = derive_input.generics.split_for_impl();

    let mut ts = quote!();

    if !input && !output && input_with.is_none() && output_with.is_none() {
        ts.extend(quote! {
            impl #i_gen aide::OperationInput for #name #t_gen #w_gen {}
            impl #i_gen aide::OperationOutput for #name #t_gen #w_gen {
                type Inner = Self;
            }
        });
    } else {
        if input {
            ts.extend(quote! {
                impl #i_gen aide::OperationInput for #name #t_gen #w_gen {}
            });
        }
        if output {
            ts.extend(quote! {
                impl #i_gen aide::OperationOutput for #name #t_gen #w_gen {
                    type Inner = Self;
                }
            });
        }

        if let Some(input) = input_with {
            ts.extend(quote! {
                impl #i_gen aide::OperationInput for #name #t_gen #w_gen {
                    fn operation_input(
                        ctx: &mut aide::gen::GenContext,
                        operation: &mut aide::openapi::Operation
                    ) {
                        <#input as aide::OperationInput>::operation_input(
                            ctx,
                            operation
                        );
                    }
                }
            });
        }

        if let Some(output) = output_with {
            ts.extend(quote! {
                impl #i_gen aide::OperationOutput for #name #t_gen #w_gen {
                    type Inner = <#output as aide::OperationOutput>::Inner;
                    fn operation_response(
                        ctx: &mut aide::gen::GenContext,
                        operation: &mut aide::openapi::Operation
                    ) -> Option<aide::openapi::Response> {
                        <#output as aide::OperationOutput>::operation_response(
                            ctx,
                            operation
                        )
                    }
                    fn inferred_responses(
                        ctx: &mut aide::gen::GenContext,
                        operation: &mut aide::openapi::Operation
                    ) -> Vec<(Option<u16>, aide::openapi::Response)> {
                        <#output as aide::OperationOutput>::inferred_responses(
                            ctx,
                            operation
                        )
                    }
                }
            });
        }
    }

    ts.into()
}
