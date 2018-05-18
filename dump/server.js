const env = {};
for (const key of Object.keys(process.env).sort()) {
  if (key === 'AUTH_TOKEN') continue;
  if (key.startsWith('npm_')) continue;
  env[key] = process.env[key];
}
module.exports = async function(req, res) {
  return {
    url: req.url,
    method: req.method,
    headers: req.headers,
    versions: process.versions,
    env
  }
};
