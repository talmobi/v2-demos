const updateHashRate = (redisClient, name, id, rate) => (
  redisClient.set(`miner:hashrate:${name}:${id}`, rate)
);
module.exports = updateHashRate;
