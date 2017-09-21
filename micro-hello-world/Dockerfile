FROM mhart/alpine-node:8.5.0
WORKDIR /usr/src
COPY package.json yarn.lock /usr/src/
RUN yarn --production -s
COPY src /usr/src/src
CMD yarn start
