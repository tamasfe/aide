# Changelog

## 0.13.2 - 2024-01-22

[3fed0f6](3fed0f6d5f2b2aa8cb7f9dfda738c652c8894fd8)...[ed3e3f7](ed3e3f76c7bdce39d7aea30fe7fdad4ac544e96c)

### Features

- Add scalar integration (alternative to Redoc) ([#104](https://github.com/tamasfe/aide/issues/104)) ([a26533e](a26533e94e50699d6157f45617f6f67cbe9df92f))

### Miscellaneous Tasks

- Updated CHANGELOG.md ([be3b6d7](be3b6d77c21d94e67d45428f534db75c6be3bd98))
- Bumped version ([ed3e3f7](ed3e3f76c7bdce39d7aea30fe7fdad4ac544e96c))

## 0.13.1 - 2023-12-18

[24ffb72](24ffb728f63530e03fd60945db1a1da52c6821a5)...[3fed0f6](3fed0f6d5f2b2aa8cb7f9dfda738c652c8894fd8)

### Bug Fixes

- Fix inconsistency in extracting schema and cause redoc to crash ([f2beabc](f2beabcefb6e88186e10b8a117f8da020a63f670))

### Miscellaneous Tasks

- Bump version to 0.13.1 ([3fed0f6](3fed0f6d5f2b2aa8cb7f9dfda738c652c8894fd8))

## 0.13.0 - 2023-12-09

[77d4a37](77d4a377b01ca69f5ac374b6e0c57d2c53453707)...[413003e](413003eec52dfe4ed14fa6fec19ae8dee01a9c86)

### Bug Fixes

- Fixed doctest ([07e4cf2](07e4cf2fcbb1ba29dcf5787affba18b30d2d2bd1))
- Re-enabled axum-headers feature (was a breaking change) ([ff47ee6](ff47ee6801b3aea227c03eb8791e2e933371c7e8))

### Documentation

- Added readme ([a4a1bff](a4a1bff8df6bd5e7377982b22828e847c8277df4))
- Linked readme to docs.rs ([1297626](12976263acdac24f82e084b3c9d50b7e74863791))

### Features

- Added `UseApi` and `into_api::<T>()` which is made to use existing types for documenting types that do not implement aide types ([c3087b8](c3087b8ed0de75fe122ae9ed8a4e65164a738db0))
- Axum 0.7 support ([16de786](16de786abeb99514d4e408e98693be7cd5b5ee1a))
- BREAKING, infer responses and disable schema inlining by default ([808a48b](808a48bc524b47e0cbf20264dd8c62f16554f2f9))
- Sync axum router differences ([66c88fc](66c88fc24f4bab6bf2b9452b6575314f8336bfb6))
- Moved TypedHeaders from axum to axum_extra ([61c7aef](61c7aef71b647b51c3269fd45b045be6773c206a))

### Miscellaneous Tasks

- Added crates metadata ([b245f08](b245f088dbe6288b6004d513f70bb56bcec5fbfb))

## 0.12.0 - 2023-09-23

[b8ef557](b8ef557288dac5e010b03505216ebfac293c5c88)...[b8ef557](b8ef557288dac5e010b03505216ebfac293c5c88)

### Bug Fixes

- Do not panic inside transform ([2ec0585](2ec0585b30a049179b37ced17f36ce3e1d4f675a))
- Implement JsonSchema for OpenApi ([9cce0d6](9cce0d6cfb0f4c44be659e8b04ecb7f1ace01eee))
- Axum router nesting with different state ([a67ad80](a67ad80851f70171fd67e058aba0de48d050613b)), closes #2
- Resolve schema references during gen ([be0a66c](be0a66cd30f36e30f435d9c6f31673e682142492)), closes #4
- Use correct no content status code ([c40ddaf](c40ddaf106c87dfe55a2d3fc316f85108d4c9029))
- Missing inferred responses ([e3fe288](e3fe2882aa10a87f7334948c1de9a00c5d96b008))
- Added missing inferred responses ([861e92a](861e92a23977ed5621c46475552aea3e16bcc464)), Add:default response.
- Loosen requirements ([1fc8da3](1fc8da3d8d2c9fe3e5d670c0171c18aefbdf290e))
- Remove recursive borrows, fixes #21 ([76705a4](76705a4f12702497aa9380fc89e1ffa995913162))
- Remove Clone restriction on Router generics, fixes #19 ([4c41fa0](4c41fa0f7d2f559bb49b4b7f9a20cbfa5167248e))
- `nest_api_service` will no longer accept arbitrary services. ([e6c5b46](e6c5b46ed9ff1226cfc4d8c183e8b6c773308c0f))
- Several fixes ([ac6549a](ac6549ad8b15d0ccc0e2e3cebcbde64b3f55ae31))
- Redoc router state ([daaf060](daaf060f5c22b63b986e327792ae5b367b4db578))
- Add support for Redirect axum response ([f9a67f8](f9a67f80f36a67ee8d2c9f1d5851c537ff3041c9))
- Fix typo in response_range() method ([f949aed](f949aedcad1d89cd5dd1f680c8d5292d55b1da1f))
- Fixed api_route_with overriding existing routes ([#40](https://github.com/tamasfe/aide/issues/40)) ([879e436](879e436e3506c85d4b3cf12012acaf76501d82ba))
- Fix serde_version::deserialize implementation for openapi field ([0cb7cd8](0cb7cd80152fc4fc170a407a3ac4ef4c4581c05d))
- Fix compiler and clippy warnings ([27029a1](27029a1075bd0130c92dac792aa2eb12012a409c))
- Conflicting router merge due to shallow merge ([69a47f3](69a47f330056defd6debd5c8440c186f87c851e8))

### Features

- Arbitrary error variant ([cbc5c4e](cbc5c4ecc41dc900a96b06c9d08aea23892f551c))
- Add tag and summary transforms ([4a67561](4a6756138b0cc82788bf640d21c8565581c702fd))
- Added callbacks ([9c59f3d](9c59f3de6bb97907b9e8e00c3b8a153c4b3da1be))
- Add input to operation transform ([66cbfad](66cbfad9985dfedce97e7afc0b6301d11a63b1b9))
- Schema extraction ([2f1528d](2f1528d8512b14192158c7fc2fe6c923b8d46702))
- Added auth support ([fa9f427](fa9f427bb59d13e713723510086992cfed065333))
- Methods for OpenApi transform helper ([b8f98b3](b8f98b3f22a4f08aeca4fcf61968f8a757c3c0bf))
- **breaking** it is possible to disable schema extraction ([740d77c](740d77cde273c6940d403f2e4adf9b8751fe2669))
- Response inference from handler return types ([675ea2a](675ea2a15f9e87ad6ca503d7101e5ceec82ef857))
- Update to axum rc.4 ([337d911](337d9119796579fe650c003107d2260452f623d6))
- Add layer ([4b42cd2](4b42cd21abb571a7e10fa3c1e7087a3065e84545))
- Add axum redoc ui wrapper ([2e96bdc](2e96bdc4da12427ef7007e0ca6e103eb48495619))
- Update to axum 0.6.0-rc.5 ([659bdf5](659bdf51ef8b094019ffd493be91f1598cb5b646)), BREAKING CHANGE:Require using `nest_api_service` instead of `nest_service` or `nest` to propagate
the API documentation. Also propagate changes to `with_state` from axum 0.6.0-rc.5.
- Impl OperationOutput for axum Rejections by yassun4dev ([4b666e1](4b666e13c4bce143e8cf740117f8644a0741f782)), Suggestion:impl OperationOutput for Rejections.
- Axum 0.6.0 ([5a06b52](5a06b52b11626104c64f4a7ba6220a4e6a1d84ab))
- Vendor Redoc ([53787e6](53787e60357bd97b777989d5c62a697ee646b085))
- Inferred responses for operation input ([a2981e1](a2981e1b65831c945df540820721e60910086443))
- Match more closely axum's API for MethodRouter ([73b5f74](73b5f74c005d811fb224cf7a4271caa1aac9eab3))
- Add skip_serializing_defaults feature ([3ffc96b](3ffc96b166e7abdbc1c56e823edb7e60fae86745))
- Added axum serde_qs support ([3e0e810](3e0e8107e3eea25e5c6f8280030b58013cfbf034))
- Add support for Option and Result inputs ([6156f77](6156f77637ee09b02ba99b61df02dee9fb53c693))
- Add `with_path_items` method to `ApiRouter` ([090b5f0](090b5f04f3d0eaa33c75fdf96009264bb78770d0))
- Implement `merge` on ApiMethodRouter ([e6e9af3](e6e9af320757130074ca9cd537d342b5496d527d))
- Introduce security_requirement_multi ([ca5bc4e](ca5bc4e8dd05aed2facb274b7a2f11d48c02ad59))
- Add version and server methods ([54783f5](54783f5b2ad91f8527ba12ae21b26fbc1d794a8d))
- Add more blanket tuple impls of OperationOutput ([#37](https://github.com/tamasfe/aide/issues/37)) ([461cd5f](461cd5f9f9e9f4363b17d79b883530c0d60b546e))
- Add with_path_items method to ApiRouter ([#47](https://github.com/tamasfe/aide/issues/47)) ([47acb19](47acb1965b43508f616a7e3cb5bc37e9e36007c2))
- Implement `merge` on `ApiMethodRouter` ([#52](https://github.com/tamasfe/aide/issues/52)) ([2c3e9be](2c3e9be02faeeb2b160c2a844f9539222ded51c3))
- Added support for jwt_authorizer ([#42](https://github.com/tamasfe/aide/issues/42)) ([277fb47](277fb47ecc0edeee95708df3cfd52b1a5d5f34ed))
- Add support for axum-sqlx-tx ([6646dca](6646dca21176a47f72e85df568f2544a223c408c))
- Add test for path rewriting ([bba50a0](bba50a0dd5b300eaca83292067d8959314a4d0eb))
- Pick out Axum wildcard routes as an OpenAPI param ([1fca7c4](1fca7c4e15c5898525174ff55690fac09ab3fa9f))
- Added `NoApi` and `WithApi` utility structs, added ApiOverride trait for WithApi implementation ([0239c04](0239c04c80c60e0c9b784c7fe4bd4f238013db88))

### Miscellaneous Tasks

- Hide tower- optional dependencies ([152cb06](152cb06e0a9428d53290240b739aab383daa8614))
- Extend extract_schemas docs ([0b6232d](0b6232d81a1362e7fa1340765f43a5628ca86895))
- Update crate version ([4540c20](4540c20d7f9f62c788fa64cbe8c05c5863854c28))
- Removed temporary default features ([a7e5835](a7e5835542cab8eec82ad389cac7834ccdd5bc2a))
- Updated axum-extra and added output for cookie jars ([#53](https://github.com/tamasfe/aide/issues/53)) ([bef5ff2](bef5ff26446493974490558858083897ee0b1dbf))
- Dependency updates and clippy fixes ([5aff6d1](5aff6d18e2b262d65c884bc3f45641e7622d5994))

## 0.11.0 - 2023-04-30

[7ce7ffd](7ce7ffd40d9c66fbf29db5e310b4795819ab8bae)...[5aff6d1](5aff6d18e2b262d65c884bc3f45641e7622d5994)

### Bug Fixes

- Add support for Redirect axum response ([f9a67f8](f9a67f80f36a67ee8d2c9f1d5851c537ff3041c9))
- Fix typo in response_range() method ([f949aed](f949aedcad1d89cd5dd1f680c8d5292d55b1da1f))
- Fixed api_route_with overriding existing routes ([#40](https://github.com/tamasfe/aide/issues/40)) ([879e436](879e436e3506c85d4b3cf12012acaf76501d82ba))

### Features

- Add `with_path_items` method to `ApiRouter` ([090b5f0](090b5f04f3d0eaa33c75fdf96009264bb78770d0))
- Implement `merge` on ApiMethodRouter ([e6e9af3](e6e9af320757130074ca9cd537d342b5496d527d))
- Introduce security_requirement_multi ([ca5bc4e](ca5bc4e8dd05aed2facb274b7a2f11d48c02ad59))
- Add version and server methods ([54783f5](54783f5b2ad91f8527ba12ae21b26fbc1d794a8d))
- Add more blanket tuple impls of OperationOutput ([#37](https://github.com/tamasfe/aide/issues/37)) ([461cd5f](461cd5f9f9e9f4363b17d79b883530c0d60b546e))
- Add with_path_items method to ApiRouter ([#47](https://github.com/tamasfe/aide/issues/47)) ([47acb19](47acb1965b43508f616a7e3cb5bc37e9e36007c2))
- Implement `merge` on `ApiMethodRouter` ([#52](https://github.com/tamasfe/aide/issues/52)) ([2c3e9be](2c3e9be02faeeb2b160c2a844f9539222ded51c3))
- Added support for jwt_authorizer ([#42](https://github.com/tamasfe/aide/issues/42)) ([277fb47](277fb47ecc0edeee95708df3cfd52b1a5d5f34ed))
- Add support for axum-sqlx-tx ([6646dca](6646dca21176a47f72e85df568f2544a223c408c))

### Miscellaneous Tasks

- Updated axum-extra and added output for cookie jars ([#53](https://github.com/tamasfe/aide/issues/53)) ([bef5ff2](bef5ff26446493974490558858083897ee0b1dbf))
- Dependency updates and clippy fixes ([5aff6d1](5aff6d18e2b262d65c884bc3f45641e7622d5994))

## 0.10.0 - 2023-01-15

[e6c5b46](e6c5b46ed9ff1226cfc4d8c183e8b6c773308c0f)...[7ce7ffd](7ce7ffd40d9c66fbf29db5e310b4795819ab8bae)

### Bug Fixes

- Several fixes ([ac6549a](ac6549ad8b15d0ccc0e2e3cebcbde64b3f55ae31))
- Redoc router state ([daaf060](daaf060f5c22b63b986e327792ae5b367b4db578))

### Features

- Add skip_serializing_defaults feature ([3ffc96b](3ffc96b166e7abdbc1c56e823edb7e60fae86745))
- Added axum serde_qs support ([3e0e810](3e0e8107e3eea25e5c6f8280030b58013cfbf034))
- Add support for Option and Result inputs ([6156f77](6156f77637ee09b02ba99b61df02dee9fb53c693))

### Miscellaneous Tasks

- Removed temporary default features ([a7e5835](a7e5835542cab8eec82ad389cac7834ccdd5bc2a))

## 0.9.0 - 2022-11-29

[a2981e1](a2981e1b65831c945df540820721e60910086443)...[e6c5b46](e6c5b46ed9ff1226cfc4d8c183e8b6c773308c0f)

### Bug Fixes

- Remove recursive borrows, fixes #21 ([76705a4](76705a4f12702497aa9380fc89e1ffa995913162))
- Remove Clone restriction on Router generics, fixes #19 ([4c41fa0](4c41fa0f7d2f559bb49b4b7f9a20cbfa5167248e))
- `nest_api_service` will no longer accept arbitrary services. ([e6c5b46](e6c5b46ed9ff1226cfc4d8c183e8b6c773308c0f))

### Features

- Match more closely axum's API for MethodRouter ([73b5f74](73b5f74c005d811fb224cf7a4271caa1aac9eab3))

### Miscellaneous Tasks

- Update crate version ([4540c20](4540c20d7f9f62c788fa64cbe8c05c5863854c28))

## 0.8.1 - 2022-11-28

[5ff1cb3](5ff1cb36d1457cb2b26492b2b2cf6548cd23d93c)...[a2981e1](a2981e1b65831c945df540820721e60910086443)

### Features

- Inferred responses for operation input ([a2981e1](a2981e1b65831c945df540820721e60910086443))

## 0.8.0 - 2022-11-28

[f9f325d](f9f325d6005bf51e5cb1ab6224dbf122d0ef6402)...[5ff1cb3](5ff1cb36d1457cb2b26492b2b2cf6548cd23d93c)

### Features

- Impl OperationOutput for axum Rejections by yassun4dev ([4b666e1](4b666e13c4bce143e8cf740117f8644a0741f782)), Suggestion:impl OperationOutput for Rejections.
- Axum 0.6.0 ([5a06b52](5a06b52b11626104c64f4a7ba6220a4e6a1d84ab))
- Vendor Redoc ([53787e6](53787e60357bd97b777989d5c62a697ee646b085))

## 0.8.0-rc.1 - 2022-11-21

[dd4b615](dd4b615887f803d3ad4cdbf770a030be082e1e53)...[f9f325d](f9f325d6005bf51e5cb1ab6224dbf122d0ef6402)

### Features

- Update to axum 0.6.0-rc.5 ([659bdf5](659bdf51ef8b094019ffd493be91f1598cb5b646)), BREAKING CHANGE:Require using `nest_api_service` instead of `nest_service` or `nest` to propagate
the API documentation. Also propagate changes to `with_state` from axum 0.6.0-rc.5.

## 0.7.1 - 2022-11-17

[337d911](337d9119796579fe650c003107d2260452f623d6)...[dd4b615](dd4b615887f803d3ad4cdbf770a030be082e1e53)

### Features

- Add layer ([4b42cd2](4b42cd21abb571a7e10fa3c1e7087a3065e84545))
- Add axum redoc ui wrapper ([2e96bdc](2e96bdc4da12427ef7007e0ca6e103eb48495619))

## 0.7.0 - 2022-11-11

[1fc8da3](1fc8da3d8d2c9fe3e5d670c0171c18aefbdf290e)...[337d911](337d9119796579fe650c003107d2260452f623d6)

### Features

- Update to axum rc.4 ([337d911](337d9119796579fe650c003107d2260452f623d6))

## 0.6.4 - 2022-11-11

[d1ef18a](d1ef18a99f4dd4f3426f6f3d03b4c4f7383ba036)...[1fc8da3](1fc8da3d8d2c9fe3e5d670c0171c18aefbdf290e)

### Bug Fixes

- Loosen requirements ([1fc8da3](1fc8da3d8d2c9fe3e5d670c0171c18aefbdf290e))

## 0.6.3 - 2022-10-31

[c40ddaf](c40ddaf106c87dfe55a2d3fc316f85108d4c9029)...[d1ef18a](d1ef18a99f4dd4f3426f6f3d03b4c4f7383ba036)

### Bug Fixes

- Missing inferred responses ([e3fe288](e3fe2882aa10a87f7334948c1de9a00c5d96b008))
- Added missing inferred responses ([861e92a](861e92a23977ed5621c46475552aea3e16bcc464)), Add:default response.

## 0.6.2 - 2022-10-15

[a67ad80](a67ad80851f70171fd67e058aba0de48d050613b)...[c40ddaf](c40ddaf106c87dfe55a2d3fc316f85108d4c9029)

### Bug Fixes

- Resolve schema references during gen ([be0a66c](be0a66cd30f36e30f435d9c6f31673e682142492)), closes #4
- Use correct no content status code ([c40ddaf](c40ddaf106c87dfe55a2d3fc316f85108d4c9029))

### Miscellaneous Tasks

- Axum example cleanup ([5be6efd](5be6efd844ba5b287da4848a1595d74eb8647fd9))

## 0.6.1 - 2022-10-12

[ab7fbd7](ab7fbd7f37fc91e147b6119997841638e4b406c7)...[a67ad80](a67ad80851f70171fd67e058aba0de48d050613b)

### Bug Fixes

- Implement JsonSchema for OpenApi ([9cce0d6](9cce0d6cfb0f4c44be659e8b04ecb7f1ace01eee))
- Axum router nesting with different state ([a67ad80](a67ad80851f70171fd67e058aba0de48d050613b)), closes #2

### Miscellaneous Tasks

- Extend extract_schemas docs ([0b6232d](0b6232d81a1362e7fa1340765f43a5628ca86895))

## 0.6.0 - 2022-09-08

[b8f98b3](b8f98b3f22a4f08aeca4fcf61968f8a757c3c0bf)...[ab7fbd7](ab7fbd7f37fc91e147b6119997841638e4b406c7)

### Features

- **breaking** it is possible to disable schema extraction ([740d77c](740d77cde273c6940d403f2e4adf9b8751fe2669))
- Response inference from handler return types ([675ea2a](675ea2a15f9e87ad6ca503d7101e5ceec82ef857))

## 0.5.5 - 2022-09-07

[fa9f427](fa9f427bb59d13e713723510086992cfed065333)...[b8f98b3](b8f98b3f22a4f08aeca4fcf61968f8a757c3c0bf)

### Features

- Methods for OpenApi transform helper ([b8f98b3](b8f98b3f22a4f08aeca4fcf61968f8a757c3c0bf))

## 0.5.4 - 2022-09-07

[2f1528d](2f1528d8512b14192158c7fc2fe6c923b8d46702)...[fa9f427](fa9f427bb59d13e713723510086992cfed065333)

### Features

- Added auth support ([fa9f427](fa9f427bb59d13e713723510086992cfed065333))

## 0.5.3 - 2022-09-07

[66cbfad](66cbfad9985dfedce97e7afc0b6301d11a63b1b9)...[2f1528d](2f1528d8512b14192158c7fc2fe6c923b8d46702)

### Features

- Schema extraction ([2f1528d](2f1528d8512b14192158c7fc2fe6c923b8d46702))

## 0.5.2 - 2022-09-07

[9c59f3d](9c59f3de6bb97907b9e8e00c3b8a153c4b3da1be)...[66cbfad](66cbfad9985dfedce97e7afc0b6301d11a63b1b9)

### Bug Fixes

- Do not panic inside transform ([2ec0585](2ec0585b30a049179b37ced17f36ce3e1d4f675a))

### Features

- Add input to operation transform ([66cbfad](66cbfad9985dfedce97e7afc0b6301d11a63b1b9))

## 0.5.1 - 2022-09-07

[2d799fb](2d799fbd926f30d588047ea1e24a9cccb3698496)...[9c59f3d](9c59f3de6bb97907b9e8e00c3b8a153c4b3da1be)

### Features

- Add tag and summary transforms ([4a67561](4a6756138b0cc82788bf640d21c8565581c702fd))
- Added callbacks ([9c59f3d](9c59f3de6bb97907b9e8e00c3b8a153c4b3da1be))

### Miscellaneous Tasks

- Hide tower- optional dependencies ([152cb06](152cb06e0a9428d53290240b739aab383daa8614))

## 0.5.0 - 2022-09-06

[9a1e98b](9a1e98bb121d7971c5936c5c878563d6dce802ac)...[2d799fb](2d799fbd926f30d588047ea1e24a9cccb3698496)

### Features

- Arbitrary error variant ([cbc5c4e](cbc5c4ecc41dc900a96b06c9d08aea23892f551c))

<!-- generated by git-cliff -->
