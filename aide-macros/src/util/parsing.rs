use syn::{Path, PathArguments, Type};

macro_rules! path_segments {
    ($($ty:tt)::*) => {
        $crate::util::parsing::PathSegments::new(&[$(stringify!($ty)),*])
    };
    (::$($ty:tt)::*) => {
        $crate::util::parsing::PathSegments::new(&[$(stringify!($ty)),*])
    };
}

#[derive(Debug, Clone)]
pub struct PathSegments<'s>(&'s [&'s str]);

impl<'s> PathSegments<'s> {
    pub fn new(segments: &'s [&'s str]) -> Self {
        Self(segments)
    }
}

pub fn is_type(ty: &Type, segments: &PathSegments) -> bool {
    match ty {
        Type::Path(p) => is_path(&p.path, segments),
        Type::Reference(ty_ref) => {
            match &*ty_ref.elem {
                Type::Path(p) => is_path(&p.path, segments),
                _ => false, // FIXME: Nested references are not supported
            }
        }
        _ => false,
    }
}

pub fn is_path(p: &Path, segments: &PathSegments) -> bool {
    if segments.0.len() < p.segments.len() {
        return false;
    }

    let mut ty_segs = p.segments.iter().rev();

    for seg in segments.0.iter().rev() {
        match ty_segs.next() {
            Some(ty_seg) => {
                if ty_seg.ident != seg {
                    return false;
                }
            }
            None => return true,
        }
    }

    true
}

pub fn type_args(ty: &Type) -> Option<&PathArguments> {
    match ty {
        Type::Path(p) => p.path.segments.last().map(|s| &s.arguments),
        Type::Reference(ty_ref) => match &*ty_ref.elem {
            Type::Path(p) => p.path.segments.last().map(|s| &s.arguments),
            _ => None,
        },
        _ => None,
    }
}

pub fn is_option(ty: &Type) -> bool {
    is_type(ty, &path_segments!(::core::option::Option))
        || is_type(ty, &path_segments!(::std::option::Option))
}
