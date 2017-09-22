const heartbeat = (redisClient, name, id) => (
  redisClient.multi()
    .sadd(`miner:nodes:${name}`, id)
    .setex(`miner:node:${name}:${id}`, 10, 1)
    .exec()
);
module.exports = heartbeat;
