FROM node:lts

ARG VERSION

ENV NUXT_PUBLIC_RELEASE=${VERSION}

WORKDIR /app

COPY ./.output .

ENTRYPOINT ["node"]

CMD ["--import", "/app/server/sentry.server.config.mjs", "/app/server/index.mjs"]
