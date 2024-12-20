//! Transformers wrap a part of or the entirety of [`OpenApi`]
//! and enable modifications with method chaining in a declarative way.
//!
//! # Examples
//!
//! Example documentation for an imaginary government-provided API:
//!
//! ```ignore
//! op.description("An example operation.")
//!     .response_with::<200, Json<String>, _>(|res| {
//!         res.description(
//!             "Something was probably successful, we don't know \
//!                     what this returns, but it's at least JSON.",
//!         )
//!     })
//!     .response_with::<500, Html<String>, _>(|res| {
//!         res.description("Sometimes arbitrary 500 is returned with randomized HTML.")
//!     })
//!     .default_response::<String>()
//! ```
//!
//! # Transform Functions
//!
//! Transform functions are functions that accept a single
//! transformer as a parameter and return it. They
//! enable composability of documentation.
//!
//! ## Example
//!
//! ```rust
//! # use aide::transform::TransformOperation;
//! /// This transform function simply adds a no-content response as an example.
//! fn no_content(op: TransformOperation) -> TransformOperation {
//!     op.response::<204, ()>()
//! }
//! ```
//!
//! The above then can be (re)used using `with`.
//!
//! ```
//! # use aide::transform::TransformOperation;
//! # fn no_content(op: TransformOperation) -> TransformOperation {
//!     op.description("this operation always returns nothing")
//!         .with(no_content)
//! # }
//! ```
//!

use std::{any::type_name, marker::PhantomData};

use crate::{
    gen::GenContext,
    openapi::{
        Components, Contact, Info, License, OpenApi, Operation, Parameter, PathItem, ReferenceOr,
        Response, SecurityScheme, Server, StatusCode, Tag,
    },
    OperationInput,
};
use indexmap::IndexMap;
use serde::Serialize;

use crate::{error::Error, gen::in_context, operation::OperationOutput, util::iter_operations_mut};

/// A transform helper that wraps [`OpenApi`].
#[must_use]
pub struct TransformOpenApi<'t> {
    pub(crate) api: &'t mut OpenApi,
}

impl<'t> TransformOpenApi<'t> {
    /// Create a new transform helper.
    pub fn new(api: &'t mut OpenApi) -> Self {
        Self { api }
    }

    /// Set the title.
    #[tracing::instrument(skip_all)]
    pub fn title(self, title: &str) -> Self {
        self.api.info.title = title.into();
        self
    }

    /// Set the summary.
    #[tracing::instrument(skip_all)]
    pub fn summary(self, summary: &str) -> Self {
        self.api.info.summary = Some(summary.into());
        self
    }

    /// Set the terms of service.
    #[tracing::instrument(skip_all)]
    pub fn tos(self, tos: &str) -> Self {
        self.api.info.terms_of_service = Some(tos.into());
        self
    }

    /// Set the description.
    #[tracing::instrument(skip_all)]
    pub fn description(self, description: &str) -> Self {
        self.api.info.description = Some(description.into());
        self
    }

    /// Set the version.
    #[tracing::instrument(skip_all)]
    pub fn version(self, version: &str) -> Self {
        self.api.info.version = version.into();
        self
    }

    /// Set API contact information.
    #[tracing::instrument(skip_all)]
    pub fn contact(self, contact: Contact) -> Self {
        self.api.info.contact = Some(contact);
        self
    }

    /// Set API license information.
    #[tracing::instrument(skip_all)]
    pub fn license(self, license: License) -> Self {
        self.api.info.license = Some(license);
        self
    }

    /// Override all API information.
    #[tracing::instrument(skip_all)]
    pub fn info(self, info: Info) -> Self {
        self.api.info = info;
        self
    }

    /// Add a tag to the documentation.
    #[tracing::instrument(skip_all)]
    pub fn tag(self, tag: Tag) -> Self {
        self.api.tags.push(tag);
        self
    }

    /// Add a server to the documentation.
    #[tracing::instrument(skip_all)]
    pub fn server(self, server: Server) -> Self {
        self.api.servers.push(server);
        self
    }

    /// Set a default response for all operations
    /// that do not already have one.
    #[tracing::instrument(skip_all)]
    pub fn default_response<R>(self) -> Self
    where
        R: OperationOutput,
    {
        if let Some(p) = &mut self.api.paths {
            for (_, p) in &mut p.paths {
                let p = match p {
                    ReferenceOr::Reference { .. } => continue,
                    ReferenceOr::Item(p) => p,
                };

                let _ = TransformPathItem::new(p).default_response::<R>();
            }
        }

        self
    }

