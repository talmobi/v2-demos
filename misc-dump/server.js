const os = require('os');
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
    process: {
      pid: process.pid,
      ppid: process.ppid,
      versions: process.versions,
      env
    },
    os: {
      hostname: os.hostname(),
      arch: os.arch(),
      platform: os.platform(),
      homedir: os.homedir(),
      hostname: os.hostname(),
      cpus: os.cpus(),
      userInfo: os.userInfo()
    }
  }
};
