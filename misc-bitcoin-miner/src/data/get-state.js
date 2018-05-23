const removeNode = require('./remove-node');
const debug = require('debug')('bitcoin-miner:get-state');

const getState = async (redisClient, name) => {
  // get the set of nodes, some of which
  // could have expired
  const maybeNodes = await redisClient
    .smembers(`miner:nodes:${name}`);

  const nodes = (await Promise.all(
    maybeNodes.map(async id => {
      // this key expires and is refreshed by heartbeats
      const exists = await redisClient.get(`miner:node:${name}:${id}`);
      if (exists) {
        return id;
      } else {
        debug('removing node', id);
        await removeNode(redisClient, name, id);
      }
    })
  )).filter(Boolean)

  const hashRates = await Promise.all(nodes.map(id =>
    redisClient.get(`miner:hashrate:${name}:${id}`)
  ));
  const hashRate = hashRates.reduce((a, b) => Number(a) + Number(b), 0);

  return {
    nodesCount: nodes.length,
    hashRate: isNaN(hashRate) ? 0 : hashRate
  }
};

module.exports = getState;
