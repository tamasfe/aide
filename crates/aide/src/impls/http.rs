use http::{request::Parts, HeaderMap, Method, Request, Uri, Version};

use crate::OperationInput;

impl<B> OperationInput for Request<B> {}
impl OperationInput for Method {}
impl OperationInput for Uri {}
impl OperationInput for Version {}
impl OperationInput for HeaderMap {}
impl OperationInput for Parts {}
