use std::collections::HashSet;

use proc_macro2::{TokenStream, TokenTree};
use proc_macro_error::{abort, emit_error};
use quote::{ToTokens, TokenStreamExt};
use syn::{
    ext::IdentExt, parenthesized, parse::discouraged::Speculative, parse::Parse,
    punctuated::IntoIter, punctuated::Punctuated, spanned::Spanned, token, Ident, Token,
};

#[derive(Debug, Clone)]
pub enum AttrNamedValue {
    Eq {
        eq: Token!(=),
        content: TokenStream,
    },
    Parens {
        parens: token::Paren,
        content: TokenStream,
    },
}

impl AttrNamedValue {
    pub fn parse<T: Parse>(self) -> syn::Result<T> {
        match self {
            AttrNamedValue::Eq { content, .. } => syn::parse2(content),
            AttrNamedValue::Parens { content, .. } => syn::parse2(content),
        }
    }
}

impl ToTokens for AttrNamedValue {
    fn to_tokens(&self, tokens: &mut TokenStream) {
        match self {
            AttrNamedValue::Eq { content, eq } => {
                eq.to_tokens(tokens);
                content.to_tokens(tokens);
            }
            AttrNamedValue::Parens { content, parens } => {
                parens.surround(tokens, |tokens| {
                    content.to_tokens(tokens);
                });
            }
        }
    }
}

/// An attribute parameter such as `foo = "bar"`, or `foo`, or `foo(bar)`.
#[derive(Debug, Clone)]
pub enum AttrParam {
    Named { name: Ident, value: AttrNamedValue },
    Unnamed(TokenStream),
}

impl AttrParam {
    pub fn parse<T: Parse>(self) -> syn::Result<T> {
        match self {
            AttrParam::Named { value, .. } => value.parse(),
            AttrParam::Unnamed(ts) => syn::parse2(ts),
        }
    }
}

impl ToTokens for AttrParam {
    fn to_tokens(&self, tokens: &mut TokenStream) {
        match self {
            AttrParam::Named { name, value } => {
                name.to_tokens(tokens);
                value.to_tokens(tokens);
            }
            AttrParam::Unnamed(ts) => ts.to_tokens(tokens),
        }
    }
}

impl Parse for AttrParam {
    fn parse(input: syn::parse::ParseStream) -> syn::Result<Self> {
        let named_input = input.fork();

        if let Ok(name) = named_input.call(Ident::parse_any) {
            if named_input.peek(token::Paren) {
                let inner;
                let parens = parenthesized!(inner in named_input);
                let content = inner.parse()?;
                input.advance_to(&named_input);
                return Ok(AttrParam::Named {
                    name,
                    value: AttrNamedValue::Parens { parens, content },
                });
            } else if named_input.peek(Token!(=)) {
                let eq = named_input.parse::<Token!(=)>()?;
                input.advance_to(&named_input);
                return Ok(AttrParam::Named {
                    name,
                    value: AttrNamedValue::Eq {
                        eq,
                        content: parse_until_comma(input),
                    },
                });
            }
        }

        Ok(AttrParam::Unnamed(parse_until_comma(input)))
    }
}

#[derive(Debug, Clone)]
pub struct AttrParams(Punctuated<AttrParam, Token!(,)>);

impl ToTokens for AttrParams {
    fn to_tokens(&self, tokens: &mut TokenStream) {
        for attr in &self.0 {
            attr.to_tokens(tokens);
        }
    }
}

impl Parse for AttrParams {
    fn parse(input: syn::parse::ParseStream) -> syn::Result<Self> {
        Ok(Self(Punctuated::<AttrParam, Token!(,)>::parse_terminated(
            input,
        )?))
    }
}

#[allow(dead_code)]
impl AttrParams {
    pub fn is_empty(&self) -> bool {
        self.0.is_empty()
    }

    pub fn len(&self) -> usize {
        self.0.len()
    }

    pub fn iter(&self) -> impl Iterator<Item = &AttrParam> {
        self.0.iter()
    }

    /// Shows compile errors for duplicate names.
    pub fn no_duplicates(&self) {
        self.no_duplicates_by(|_| true)
    }

    /// f should return true if the ident is not allowed to be a duplicate.
    pub fn no_duplicates_by<F: Fn(&Ident) -> bool>(&self, f: F) {
        let mut names: HashSet<&Ident> = HashSet::new();
        for attr in &self.0 {
            if let AttrParam::Named { name, .. } = attr {
                if let Some(existing) = names.get(name) {
                    if f(name) {
                        emit_error!(existing.span(), r#"parameter "{}" is given here"#, name);
                        abort!(name.span(), r#"parameter "{}" already exists"#, name);
                    }
                }
                names.insert(name);
            }
        }
    }

    pub fn retain_known<F: Fn(&Ident) -> bool>(&self, f: F) {
        for attr in &self.0 {
            if let AttrParam::Named { name, .. } = attr {
                if !f(name) {
                    abort!(name.span(), r#"unknown parameter "{}""#, name);
                }
            }
        }
    }

    pub fn has_named(&self) -> bool {
        for attr in &self.0 {
            if let AttrParam::Named { .. } = attr {
                return true;
            }
        }
        false
    }

    pub fn no_unnamed(&self) {
        if !self.has_named() {
            abort!(self.span(), r#"only named parameters are expected"#);
        }
    }

    /// Shows compile errors if named parameters are mixed with unnamed ones.
    pub fn no_names_mixed(&self) {
        let mut named: Option<bool> = None;
        for attr in &self.0 {
            match attr {
                AttrParam::Named { name, .. } => {
                    if let Some(named) = &named {
                        if !*named {
                            abort!(
                                name.span(),
                                r#"named and unnamed parameters cannot be mixed"#
                            );
                        }
                    }
                    named = Some(true);
                }
                AttrParam::Unnamed(content) => {
                    if let Some(named) = &named {
                        if *named {
                            abort!(
                                content.span(),
                                r#"named and unnamed parameters cannot be mixed"#
                            );
                        }
                    }
                    named = Some(false);
                }
            }
        }
    }
}

impl IntoIterator for AttrParams {
    type Item = AttrParam;
    type IntoIter = IntoIter<AttrParam>;

    fn into_iter(self) -> Self::IntoIter {
        self.0.into_iter()
    }
}

fn parse_until_comma(input: syn::parse::ParseStream) -> TokenStream {
    let mut ts = TokenStream::new();
    input
        .step(|cursor| {
            let mut rest = *cursor;
            while let Some((tt, next)) = rest.token_tree() {
                match &tt {
                    TokenTree::Punct(punct) if punct.as_char() == ',' => {
                        return Ok(((), rest));
                    }
                    tt => {
                        ts.append(tt.clone());
                        rest = next
                    }
                }
            }
            Ok(((), rest))
        })
        .unwrap();
    ts
}
