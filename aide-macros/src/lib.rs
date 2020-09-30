extern crate proc_macro;

use openapi_v3::model::Model;
use openapi_v3::operation::Operation;
use proc_macro::TokenStream;
use proc_macro2::Span;
use proc_macro_error::{abort, proc_macro_error};
use quote::quote;
use syn::{parse_macro_input, Item};

#[macro_use]
mod util;

mod openapi_v3;

#[proc_macro_error]
#[proc_macro_attribute]
pub fn openapi_v3_model(_args: TokenStream, input: TokenStream) -> TokenStream {
    let model = parse_macro_input!(input as Model);
    (quote! {#model}).into()
}

#[proc_macro_error]
#[proc_macro_attribute]
pub fn openapi_v3_operation(_args: TokenStream, input: TokenStream) -> TokenStream {
    let op = parse_macro_input!(input as Operation);
    (quote! {#op}).into()
}

#[proc_macro_error]
#[proc_macro_attribute]
pub fn openapi_v3_api(_args: TokenStream, input: TokenStream) -> TokenStream {
    let item = parse_macro_input!(input as Item);
    match item {
        Item::Enum(_) | Item::Struct(_) => {
            let model = Model::from_item(item).unwrap_or_else(|e| abort!(e));
            (quote!(#model)).into()
        }
        Item::Fn(_) => {
            let op = Operation::from_item(item).unwrap_or_else(|e| abort!(e));
            (quote!(#op)).into()
        }
        _ => abort!(Span::call_site(), "unsupported item"),
    }
}
