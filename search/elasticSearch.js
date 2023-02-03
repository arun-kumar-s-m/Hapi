const { Client } = require("@elastic/elasticsearch");

const elasticClient = new Client({
    cloud: {
      id: "My_deployment:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvOjQ0MyRhODk0ZjAzOTg2N2Y0NDhkYjdjZDRmOGI3N2Q0MmVkMiRhZGJlM2JlMzkyMDA0OWQ2YTM5ZDg5YmNkYjY3YjYxYw==",
    },
    auth: {
      username: 'elastic',
      password: 'wKec5jdSLWI7vauiAfiZ8Yrq',
    },
  });

  const createIndex = async (indexName) => {
    const result = await elasticClient.indices.create({ index: indexName });
    console.log('ELASTIC SERVICE RESPONSE createIndex ::: ',result);
  };


  const insertDocumentsToELK = async (indexName,documentObj) => {
    const result = await elasticClient.index({
        index: indexName,
        document: {
            id: documentObj.id,
            content: documentObj.content
        },
    });
    console.log('ELASTIC SERVICE RESPONSE insertDocumentsToELK ::: ',result);
    return result;
  }

  const searchForText = async (indexToSearch,fieldsToSearch) => {
    console.log('ELASTIC SERVICE indexToSearch ::: ',indexToSearch,' FIELDS TO SEARCH ::: ',fieldsToSearch);
    const result = await elasticClient.search({
        index: indexToSearch,
        "query": {
            "query_string" : {"default_field" : fieldsToSearch.fieldName, "query" : fieldsToSearch.searchterm}
        },
    });
    console.log('ELASTIC SERVICE RESPONSE searchForText::: ',result);
    return result;
  }

  const deleteIndicesInElastic = async (indexName) => {
    let arr = [];
    arr.push(indexName);
    const deleteIndexResult = await elasticClient.indices.delete({
        index: arr
    });
    console.log('ELASTIC SERVICE RESPONSE deleteIndicesInElastic ::: ',deleteIndexResult);
    return deleteIndexResult;
  }

  const checkWhetherIndexExists = async (indexName) => {
    let checkingWhetherIndexExistsInElastic = await elasticClient.indices.exists({
        index :  indexName
    });
    if(!checkingWhetherIndexExistsInElastic){
        createIndex(indexName);
    }
    console.log('ELASTIC SERVICE RESPONSE checkWhetherIndexExists::: ',checkingWhetherIndexExistsInElastic);
    return checkingWhetherIndexExistsInElastic;
  }

 


  module.exports = {insertDocumentsToELK,createIndex,searchForText,deleteIndicesInElastic,checkWhetherIndexExists};