use http::{request::Parts, HeaderMap, Method, Request, Response, StatusCode, Uri, Version};

use crate::{OperationInput, OperationOutput};

impl<B> OperationInput for Request<B> {}
impl OperationInput for Method {}
impl OperationInput for Uri {}
impl OperationInput for Version {}
impl OperationInput for HeaderMap {}
impl OperationInput for Parts {}

impl<B> OperationOutput for Response<B> {
    type Inner = Self;
}

impl OperationOutput for StatusCode {
    type Inner = Self;
}
