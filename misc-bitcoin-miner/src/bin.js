const zarg = require('zarg');
const {version} = require('../package');
const {parse} = require('url');
const uuid = require('uuid');
const micro = require('micro');
const getRedisClient = require('./get-redis-client');
const createRequestHandler = require('./server');
const sleep = require('then-sleep');

const mine = require('./mine');
const heartbeat = require('./data/heartbeat');
const removeNode = require('./data/remove-node');
const updateHashRate = require('./data/update-hash-rate');

async function main (argv) {
  const args = zarg(argv, {
    '--help': Boolean,
    '--version': Boolean,
    '--redis': String,
    '--redis-group-name': String,
    '--port': Number,
    '--name': String,
    '--pool-url': String,
    '--pool-user': String,
    '--pool-pass': String,

    '-n': '--name',
    '-h': '--help',
    '-v': '--version',
    '-r': '--redis',
    '-p': '--port'
  });

  if (args['--version']) {
    // eslint-disable-next-line no-console
    console.log(version);
    return 0;
  }

  if (args['--help']) {
    // eslint-disable-next-line no-console
    console.log(`
  bitcoin-miner ${version}

    -p, --port          Port to listen on             [3000]
    -v, --version       Print package version
    -r, --redis         Redis URL
    -h, --help          This message
`);
    return 0;
  }

  let redisOpts;
  if (args['--redis']) {
    if (args['--redis'].indexOf(',') > 0) {
      if (args['--redis-group-name']) {
        redisOpts.name = args['--redis-group-name'];
      } else {
        // eslint-disable-next-line no-console
        console.error('bitcoin-miner: a --redis-group-name must be ' +
          'supplied when passing multiple comma-separated redis URLs');
        return 1;
      }
      redisOpts.sentinels = args['--redis']
        .split(',')
        .map(url => {
          const {hostname, port} = parse(url, true);
          return {
            host: hostname,
            // Port will default to `null` when not supplied
            // So we use the default sentinel port 26379
            port: port === null ? 26379 : port
          };
        });
    } else {
      // `ioredis` admits passing a redis:// url when a single
      // argument is supplied as a string
      redisOpts = args['--redis'];
    }
  } else {
    // eslint-disable-next-line no-console
    console.error('bitcoin-miner: the --redis option is required');
    return 1;
  }

  if (!args['--pool-url']) {
    // eslint-disable-next-line no-console
    console.error('bitcoin-miner: please supply --pool-url');
    return 1;
  }

  if (!args['--pool-user']) {
    // eslint-disable-next-line no-console
    console.error('bitcoin-miner: please supply --pool-user');
    return 1;
  }

  if (!args['--pool-pass']) {
    // eslint-disable-next-line no-console
    console.error('bitcoin-miner: please supply --pool-pass');
    return 1;
  }

  const id = args['--id'] || uuid.v4();
  const name = args['--name'] || 'default';

  const redisClient = getRedisClient(redisOpts);
  const server = micro(createRequestHandler(redisClient, name, id));

  // send heartbeats about this client
  let currentHeartbeat;
  let shouldSendHeartbeats = true;
  const sendHeartbeat = async () => {
    try {
      await heartbeat(redisClient, name, id)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('bitcoin-miner: erro heartbeating', err);
    }
    await sleep(1000);
    if (shouldSendHeartbeats) {
      currentHeartbeat = sendHeartbeat();
    }
  }
  sendHeartbeat();

  // mine and 
  mine(
    args['--pool-url'],
    args['--pool-user'],
    args['--pool-pass'],
    (err, hashRate) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error('bitcoin-miner: mining error', err);
        process.exit(1);
      }
      updateHashRate(redisClient, name, id, hashRate)
      .catch(updateErr => {
        // eslint-disable-next-line no-console
        console.error('bitcoin-miner: error updating hashrate', updateErr);
        // we on purpose don't exit, not critical error
      });
    }
  );

  // active optimization for exit
  let exiting = false;
  const onExit = async () => {
    if (exiting) return;
    exiting = true;
    shouldSendHeartbeats = false;
    if (currentHeartbeat) {
      // let the heartbeat be written out so that
      // we can confidently remove the node data
      // and they don't overlap
      await currentHeartbeat;
    }
    currentHeartbeat = null;
    await removeNode(redisClient, name, id);
    process.exit(0);
  };
  process.once('SIGINT', onExit);
  process.once('SIGTERM', onExit);

  return new Promise((resolve) => {
    server.once('error', err => {
      // eslint-disable-next-line no-console
      console.error('bitcoin-miner: error while listening', err);
      resolve(1);
    });
    const port = args['--port'] || 3000;
    server.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`bitcoin-miner: listening on *:${port}`);
    });
  });
}

process.on('unhandledRejection', err => {
  // eslint-disable-next-line no-console
  console.error('bitcoin-miner: unhandled rejection', err);
  process.exit(1);
});

main(process.argv.slice(2))
.catch(err => {
  // eslint-disable-next-line no-console
  console.error('bitcoin-miner: unexpected error:', err);
  process.exit(1);
})