    /// Set a default response for all operations
    /// that do not already have one.
    ///
    /// This method additionally accepts a transform function
    /// to modify the generated documentation.
    #[tracing::instrument(skip_all)]
    pub fn default_response_with<R, F>(self, transform: F) -> Self
    where
        R: OperationOutput,
        F: Fn(TransformResponse<R::Inner>) -> TransformResponse<R::Inner> + Clone,
    {
        if let Some(p) = &mut self.api.paths {
            for (_, p) in &mut p.paths {
                let p = match p {
                    ReferenceOr::Reference { .. } => continue,
                    ReferenceOr::Item(p) => p,
                };

                for (_, op) in iter_operations_mut(p) {
                    let _ = TransformOperation::new(op)
                        .default_response_with::<R, F>(transform.clone());
                }
            }
        }

        self
    }

    /// Add a security scheme.
    #[allow(clippy::missing_panics_doc)]
    pub fn security_scheme(mut self, name: &str, scheme: SecurityScheme) -> Self {
        let components = match &mut self.inner_mut().components {
            Some(c) => c,
            None => {
                self.inner_mut().components = Some(Components::default());
                self.inner_mut().components.as_mut().unwrap()
            }
        };

        components
            .security_schemes
            .insert(name.into(), ReferenceOr::Item(scheme));

        self
    }

    /// Add a global security requirement.
    #[tracing::instrument(skip_all)]
    pub fn security_requirement(self, security_scheme: &str) -> Self {
        self.security_requirement_multi([security_scheme])
    }

    /// Add multiple global security requirement.
    #[tracing::instrument(skip_all)]
    pub fn security_requirement_multi<'a, I>(mut self, security_schemes: I) -> Self
    where
        I: IntoIterator<Item = &'a str> + Clone,
    {
        if self.inner_mut().security.iter().any(|s| {
            s.len() == security_schemes.clone().into_iter().count()
                && security_schemes
                    .clone()
                    .into_iter()
                    .all(|security_scheme| s.contains_key(security_scheme))
        }) {
            return self;
        }

        self.inner_mut().security.push(
            security_schemes
                .into_iter()
                .map(|security_scheme| (security_scheme.to_string(), Vec::new()))
                .collect(),
        );

        self
    }

    /// Add required scopes to a global security requirement.
    ///
    /// If the scheme requirement does not exist,
    /// it will be added.
    #[tracing::instrument(skip_all)]
    #[allow(clippy::missing_panics_doc)]
    pub fn security_requirement_scopes<I, S>(self, security_scheme: &str, scopes: I) -> Self
    where
        I: IntoIterator<Item = S>,
        S: Into<String>,
    {
        self.security_requirement_multi_scopes([security_scheme], scopes)
    }

    /// Add required scopes to multi global security requirement.
    ///
    /// If the scheme requirement does not exist,
    /// it will be added.
    #[tracing::instrument(skip_all)]
    #[allow(clippy::missing_panics_doc)]
    pub fn security_requirement_multi_scopes<'a, I, IS, S>(
        mut self,
        security_schemes: I,
        scopes: IS,
    ) -> Self
    where
        I: IntoIterator<Item = &'a str> + Clone,
        IS: IntoIterator<Item = S>,
        S: Into<String>,
    {
        match self.inner_mut().security.iter_mut().find(|s| {
            s.len() == security_schemes.clone().into_iter().count()
                && security_schemes
                    .clone()
                    .into_iter()
                    .all(|security_scheme| s.contains_key(security_scheme))
        }) {
            Some(s) => {
                let scopes: Vec<String> = scopes.into_iter().map(Into::into).collect();
                s.iter_mut().for_each(|(_, s)| s.extend(scopes.clone()));
            }
            None => {
                let scopes: Vec<String> = scopes.into_iter().map(Into::into).collect();
                self.inner_mut().security.push(
                    security_schemes
                        .into_iter()
                        .map(|security_scheme| (security_scheme.to_string(), scopes.clone()))
                        .collect(),
                );
            }
        };

        self
    }

    /// Apply an another transform function.
    pub fn with(self, transform: impl FnOnce(Self) -> Self) -> Self {
        transform(self)
    }

    /// Access the inner [`OpenApi`].
    #[inline]
    pub fn inner_mut(&mut self) -> &mut OpenApi {
        self.api
    }
}

/// A transform helper that wraps [`TransformPathItem`].
#[must_use]
pub struct TransformPathItem<'t> {
    pub(crate) hidden: bool,
    pub(crate) path: &'t mut PathItem,
}

impl<'t> TransformPathItem<'t> {
    /// Create a new transform helper.
    pub fn new(path: &'t mut PathItem) -> Self {
        Self {
            hidden: false,
            path,
        }
    }

