const utils = require("./utils");

test("addParams adds some params to a url", () => {
  const params = {
    a: 1,
    b: 2
  };
  const url = "https://fake.com";

  expect(utils.addParams(url, params)).toBe("https://fake.com?a=1&b=2");
});

test("batch batches arrays", () => {
  const total = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const batchSize = 2;
  const expectedBatches = [[1, 2], [3, 4], [5, 6], [7, 8], [9]];
  expect(utils.batch(total, batchSize)).toStrictEqual(expectedBatches);
});
