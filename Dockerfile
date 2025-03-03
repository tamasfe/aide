FROM node:lts

ARG VERSION

ENV NUXT_PUBLIC_RELEASE=${VERSION}

WORKDIR /app

COPY ./.output .

ENTRYPOINT ["node"]

# More info on the sentry server config entrypoint @https://docs.sentry.io/platforms/javascript/guides/nuxt/install/cli-import/#initializing-sentry-with---import
CMD ["--import", "app/server/sentry.server.config.mjs",  "/app/server/index.mjs"]
