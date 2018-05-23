const Redis = require('ioredis');
const getRedisClient = opts => new Redis(opts);
module.exports = getRedisClient;
