const execa = require('execa');
const StreamSnitch = require('stream-snitch');
const debug = require('debug')('bitcoin-miner:mine');

const mine = (url, user, pass, fn) => {
  let finished = false;
  const proc = execa('minerd', [
    '-a', 'sha256d',
    '-t', '1',
    '--url', url,
    '--userpass', `${user}:${pass}`
  ]);
  proc.once('error', err => {
    if (finished) return;
    fn(err);
    finished = true;
  });
  const snitch = new StreamSnitch(/ [\d.]+ khash/i);
  snitch.on('match', ([data]) => {
    if (finished) return;
    const n = Number(data.trim().split(' ')[0]);
    if (isNaN(n)) {
      fn(new Error('Parsing error'));
      finished = true;
    } else {
      debug('hash rate', n);
      fn(null, n);
    }
  });
  proc.stderr
    .pipe(snitch)
    .on('error', err => {
      if (finished) return;
      fn(err);
    });
  ;
}

module.exports = mine;