    /// Hide the path from the documentation.
    ///
    /// This is taken into account by generators provided
    /// by this library.
    ///
    /// Hiding an item causes it to be ignored
    /// completely, there is no way to restore or "unhide" it afterwards.
    #[tracing::instrument(skip_all)]
    pub fn hidden(mut self, hidden: bool) -> Self {
        self.hidden = hidden;
        self
    }

    /// Provide a summary for the path.
    #[tracing::instrument(skip_all)]
    pub fn summary(self, desc: &str) -> Self {
        self.path.summary = Some(desc.into());
        self
    }

    /// Provide a description for the path.
    #[tracing::instrument(skip_all)]
    pub fn description(self, desc: &str) -> Self {
        self.path.description = Some(desc.into());
        self
    }

    /// Add a tag to all operations.
    #[tracing::instrument(skip_all)]
    pub fn tag(self, tag: &str) -> Self {
        for (_, op) in iter_operations_mut(self.path) {
            if !op.tags.iter().any(|t| t == tag) {
                op.tags.push(tag.into());
            }
        }

        self
    }

    /// Set a default response for all operations in the
    /// path that do not already have one.
    #[tracing::instrument(skip_all)]
    pub fn default_response<R>(self) -> Self
    where
        R: OperationOutput,
    {
        in_context(|ctx| ctx.show_error = filter_no_duplicate_response);

        for (_, op) in iter_operations_mut(self.path) {
            let _ = TransformOperation::new(op).default_response::<R>();
        }

        in_context(GenContext::reset_error_filter);

        self
    }

    /// Set a default response for all operations in the
    /// path that do not already have one.
    ///
    /// This method additionally accepts a transform function
    /// to modify the generated documentation.
    #[tracing::instrument(skip_all)]
    pub fn default_response_with<R, F>(self, transform: F) -> Self
    where
        R: OperationOutput,
        F: Fn(TransformResponse<R::Inner>) -> TransformResponse<R::Inner> + Clone,
    {
        in_context(|ctx| ctx.show_error = filter_no_duplicate_response);

        for (_, op) in iter_operations_mut(self.path) {
            let _ = TransformOperation::new(op).default_response_with::<R, F>(transform.clone());
        }

        in_context(GenContext::reset_error_filter);

        self
    }

    /// Add a security requirement for all operations.
    #[tracing::instrument(skip_all)]
    pub fn security_requirement(self, security_scheme: &str) -> Self {
        self.security_requirement_multi([security_scheme])
    }

    /// Add multi security requirement for all operations.
    #[tracing::instrument(skip_all)]
    pub fn security_requirement_multi<'a, I>(self, security_schemes: I) -> Self
    where
        I: IntoIterator<Item = &'a str> + Clone,
    {
        for (_, op) in iter_operations_mut(self.path) {
            let _ =
                TransformOperation::new(op).security_requirement_multi(security_schemes.clone());
        }

        self
    }

    /// Add required scopes to a security requirement for all operations.
    ///
    /// If the scheme requirement does not exist,
    /// it will be added.
    #[tracing::instrument(skip_all)]
    #[allow(clippy::missing_panics_doc)]
    pub fn security_requirement_scopes<I, S>(self, security_scheme: &str, scopes: I) -> Self
    where
        I: IntoIterator<Item = S>,
        S: Into<String>,
    {
        self.security_requirement_multi_scopes([security_scheme], scopes)
    }

    /// Add required scopes to a security requirement for all operations.
    ///
    /// If the scheme requirement does not exist,
    /// it will be added.
    #[tracing::instrument(skip_all)]
    #[allow(clippy::missing_panics_doc)]
    pub fn security_requirement_multi_scopes<'a, I, IS, S>(
        self,
        security_schemes: I,
        scopes: IS,
    ) -> Self
    where
        I: IntoIterator<Item = &'a str> + Clone,
        IS: IntoIterator<Item = S>,
        S: Into<String>,
    {
        let scopes: Vec<String> = scopes.into_iter().map(Into::into).collect();

        for (_, op) in iter_operations_mut(self.path) {
            let _ = TransformOperation::new(op)
                .security_requirement_multi_scopes(security_schemes.clone(), scopes.clone());
        }

        self
    }

    /// Apply an another transform function.
    pub fn with(self, transform: impl FnOnce(Self) -> Self) -> Self {
        transform(self)
    }

    /// Access the inner [`PathItem`].
    #[inline]
    pub fn inner_mut(&mut self) -> &mut PathItem {
        self.path
    }
}

/// A transform helper that wraps [`Operation`].
#[must_use]
pub struct TransformOperation<'t> {
    pub(crate) hidden: bool,
    pub(crate) operation: &'t mut Operation,
}

