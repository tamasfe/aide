#![allow(clippy::all, clippy::pedantic, missing_docs, dead_code)]
//! Miscellaneous utilities.

use std::borrow::Cow;

use crate::{
    gen::GenContext,
    openapi::{Operation, PathItem},
    Error,
};

/// Transform colon path params to the notation
/// used in `OpenApi`.
///
/// Axum wildcard routes are not supported by OpenAPI 3 but will be indicated as a param with a trailing `+` 
/// 
/// # Examples
///
/// The path `/users/:id` is turned into `/users/{id}`.
/// The path `/:id/:repo/*tree` is turned into `/{id}/{repo}/{tree+}`.

#[must_use]
pub fn path_colon_params(s: &str) -> Cow<str> {
    if !s.contains(':') {
        return s.into();
    }

    let mut rewritten = String::with_capacity(s.len());

    #[derive(Clone, Copy)]
    enum State {
        None,
        WasParam,
        WasWildcard
    }
    let mut state = State::None;
    for c in s.chars() {
        match (state, c) {
            (State::None, ':') => {
                rewritten.push('{');
                state = State::WasParam;
            }
            (State::WasParam, '/') => {
                rewritten.push('}');
                rewritten.push(c);
                state = State::None;
            }
            (_, '*') => {
                rewritten.push('{');
                state = State::WasWildcard;
            },
            (_, _) => {
                rewritten.push(c);
            }
        }
    }

    match state {
        State::WasParam => {
            rewritten += "}"
        },
        State::WasWildcard => {
            rewritten += "+}"
        }
        _=> {}
    }

    rewritten.into()
}

/// Iterate over all operations in a path item.
pub fn iter_operations_mut(
    path: &mut PathItem,
) -> impl Iterator<Item = (&'static str, &mut Operation)> {
    let mut vec = Vec::with_capacity(8);

    if let Some(op) = path.get.as_mut() {
        vec.push(("get", op));
    }
    if let Some(op) = path.put.as_mut() {
        vec.push(("put", op));
    }
    if let Some(op) = path.post.as_mut() {
        vec.push(("post", op));
    }
    if let Some(op) = path.delete.as_mut() {
        vec.push(("delete", op));
    }
    if let Some(op) = path.options.as_mut() {
        vec.push(("options", op));
    }
    if let Some(op) = path.head.as_mut() {
        vec.push(("head", op));
    }
    if let Some(op) = path.patch.as_mut() {
        vec.push(("patch", op));
    }
    if let Some(op) = path.trace.as_mut() {
        vec.push(("trace", op));
    }

    vec.into_iter()
}

pub(crate) fn merge_paths(ctx: &mut GenContext, path: &str, target: &mut PathItem, from: PathItem) {
    if let Some(op) = from.get {
        if target.get.is_some() {
            ctx.error(Error::OperationExists(path.to_string(), "get"));
        } else {
            target.get = Some(op);
        }
    }
    if let Some(op) = from.put {
        if target.put.is_some() {
            ctx.error(Error::OperationExists(path.to_string(), "put"));
        } else {
            target.put = Some(op);
        }
    }
    if let Some(op) = from.post {
        if target.post.is_some() {
            ctx.error(Error::OperationExists(path.to_string(), "post"));
        } else {
            target.post = Some(op);
        }
    }
    if let Some(op) = from.delete {
        if target.delete.is_some() {
            ctx.error(Error::OperationExists(path.to_string(), "delete"));
        } else {
            target.delete = Some(op);
        }
    }
    if let Some(op) = from.options {
        if target.options.is_some() {
            ctx.error(Error::OperationExists(path.to_string(), "options"));
        } else {
            target.options = Some(op);
        }
    }
    if let Some(op) = from.head {
        if target.head.is_some() {
            ctx.error(Error::OperationExists(path.to_string(), "head"));
        } else {
            target.head = Some(op);
        }
    }
    if let Some(op) = from.patch {
        if target.patch.is_some() {
            ctx.error(Error::OperationExists(path.to_string(), "patch"));
        } else {
            target.patch = Some(op);
        }
    }
    if let Some(op) = from.trace {
        if target.trace.is_some() {
            ctx.error(Error::OperationExists(path.to_string(), "trace"));
        } else {
            target.trace = Some(op);
        }
    }

    if let Some(new_desc) = from.description {
        match &mut target.description {
            Some(desc) => {
                desc.push('\n');
                desc.push_str(&new_desc);
            }
            None => target.description = Some(new_desc),
        }
    }

    if let Some(new_summary) = from.summary {
        match &mut target.summary {
            Some(summary) => {
                summary.push('\n');
                summary.push_str(&new_summary);
            }
            None => target.summary = Some(new_summary),
        }
    }
    target.parameters.extend(from.parameters);
    target.extensions.extend(from.extensions);
}

// FIXME: remove the code below when the upstream openapiv3 3.1 is available.
pub(crate) use spec::*;
mod spec {
    use std::hash::Hash;
    use std::marker::PhantomData;

    use indexmap::IndexMap;
    use serde::{
        de::{IgnoredAny, Visitor},
        Deserialize, Deserializer,
    };

    #[allow(clippy::trivially_copy_pass_by_ref)] // needs to match signature for use in serde attribute
    #[inline]
    pub(crate) const fn is_false(v: &bool) -> bool {
        !(*v)
    }

    pub(crate) fn deserialize_extensions<'de, D>(
        deserializer: D,
    ) -> Result<IndexMap<String, serde_json::Value>, D::Error>
    where
        D: Deserializer<'de>,
    {
        deserializer.deserialize_map(PredicateVisitor(
            |key: &String| key.starts_with("x-"),
            PhantomData,
        ))
    }

    /// Used to deserialize IndexMap<K, V> that are flattened within other structs.
    /// This only adds keys that satisfy the given predicate.
    pub(crate) struct PredicateVisitor<F, K, V>(pub F, pub PhantomData<(K, V)>);

    impl<'de, F, K, V> Visitor<'de> for PredicateVisitor<F, K, V>
    where
        F: Fn(&K) -> bool,
        K: Deserialize<'de> + Eq + Hash,
        V: Deserialize<'de>,
    {
        type Value = IndexMap<K, V>;

        fn expecting(&self, formatter: &mut std::fmt::Formatter) -> std::fmt::Result {
            formatter.write_str("a map whose fields obey a predicate")
        }

        fn visit_map<A>(self, mut map: A) -> Result<Self::Value, A::Error>
        where
            A: serde::de::MapAccess<'de>,
        {
            let mut ret = Self::Value::default();

            loop {
                match map.next_key::<K>() {
                    Err(_) => (),
                    Ok(None) => break,
                    Ok(Some(key)) if self.0(&key) => {
                        let _ = ret.insert(key, map.next_value()?);
                    }
                    Ok(Some(_)) => {
                        let _ = map.next_value::<IgnoredAny>()?;
                    }
                }
            }

            Ok(ret)
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_path_colon_params() {
        assert_eq!(path_colon_params("/users/:id"), "/users/{id}");
        assert_eq!(path_colon_params("/users/:id/addresses/:address-id"), "/users/{id}/addresses/{address-id}");        
        assert_eq!(path_colon_params("/:id/:repo/*tree"), "/{id}/{repo}/{tree+}");
    }
}
