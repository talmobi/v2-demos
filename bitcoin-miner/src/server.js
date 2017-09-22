const {join} = require('path');
const html_ = require('fs').readFileSync(join(__dirname, 'index.html'), 'utf8');
const {send} = require('micro');
const {parse} = require('url');
const getState_ = require('./data/get-state');

const createRequestHandler = (redisClient, name, id) => {
  const html = html_.replace(/{{NODE_ID}}/g, name, id);
  const getState = getState_.bind(null, redisClient, name);
  const onRequest = async (req, res) => {
    const {pathname} = parse(req.url);
    if (pathname === '/') {
      if (req.method === 'GET') {
        res.setHeader('Content-Type', 'text/html');
        const {nodesCount, hashRate} = await getState();
        return html
          .replace(/{{HASH_RATE}}/g, hashRate)
          .replace(/{{NODES_COUNT}}/g, nodesCount)
      } else {
        send(res, 400);
      }
    } else if (pathname === '/data') {
      if (req.method === 'GET') {
        return getState(redisClient);
      } else {
        send(res, 400);
      }
    } else {
      return send(res, 404);
    }
  }
  return onRequest;
}

module.exports = createRequestHandler;