impl<'t> TransformOperation<'t> {
    /// Create a new transform helper.
    pub fn new(operation: &'t mut Operation) -> Self {
        Self {
            hidden: false,
            operation,
        }
    }

    /// Specify the operation ID.
    #[tracing::instrument(skip_all, fields(operation_id = ?self.operation.operation_id))]
    pub fn id(self, name: &str) -> Self {
        self.operation.operation_id = Some(name.into());
        self
    }

    /// Provide a summary for the operation.
    #[tracing::instrument(skip_all, fields(operation_id = ?self.operation.operation_id))]
    pub fn summary(self, desc: &str) -> Self {
        self.operation.summary = Some(desc.into());
        self
    }

    /// Provide a description for the operation.
    #[tracing::instrument(skip_all, fields(operation_id = ?self.operation.operation_id))]
    pub fn description(self, desc: &str) -> Self {
        self.operation.description = Some(desc.into());
        self
    }

    /// Add a tag to this operation.
    #[tracing::instrument(skip_all)]
    pub fn tag(self, tag: &str) -> Self {
        if !self.operation.tags.iter().any(|t| t == tag) {
            self.operation.tags.push(tag.into());
        }

        self
    }

    /// Hide the operation from the documentation.
    ///
    /// This is taken into account by generators provided
    /// by this library.
    ///
    /// Hiding an item causes it to be ignored
    /// completely, there is no way to restore or "unhide" it afterwards.
    #[tracing::instrument(skip_all, fields(operation_id = ?self.operation.operation_id))]
    pub fn hidden(mut self, hidden: bool) -> Self {
        self.hidden = hidden;
        self
    }

    /// Add input (parameters or request body) to the operation.
    ///
    /// The type parameter can be a single type
    /// or a tuple of types that implement [`OperationInput`].
    ///
    /// This function is automatically called for
    /// request handlers of supported web frameworks.
    #[tracing::instrument(skip_all, fields(operation_id = ?self.operation.operation_id))]
    pub fn input<T: OperationInput>(self) -> Self {
        in_context(|ctx| {
            T::operation_input(ctx, self.operation);
        });
        self
    }

    /// Modify a parameter of the operation.
    #[tracing::instrument(skip_all, fields(operation_id = ?self.operation.operation_id))]
    pub fn parameter<T, F>(self, name: &str, transform: F) -> Self
    where
        T: Serialize,
        F: FnOnce(TransformParameter<T>) -> TransformParameter<T>,
    {
        let (idx, param) = match self
            .operation
            .parameters
            .iter_mut()
            .enumerate()
            .find(|(_, p)| match p {
                ReferenceOr::Item(p) => p.parameter_data_ref().name == name,
                ReferenceOr::Reference { .. } => false,
            }) {
            Some((idx, p)) => match p {
                ReferenceOr::Item(p) => (idx, p),
                ReferenceOr::Reference { .. } => {
                    in_context(|ctx| {
                        ctx.error(Error::UnexpectedReference);
                    });
                    return self;
                }
            },
            None => {
                in_context(|ctx| {
                    ctx.error(Error::ParameterNotExists(name.to_string()));
                });
                return self;
            }
        };

        let t = transform(TransformParameter::new(param));

        if t.hidden {
            self.operation.parameters.remove(idx);
        }

        self
    }

    /// Modify a parameter of the operation without knowing a type.
    ///
    /// The type `()` will be used instead.
    #[tracing::instrument(skip_all, fields(operation_id = ?self.operation.operation_id))]
    pub fn parameter_untyped<F>(self, name: &str, transform: F) -> Self
    where
        F: FnOnce(TransformParameter<()>) -> TransformParameter<()>,
    {
        self.parameter(name, transform)
    }

    /// Set a default response for the operation if
    /// it does not already have one.
    #[tracing::instrument(skip_all, fields(operation_id = ?self.operation.operation_id))]
    #[allow(clippy::missing_panics_doc)]
    pub fn default_response<R>(self) -> Self
    where
        R: OperationOutput,
    {
        if self.operation.responses.is_none() {
            self.operation.responses = Some(Default::default());
        }

        in_context(|ctx| {
            if let Some(res) = R::operation_response(ctx, self.operation) {
                let responses = self.operation.responses.as_mut().unwrap();
                if responses.default.is_none() {
                    responses.default = Some(ReferenceOr::Item(res));
                } else {
                    ctx.error(Error::DefaultResponseExists);
                }
            } else {
                tracing::debug!(type_name = type_name::<R>(), "no response info of type");
            }
        });

        self
    }

