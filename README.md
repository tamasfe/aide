- [Aide](#aide)
  - [Crates](#crates)
    - [aide](#aide-1)
    - [axum-jsonschema](#axum-jsonschema)
    - [aide-axum-sqlx-tx](#aide-axum-sqlx-tx)
    - [aide-axum-typed-multipart](#aide-axum-typed-multipart)
  - [Contributing](#contributing)
  - [License](#license)
  - [Similar Libraries](#similar-libraries)

# Aide

[![https://img.shields.io/crates/v/aide](https://img.shields.io/crates/v/aide)](https://crates.io/crates/aide) [![https://img.shields.io/docsrs/aide](https://img.shields.io/docsrs/aide)](https://docs.rs/aide/latest/aide/)

A code-first API documentation and other utility libraries for Rust.

## Crates

This repository contains several crates related to web-servers and their documentation.

### aide

A code-first API documentation and utility library.

Read the [docs](https://docs.rs/aide/latest/aide/).

### axum-jsonschema

A JSON request validation library for [axum](https://github.com/tokio-rs/axum).

Read the [docs](https://docs.rs/axum-jsonschema/latest/axum_jsonschema/).

### [aide-axum-sqlx-tx](./crates/aide-axum-sqlx-tx/README.md)

> [!IMPORTANT]   
> the `axum-sqlx-tx` feature is deprecated and replaced by this crate.

Drop-in replacement for [`axum-sqlx-tx`](https://crates.io/crates/axum-sqlx-tx) compatible with aide.

### [aide-axum-typed-multipart](./crates/aide-axum-typed-multipart/README.md)

Drop-in replacement for [`axum-typed-multipart`](https://crates.io/crates/axum_typed_multipart) compatible with aide.

## Contributing

All contributions are welcome! Make sure to read [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

All code in this repository is dual licensed under [MIT](./LICENSE-MIT) and [Apache-2.0](./LICENSE-Apache).

## Similar Libraries

If Aide is not exactly what you are looking for, make sure to take a look at the alternatives:

- [paperclip](https://crates.io/crates/paperclip)
- [utoipa](https://github.com/juhaku/utoipa)
- [okapi](https://github.com/GREsau/okapi)
