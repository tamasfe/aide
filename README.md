# GiroBet Frontend

Icons can be found [here](https://icones.js.org/)

## Development Environment

### First setup

Duplicate the `.env.mock` file and rename the copy to `.env`.

Then run:

```bash
pnpm install
pnpm dev
```

### Environment variables & files

With the aim to balance the developer experience between flexibility and ease of use, this repository allows for different "environments" depending on what the developer is more interested in doing at a certain time.

- `pnpm dev:mock` lifts the Nuxt server and loads the `.env.mock` file. It requires no other dependency or repository to function. This environment is advised to easily tweak designs and styling. As the dummy data and behaviour can easily be changed with the "Dumb" repositories and classes.
- `pnpm dev:api` lifts the Nuxt server and loads the `.env.api` file. It requires the backend build initialised and being `served` locally in the api base url specified in that env file. This environment is recommended when testing end2end or checking behaviour against our backend API.
- `pnpm dev` lifts the Nuxt server and loads the `.env` file. This file is not tracked by git, so it allows the developer to build their own configuration depending on what they are trying to achieve.

Useful documentation links about Nuxt & environment variables:

- https://nuxt.com/docs/guide/going-further/runtime-config#typing-runtime-config
- https://nuxt.com/docs/guide/directory-structure/env

### Updating the backend open api spec

1. Replace the `app/packages/http-client/girobet-backend-open-api.json` file with the newer version
2. (Remember to format it so git picks up the differences more easily)
3. Run `pnpm generate:open-api-client` (you need to have run `pnpm install` before)

That's it! The updated types are picked up automatically.