    /// Set a default response for the operation if
    /// it does not already have one.
    ///
    /// This method additionally accepts a transform function
    /// to modify the generated documentation.
    #[tracing::instrument(skip_all, fields(operation_id = ?self.operation.operation_id))]
    #[allow(clippy::missing_panics_doc)]
    pub fn default_response_with<R, F>(self, transform: F) -> Self
    where
        R: OperationOutput,
        F: FnOnce(TransformResponse<R::Inner>) -> TransformResponse<R::Inner>,
    {
        in_context(|ctx| {
            if let Some(mut res) = R::operation_response(ctx, self.operation) {
                let responses = self
                    .operation
                    .responses
                    .get_or_insert_with(Default::default);
                if responses.default.is_none() {
                    let t = transform(TransformResponse::new(&mut res));

                    if !t.hidden {
                        responses.default = Some(ReferenceOr::Item(res));
                    }
                } else {
                    ctx.error(Error::DefaultResponseExists);
                }
            } else {
                tracing::debug!(type_name = type_name::<R>(), "no response info of type");
            }
        });

        self
    }

    /// Add a response to the operation with the given status code.
    #[tracing::instrument(skip_all, fields(operation_id = ?self.operation.operation_id))]
    #[allow(clippy::missing_panics_doc)]
    pub fn response<const N: u16, R>(self) -> Self
    where
        R: OperationOutput,
    {
        if self.operation.responses.is_none() {
            self.operation.responses = Some(Default::default());
        }

        in_context(|ctx| {
            if let Some(res) = R::operation_response(ctx, self.operation) {
                let responses = self.operation.responses.as_mut().unwrap();
                if responses
                    .responses
                    .insert(StatusCode::Code(N), ReferenceOr::Item(res))
                    .is_some()
                {
                    ctx.error(Error::ResponseExists(StatusCode::Code(N)));
                };
            } else {
                tracing::debug!(type_name = type_name::<R>(), "no response info of type");
            }
        });

        self
    }

    /// Add a response to the operation with the given status code.
    ///
    /// This method additionally accepts a transform function
    /// to modify the generated documentation.
    #[tracing::instrument(skip_all, fields(operation_id = ?self.operation.operation_id))]
    #[allow(clippy::missing_panics_doc)]
    pub fn response_with<const N: u16, R, F>(self, transform: F) -> Self
    where
        R: OperationOutput,
        F: FnOnce(TransformResponse<R::Inner>) -> TransformResponse<R::Inner>,
    {
        if self.operation.responses.is_none() {
            self.operation.responses = Some(Default::default());
        }

        in_context(|ctx| {
            if let Some(mut res) = R::operation_response(ctx, self.operation) {
                let t = transform(TransformResponse::new(&mut res));

                let responses = self.operation.responses.as_mut().unwrap();
                if !t.hidden {
                    let existing = responses
                        .responses
                        .insert(StatusCode::Code(N), ReferenceOr::Item(res))
                        .is_some();
                    if existing {
                        ctx.error(Error::ResponseExists(StatusCode::Code(N)));
                    };
                }
            } else {
                tracing::debug!(type_name = type_name::<R>(), "no response info of type");
            }
        });

        self
    }

    /// Add a response to the operation with the given status code range (e.g. 2xx).
    ///
    /// Note that the range is `100`-based, so for the range `2xx`, `2` must be provided.
    #[tracing::instrument(skip_all, fields(operation_id = ?self.operation.operation_id))]
    #[allow(clippy::missing_panics_doc)]
    pub fn response_range<const N: u16, R>(self) -> Self
    where
        R: OperationOutput,
    {
        if self.operation.responses.is_none() {
            self.operation.responses = Some(Default::default());
        }

        in_context(|ctx| {
            if let Some(res) = R::operation_response(ctx, self.operation) {
                let responses = self.operation.responses.as_mut().unwrap();
                if responses
                    .responses
                    .insert(StatusCode::Range(N), ReferenceOr::Item(res))
                    .is_some()
                {
                    ctx.error(Error::ResponseExists(StatusCode::Range(N)));
                };
            } else {
                tracing::debug!(type_name = type_name::<R>(), "no response info of type");
            }
        });

        self
    }

    /// Add a response to the operation with the given status code range (e.g. 2xx).
    ///
    /// Note that the range is `100`-based, so for the range `2xx`, `2` must be provided.
    ///
    /// This method additionally accepts a transform function
    /// to modify the generated documentation.
    #[tracing::instrument(skip_all, fields(operation_id = ?self.operation.operation_id))]
    #[allow(clippy::missing_panics_doc)]
    pub fn response_range_with<const N: u16, R, F>(self, transform: F) -> Self
    where
        R: OperationOutput,
        F: FnOnce(TransformResponse<R::Inner>) -> TransformResponse<R::Inner>,
    {
        if self.operation.responses.is_none() {
            self.operation.responses = Some(Default::default());
        }

        in_context(|ctx| {
            if let Some(mut res) = R::operation_response(ctx, self.operation) {
                let t = transform(TransformResponse::new(&mut res));

                let responses = self.operation.responses.as_mut().unwrap();
                if !t.hidden {
                    let existing = responses
                        .responses
                        .insert(StatusCode::Range(N), ReferenceOr::Item(res))
                        .is_some();
                    if existing {
                        ctx.error(Error::ResponseExists(StatusCode::Range(N)));
                    };
                }
            } else {
                tracing::debug!(type_name = type_name::<R>(), "no response info of type");
            }
        });

        self
    }

