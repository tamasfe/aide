FROM node:lts

ARG VERSION

ENV NUXT_PUBLIC_RELEASE=${VERSION}

WORKDIR /app

COPY ./.output .

ENTRYPOINT ["node"]

CMD ["/app/server/index.mjs"]