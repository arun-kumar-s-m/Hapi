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

module.exports = elasticClient;