    /// Add a callback to the operation.
    #[tracing::instrument(skip_all, fields(operation_id = ?self.operation.operation_id))]
    #[allow(clippy::missing_panics_doc)]
    pub fn callback(
        self,
        callback_name: &str,
        callback_url: &str,
        callback_transform: impl FnOnce(TransformCallback) -> TransformCallback,
    ) -> Self {
        let callbacks = self
            .operation
            .callbacks
            .entry(callback_name.to_string())
            .or_insert_with(|| ReferenceOr::Item(IndexMap::default()));

        let callbacks = match callbacks {
            ReferenceOr::Reference { .. } => {
                in_context(|ctx| ctx.error(Error::UnexpectedReference));
                return self;
            }
            ReferenceOr::Item(cbs) => cbs,
        };

        let p = callbacks
            .entry(callback_url.to_string())
            .or_insert_with(|| ReferenceOr::Item(PathItem::default()));

        let p = match p {
            ReferenceOr::Reference { .. } => {
                in_context(|ctx| ctx.error(Error::UnexpectedReference));
                return self;
            }
            ReferenceOr::Item(p) => p,
        };

        let t = callback_transform(TransformCallback::new(p));

        if t.hidden {
            callbacks.swap_remove(callback_url);
            if self
                .operation
                .callbacks
                .get(callback_name)
                .unwrap()
                .as_item()
                .unwrap()
                .is_empty()
            {
                self.operation.callbacks.swap_remove(callback_name);
            }
        }

        self
    }

    /// Add a security requirement to the operation.
    #[tracing::instrument(skip_all, fields(operation_id = ?self.operation.operation_id))]
    pub fn security_requirement(self, security_scheme: &str) -> Self {
        self.security_requirement_multi([security_scheme])
    }

    /// Add multi security requirement to the operation.
    #[tracing::instrument(skip_all, fields(operation_id = ?self.operation.operation_id))]
    pub fn security_requirement_multi<'a, I>(self, security_schemes: I) -> Self
    where
        I: IntoIterator<Item = &'a str> + Clone,
    {
        if self.operation.security.iter().any(|s| {
            s.len() == security_schemes.clone().into_iter().count()
                && security_schemes
                    .clone()
                    .into_iter()
                    .all(|security_scheme| s.contains_key(security_scheme))
        }) {
            return self;
        }

        self.operation.security.push(
            security_schemes
                .into_iter()
                .map(|security_scheme| (security_scheme.to_string(), Vec::new()))
                .collect(),
        );

        self
    }

    /// Add required scopes to a security requirement.
    ///
    /// If the scheme requirement does not exist,
    /// it will be added.
    #[tracing::instrument(skip_all, fields(operation_id = ?self.operation.operation_id))]
    #[allow(clippy::missing_panics_doc)]
    pub fn security_requirement_scopes<I, S>(self, security_scheme: &str, scopes: I) -> Self
    where
        I: IntoIterator<Item = S>,
        S: Into<String>,
    {
        self.security_requirement_multi_scopes([security_scheme], scopes)
    }
    /// Add required scopes to multi security requirement.
    ///
    /// If the scheme requirement does not exist,
    /// it will be added.
    #[tracing::instrument(skip_all, fields(operation_id = ?self.operation.operation_id))]
    #[allow(clippy::missing_panics_doc)]
    pub fn security_requirement_multi_scopes<'a, I, IS, S>(
        self,
        security_schemes: I,
        scopes: IS,
    ) -> Self
    where
        I: IntoIterator<Item = &'a str> + Clone,
        IS: IntoIterator<Item = S>,
        S: Into<String>,
    {
        match self.operation.security.iter_mut().find(|s| {
            s.len() == security_schemes.clone().into_iter().count()
                && security_schemes
                    .clone()
                    .into_iter()
                    .all(|security_scheme| s.contains_key(security_scheme))
        }) {
            Some(s) => {
                let scopes: Vec<String> = scopes.into_iter().map(Into::into).collect();
                s.iter_mut().for_each(|(_, s)| s.extend(scopes.clone()));
            }
            None => {
                let scopes: Vec<String> = scopes.into_iter().map(Into::into).collect();
                self.operation.security.push(
                    security_schemes
                        .into_iter()
                        .map(|security_scheme| (security_scheme.to_string(), scopes.clone()))
                        .collect(),
                );
            }
        };

        self
    }

    /// Apply an another transform function.
    pub fn with(self, transform: impl FnOnce(Self) -> Self) -> Self {
        transform(self)
    }

    /// Access the inner [`Operation`].
    #[inline]
    pub fn inner_mut(&mut self) -> &mut Operation {
        self.operation
    }
}

