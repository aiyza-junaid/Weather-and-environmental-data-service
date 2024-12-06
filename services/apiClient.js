const axios = require('axios');

const apiClient = axios.create({
  baseURL: 'https://database-microservice-agrilink.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

module.exports = apiClient;
