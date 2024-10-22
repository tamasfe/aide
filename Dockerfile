FROM node:lts

WORKDIR /app

COPY ./.output .

ENTRYPOINT ["node"]

CMD ["/app/server/index.mjs"]