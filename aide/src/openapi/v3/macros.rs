pub mod api {
    pub use aide_macros::Model;
    pub use aide_macros::openapi_v3_operation as operation;

    pub mod define {
        pub use aide_macros::openapi_v3_define_tag as tag;
    }
}