/// A transform helper that wraps [`Parameter`].
///
/// An additional type is provided for strongly-typed
/// examples.
#[must_use]
pub struct TransformParameter<'t, T> {
    pub(crate) hidden: bool,
    pub(crate) param: &'t mut Parameter,
    _t: PhantomData<T>,
}

impl<'t, T> TransformParameter<'t, T> {
    /// Create a new transform helper.
    pub fn new(param: &'t mut Parameter) -> Self {
        Self {
            hidden: false,
            param,
            _t: PhantomData,
        }
    }

    /// Hide the parameter from the documentation.
    ///
    /// This is taken into account by generators provided
    /// by this library.
    ///
    /// Hiding an item causes it to be ignored
    /// completely, there is no way to restore or "unhide" it afterwards.
    #[tracing::instrument(skip_all)]
    pub fn hidden(mut self, hidden: bool) -> Self {
        self.hidden = hidden;
        self
    }

    /// Provide or override the description of the parameter.
    #[tracing::instrument(skip_all)]
    pub fn description(mut self, desc: &str) -> Self {
        let data = match &mut self.param {
            Parameter::Query { parameter_data, .. }
            | Parameter::Header { parameter_data, .. }
            | Parameter::Path { parameter_data, .. }
            | Parameter::Cookie { parameter_data, .. } => parameter_data,
        };
        data.description = Some(desc.into());
        self
    }

    /// Apply an another transform function.
    pub fn with(self, transform: impl FnOnce(Self) -> Self) -> Self {
        transform(self)
    }

    /// Access the inner [`Parameter`].
    #[inline]
    pub fn inner_mut(&mut self) -> &mut Parameter {
        self.param
    }
}

/// A transform helper that wraps [`Response`].
///
/// An additional type is provided for strongly-typed
/// examples.
#[must_use]
pub struct TransformResponse<'t, T> {
    pub(crate) hidden: bool,
    pub(crate) response: &'t mut Response,
    _t: PhantomData<T>,
}

impl<'t, T> TransformResponse<'t, T> {
    /// Create a new transform helper.
    pub fn new(response: &'t mut Response) -> Self {
        Self {
            hidden: false,
            response,
            _t: PhantomData,
        }
    }

    /// Hide the response from the documentation.
    ///
    /// This is taken into account by generators provided
    /// by this library.
    ///
    /// Hiding an item causes it to be ignored
    /// completely, there is no way to restore or "unhide" it afterwards.
    #[tracing::instrument(skip_all)]
    pub fn hidden(mut self, hidden: bool) -> Self {
        self.hidden = hidden;
        self
    }

    /// Provide or override the description of the response.
    #[tracing::instrument(skip_all)]
    pub fn description(self, desc: &str) -> Self {
        self.response.description = desc.into();
        self
    }

    /// Provide or override an example for the response.
    #[tracing::instrument(skip_all)]
    #[allow(clippy::missing_panics_doc)]
    pub fn example(self, example: impl Into<T>) -> Self
    where
        T: Serialize,
    {
        let example = example.into();

        for (_, c) in &mut self.response.content {
            c.example = Some(serde_json::to_value(&example).unwrap());
        }

        self
    }

    /// Apply an another transform function.
    pub fn with(self, transform: impl FnOnce(Self) -> Self) -> Self {
        transform(self)
    }

    /// Access the inner [`Response`].
    pub fn inner(&mut self) -> &mut Response {
        self.response
    }
}

/// A transform helper that wraps a callback [`PathItem`].
#[must_use]
pub struct TransformCallback<'t> {
    hidden: bool,
    path: &'t mut PathItem,
}

impl<'t> TransformCallback<'t> {
    /// Create a new transform helper.
    pub fn new(path: &'t mut PathItem) -> Self {
        Self {
            hidden: false,
            path,
        }
    }

    /// Hide the callback from the documentation.
    ///
    /// This is taken into account by generators provided
    /// by this library.
    ///
    /// Hiding an item causes it to be ignored
    /// completely, there is no way to restore or "unhide" it afterwards.
    pub fn hidden(mut self, hidden: bool) -> Self {
        self.hidden = hidden;
        self
    }

