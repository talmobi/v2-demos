FROM mhart/alpine-node:9 as base
WORKDIR /usr/src
COPY package.json yarn.lock /usr/src/
RUN yarn
COPY . .
RUN yarn --production yarn pkg

FROM alpine
RUN apk add --no-cache libstdc++ libgcc
COPY --from=base /usr/src/bin /start
EXPOSE 3000
CMD ["/start"]
