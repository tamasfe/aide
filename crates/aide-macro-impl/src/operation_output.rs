use proc_macro2::TokenStream;
use quote::quote;
use syn::{DeriveInput, Expr};

/// Derive macro implementation for OperationOutput trait on enum response types
pub fn operation_output_impl(input: DeriveInput) -> Result<TokenStream, syn::Error> {
    let enum_name = &input.ident;
    let generics = &input.generics;
    let (impl_generics, ty_generics, where_clause) = generics.split_for_impl();

    // Ensure this is an enum
    let data_enum = match &input.data {
        syn::Data::Enum(data) => data,
        _ => {
            return Err(syn::Error::new_spanned(
                input,
                "OperationOutput can only be derived for enums",
            ));
        }
    };

    // Parse variants and extract status codes from attributes
    let mut variants_with_status: Vec<(syn::Ident, syn::Type, Option<Expr>)> = Vec::new();

    for variant in &data_enum.variants {
        // Ensure the variant is a tuple variant with exactly one field
        let field = match &variant.fields {
            syn::Fields::Unnamed(fields) if fields.unnamed.len() == 1 => &fields.unnamed[0],
            _ => {
                return Err(syn::Error::new_spanned(
                    variant,
                    "OperationOutput can only be derived for enums with tuple variants containing exactly one field",
                ));
            }
        };

        let variant_name = variant.ident.clone();
        let field_type = field.ty.clone();

        // Look for #[aide(status_code = ...)] attribute
        let mut status_code = None;
        for attr in &variant.attrs {
            if attr.path().is_ident("aide") {
                // Parse the attribute tokens directly to support both literals and const expressions
                let parsed = attr.parse_args_with(|input: syn::parse::ParseStream| {
                    // Parse: status_code = <expr>
                    let name: syn::Ident = input.parse()?;
                    if name == "status_code" {
                        let _eq: syn::Token![=] = input.parse()?;
                        let expr: Expr = input.parse()?;
                        Ok(Some(expr))
                    } else {
                        Ok(None)
                    }
                })?;

                if parsed.is_some() {
                    status_code = parsed;
                }
            }
        }

        variants_with_status.push((variant_name, field_type, status_code));
    }

    // Determine if this is a single-variant enum (with only one error type)
    let is_single_variant = variants_with_status.len() == 1;

    // Generate the implementation
    let operation_response_impl = if is_single_variant {
        let (_, field_type, _) = &variants_with_status[0];
        quote! {
            fn operation_response(
                ctx: &mut ::aide::generate::GenContext,
                operation: &mut ::aide::openapi::Operation,
            ) -> Option<::aide::openapi::Response> {
                <#field_type as ::aide::OperationOutput>::operation_response(ctx, operation)
            }
        }
    } else {
        quote! {
            fn operation_response(
                _ctx: &mut ::aide::generate::GenContext,
                _operation: &mut ::aide::openapi::Operation,
            ) -> Option<::aide::openapi::Response> {
                // For enum responses with multiple variants, we return None here
                // and let inferred_responses handle it
                None
            }
        }
    };

    let inferred_responses_impl = if is_single_variant {
        let (_, field_type, _) = &variants_with_status[0];
        quote! {
            fn inferred_responses(
                ctx: &mut ::aide::generate::GenContext,
                operation: &mut ::aide::openapi::Operation,
            ) -> Vec<(Option<::aide::openapi::StatusCode>, ::aide::openapi::Response)> {
                <#field_type as ::aide::OperationOutput>::inferred_responses(ctx, operation)
            }
        }
    } else {
        let response_arms = variants_with_status.iter().map(|(_variant_name, field_type, status_code)| {
            if let Some(code) = status_code {
                // If status_code attribute is provided, use it and get the response from operation_response
                quote! {
                    if let Some(err_resp) = <#field_type as ::aide::OperationOutput>::operation_response(ctx, operation) {
                        responses.push((
                            Some(::aide::openapi::StatusCode::Code(#code)),
                            err_resp,
                        ));
                    }
                }
            } else {
                // If no status_code attribute, use the type's inferred_responses
                quote! {
                    responses.extend(<#field_type as ::aide::OperationOutput>::inferred_responses(ctx, operation));
                }
            }
        });

        quote! {
            fn inferred_responses(
                ctx: &mut ::aide::generate::GenContext,
                operation: &mut ::aide::openapi::Operation,
            ) -> Vec<(Option<::aide::openapi::StatusCode>, ::aide::openapi::Response)> {
                let mut responses = Vec::new();
                #(#response_arms)*
                responses
            }
        }
    };

    Ok(quote! {
        impl #impl_generics ::aide::OperationOutput for #enum_name #ty_generics #where_clause {
            type Inner = Self;

            #operation_response_impl

            #inferred_responses_impl
        }
    })
}
