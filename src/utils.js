function addParams(url, params) {
  const queryString = Object.entries(params)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
  return `${url}?${queryString}`;
}

function batch(total, batchSize) {
  let batches = [];
  for (let batchNum = 0; batchNum < total.length / batchSize; batchNum++) {
    batches.push(total.slice(batchNum * batchSize, (batchNum + 1) * batchSize));
  }
  return batches;
}

module.exports = {
  addParams: addParams,
  batch: batch
};
