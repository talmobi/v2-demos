FROM mhart/alpine-node:10.1.0
RUN apk add --no-cache bash curl
RUN adduser -S -g "" -h /home/nowuser -s /bin/bash nowuser
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
ENV FOO bar
EXPOSE 3000
USER nowuser
SHELL ["/bin/bash", "-c"]
STOPSIGNAL SIGKILL
HEALTHCHECK --interval=5m --timeout=3s \
  CMD curl -f http://localhost:3000/ || exit 1
CMD node ./node_modules/.bin/micro server.js