    /// Add a "delete" callback operation.
    #[allow(clippy::missing_panics_doc)]
    pub fn delete(self, operation: impl FnOnce(TransformOperation) -> TransformOperation) -> Self {
        let op = match &mut self.path.delete {
            Some(op) => op,
            None => {
                self.path.delete = Some(Operation::default());
                self.path.delete.as_mut().unwrap()
            }
        };

        let t = operation(TransformOperation::new(op));

        if t.hidden {
            self.path.delete = None;
        }

        self
    }

    /// Add a "get" callback operation.
    #[allow(clippy::missing_panics_doc)]
    pub fn get(self, operation: impl FnOnce(TransformOperation) -> TransformOperation) -> Self {
        let op = match &mut self.path.get {
            Some(op) => op,
            None => {
                self.path.get = Some(Operation::default());
                self.path.get.as_mut().unwrap()
            }
        };

        let t = operation(TransformOperation::new(op));

        if t.hidden {
            self.path.get = None;
        }

        self
    }

    /// Add a "head" callback operation.
    #[allow(clippy::missing_panics_doc)]
    pub fn head(self, operation: impl FnOnce(TransformOperation) -> TransformOperation) -> Self {
        let op = match &mut self.path.head {
            Some(op) => op,
            None => {
                self.path.head = Some(Operation::default());
                self.path.head.as_mut().unwrap()
            }
        };

        let t = operation(TransformOperation::new(op));

        if t.hidden {
            self.path.head = None;
        }

        self
    }

    /// Add a "options" callback operation.
    #[allow(clippy::missing_panics_doc)]
    pub fn options(self, operation: impl FnOnce(TransformOperation) -> TransformOperation) -> Self {
        let op = match &mut self.path.options {
            Some(op) => op,
            None => {
                self.path.options = Some(Operation::default());
                self.path.options.as_mut().unwrap()
            }
        };

        let t = operation(TransformOperation::new(op));

        if t.hidden {
            self.path.options = None;
        }

        self
    }

    /// Add a "patch" callback operation.
    #[allow(clippy::missing_panics_doc)]
    pub fn patch(self, operation: impl FnOnce(TransformOperation) -> TransformOperation) -> Self {
        let op = match &mut self.path.patch {
            Some(op) => op,
            None => {
                self.path.patch = Some(Operation::default());
                self.path.patch.as_mut().unwrap()
            }
        };

        let t = operation(TransformOperation::new(op));

        if t.hidden {
            self.path.patch = None;
        }

        self
    }

    /// Add a "post" callback operation.
    #[allow(clippy::missing_panics_doc)]
    pub fn post(self, operation: impl FnOnce(TransformOperation) -> TransformOperation) -> Self {
        let op = match &mut self.path.post {
            Some(op) => op,
            None => {
                self.path.post = Some(Operation::default());
                self.path.post.as_mut().unwrap()
            }
        };

        let t = operation(TransformOperation::new(op));

        if t.hidden {
            self.path.post = None;
        }

        self
    }

    /// Add a "put" callback operation.
    #[allow(clippy::missing_panics_doc)]
    pub fn put(self, operation: impl FnOnce(TransformOperation) -> TransformOperation) -> Self {
        let op = match &mut self.path.put {
            Some(op) => op,
            None => {
                self.path.put = Some(Operation::default());
                self.path.put.as_mut().unwrap()
            }
        };

        let t = operation(TransformOperation::new(op));

        if t.hidden {
            self.path.put = None;
        }

        self
    }

    /// Add a "trace" callback operation.
    #[allow(clippy::missing_panics_doc)]
    pub fn trace(self, operation: impl FnOnce(TransformOperation) -> TransformOperation) -> Self {
        let op = match &mut self.path.trace {
            Some(op) => op,
            None => {
                self.path.trace = Some(Operation::default());
                self.path.trace.as_mut().unwrap()
            }
        };

        let t = operation(TransformOperation::new(op));

        if t.hidden {
            self.path.trace = None;
        }

        self
    }

    /// Apply an another transform function.
    pub fn path(mut self, transform: impl FnOnce(TransformPathItem) -> TransformPathItem) -> Self {
        let t = transform(TransformPathItem::new(self.path));

        if t.hidden {
            self.hidden = true;
        }

        self
    }

    /// Apply an another transform function.
    pub fn with(self, transform: impl FnOnce(Self) -> Self) -> Self {
        transform(self)
    }
}

fn filter_no_duplicate_response(err: &Error) -> bool {
    !matches!(err, Error::DefaultResponseExists | Error::ResponseExists(_))
}
