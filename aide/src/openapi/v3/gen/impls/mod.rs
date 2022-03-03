use super::OperationOutput;

#[cfg(feature = "actix-web")]
mod actix_web;
mod misc;

impl<T, E> OperationOutput for Result<T, E>
where
    T: OperationOutput,
{
    fn operation_output(
        opts: &super::Options,
        id: &'static str,
        position: super::item::Position,
        route: super::item::Route,
    ) -> Option<super::item::Item> {
        T::operation_output(opts, id, position, route)
    }
}
