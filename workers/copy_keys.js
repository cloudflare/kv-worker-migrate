// eslint-disable-next-line no-undef
addEventListener("fetch", event => {
  event.respondWith(handleCopy(event.request));
});

async function handleCopy(request) {
  let copyCount = 0;
  const keys = await request.json();
  copyCount += await copyKeys(keys);
  return new Response(`successfully copied ${copyCount} keys`); // eslint-disable-line no-undef
}

async function copyKeys(keys) {
  let copyCount = 0;
  let copyProms = [];
  for (const key of keys) {
    const keyName = key.name;
    let putOptions = {};
    if (key.expiration) {
      putOptions["expiration"] = key.expiration;
    }
    copyProms.push(
      FROM_NS.get(keyName) // eslint-disable-line no-undef
        .then(val => TO_NS.put(keyName, val, putOptions)) // eslint-disable-line no-undef
        .then(copyCount++)
    );
  }
  await Promise.all(copyProms);
  return copyCount;
}
