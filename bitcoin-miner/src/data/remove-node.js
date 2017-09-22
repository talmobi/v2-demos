const removeNode = (redisClient, name, id) => (
  redisClient.multi()
    .srem(`miner:nodes:${name}`, id)
    .del(`miner:hashrate:${name}:${id}`)
    .exec()
);
module.exports = removeNode;
