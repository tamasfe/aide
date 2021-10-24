//! This module contains helpers and extensions for definitions
//! that make the API nicer and easier to use.
use super::definition::*;

#[derive(Debug, Copy, Clone)]
pub enum OperationMethod {
    Get,
    Put,
    Post,
    Delete,
    Options,
    Head,
    Patch,
    Trace,
}

impl PartialEq<&str> for OperationMethod {
    fn eq(&self, other: &&str) -> bool {
        match self {
            OperationMethod::Get => other.to_lowercase() == "get",
            OperationMethod::Put => other.to_lowercase() == "put",
            OperationMethod::Post => other.to_lowercase() == "post",
            OperationMethod::Delete => other.to_lowercase() == "delete",
            OperationMethod::Options => other.to_lowercase() == "options",
            OperationMethod::Head => other.to_lowercase() == "head",
            OperationMethod::Patch => other.to_lowercase() == "patch",
            OperationMethod::Trace => other.to_lowercase() == "trace",
        }
    }
}

// FIXME: we use Vec to avoid unsafe IterMut, but it could probably be better
//        to use an own iterator to avoid allocations.
impl PathItem {
    /// Returns an operation by its method
    pub fn operation(&self, method: OperationMethod) -> Option<&Operation> {
        match method {
            OperationMethod::Get => self.get.as_ref(),
            OperationMethod::Put => self.put.as_ref(),
            OperationMethod::Post => self.post.as_ref(),
            OperationMethod::Delete => self.delete.as_ref(),
            OperationMethod::Options => self.options.as_ref(),
            OperationMethod::Head => self.head.as_ref(),
            OperationMethod::Patch => self.patch.as_ref(),
            OperationMethod::Trace => self.trace.as_ref(),
        }
    }

    /// Returns a mutable operation by its method
    pub fn operation_mut(&mut self, method: OperationMethod) -> &mut Option<Operation> {
        match method {
            OperationMethod::Get => &mut self.get,
            OperationMethod::Put => &mut self.put,
            OperationMethod::Post => &mut self.post,
            OperationMethod::Delete => &mut self.delete,
            OperationMethod::Options => &mut self.options,
            OperationMethod::Head => &mut self.head,
            OperationMethod::Patch => &mut self.patch,
            OperationMethod::Trace => &mut self.trace,
        }
    }

    /// Returns an iterator over the operations.
    pub fn operations(&self) -> impl Iterator<Item = (OperationMethod, &Operation)> {
        vec![
            (OperationMethod::Get, &self.get),
            (OperationMethod::Put, &self.put),
            (OperationMethod::Post, &self.post),
            (OperationMethod::Delete, &self.delete),
            (OperationMethod::Options, &self.options),
            (OperationMethod::Head, &self.head),
            (OperationMethod::Patch, &self.patch),
            (OperationMethod::Trace, &self.trace),
        ]
        .into_iter()
        .filter_map(|(m, o)| o.as_ref().map(|o| (m, o)))
    }

    /// Returns a mutable iterator over the operations.
    pub fn operations_mut(
        &mut self,
    ) -> impl Iterator<Item = (OperationMethod, &mut Option<Operation>)> {
        vec![
            (OperationMethod::Get, &mut self.get),
            (OperationMethod::Put, &mut self.put),
            (OperationMethod::Post, &mut self.post),
            (OperationMethod::Delete, &mut self.delete),
            (OperationMethod::Options, &mut self.options),
            (OperationMethod::Head, &mut self.head),
            (OperationMethod::Patch, &mut self.patch),
            (OperationMethod::Trace, &mut self.trace),
        ]
        .into_iter()
    }
}

impl OpenApi {
    /// Allows applying transform functions in a neat way.
    pub fn transform<T: FnOnce(Self) -> Self>(self, transform_fn: T) -> Self {
        transform_fn(self)
    }

    /// Same as `transform`, however allows for fallible operations that might
    /// return an error.
    pub fn try_transform<T: FnOnce(Self) -> Result<Self, E>, E: std::error::Error>(
        self,
        transform_fn: T,
    ) -> Result<Self, E> {
        transform_fn(self)
    }
}
