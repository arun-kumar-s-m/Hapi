const elasticClient = require("./elastic-client");

const createIndex = async (indexName) => {
  await elasticClient.indices.create({ index: indexName });
  console.log("Index created with elastic name as ::: ",indexName);
};

module.exports = createIndex;

