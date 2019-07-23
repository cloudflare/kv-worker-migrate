const fetch = require("node-fetch");
const utils = require("./utils");

class Client {
  constructor(zone) {
    this.url = `https://${zone}/namespaceMigrationKeyCopier`;
  }

  async copy(keys, batchSize = 100) {
    let workerProms = [];
    for (const b of utils.batch(keys, batchSize)) {
      workerProms.push(this.invokeWorker(b));
    }
    return Promise.all(workerProms);
  }

  async invokeWorker(keys) {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify(keys),
      headers: { "Content-Type": "application/json" }
    };
    const resp = await fetch(this.url, requestOptions);
    return resp.text();
  }
}

module.exports = {
  Client: Client
};
