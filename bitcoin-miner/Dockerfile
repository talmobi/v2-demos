FROM debian
RUN apt-get update && apt-get -y install curl
RUN cd /tmp && \
  curl -O -s https://netix.dl.sourceforge.net/project/cpuminer/pooler-cpuminer-2.5.0-linux-x86_64.tar.gz && \
  tar xzvf pooler-cpuminer-2.5.0-linux-x86_64.tar.gz && \
  mv minerd /usr/bin && \
  cd - && \
  rm -rf /tmp/* && \
  curl -sL https://deb.nodesource.com/setup_8.x | bash - && \
  apt-get install -y nodejs && \
  npm install -g yarn
WORKDIR /usr/src
COPY package.json yarn.lock /usr/src/
RUN yarn
COPY src/ /usr/src/src/
CMD node src/bin.js \
  --redis $REDIS_URL \
  --pool-url stratum+tcp://stratum.slushpool.com:3333 \
  --pool-user rauchg2.worker1 \
  --pool-pass 123
