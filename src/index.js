const kv = require("./kv");
const worker = require("./worker");

module.exports = () => {
  const config = parseEnv();
  const kvClient = new kv.Client(config.email, config.apiKey, config.acctTag);
  const workerClient = new worker.Client(config.zone);

  (async function() {
    let cursor;

    const fromNSID = await kvClient.getNamespaceIDByName(config.fromNS);
    do {
      const listResp = await kvClient.listKeys(fromNSID);
      cursor = listResp.cursor;
      const resp = await workerClient.copy(listResp.keys);
      for (let r of resp) {
        console.log(r);
      }
    } while (cursor);
  })();
};

function parseEnv() {
  const email = process.env.CLOUDFLARE_AUTH_EMAIL;
  if (!email) {
    errorOut("CLOUDFLARE_AUTH_EMAIL environment variable must be set");
  }
  const apiKey = process.env.CLOUDFLARE_AUTH_KEY;
  if (!apiKey) {
    errorOut("CLOUDFLARE_AUTH_KEY environment variable must be set");
  }
  const acctTag = process.env.CLOUDFLARE_ACCOUNT_ID;
  if (!acctTag) {
    errorOut("CLOUDFLARE_ACCOUNT_ID environment variable must be set");
  }
  const zone = process.env.CLOUDFLARE_ZONE_NAME;
  if (!zone) {
    errorOut("CLOUDFLARE_ZONE_NAME evironment variable must be set");
  }
  const fromNS = process.env.CLOUDFLARE_FROM_NS;
  if (!fromNS) {
    errorOut("CLOUDFLARE_FROM_NS environment variable must be set");
  }
  const toNS = process.env.CLOUDFLARE_TO_NS;
  if (!toNS) {
    errorOut("CLOUDFLARE_TO_NS environment variable must be set");
  }

  return {
    email: email,
    apiKey: apiKey,
    acctTag: acctTag,
    zone: zone,
    fromNS: fromNS,
    toNS: toNS
  };
}

function errorOut(msg, exitCode = 1) {
  console.error(msg);
  process.exit(exitCode);
}
