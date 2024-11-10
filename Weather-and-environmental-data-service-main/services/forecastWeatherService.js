const axios = require('axios');

const API_HOST = 'weatherapi-com.p.rapidapi.com';
const API_KEY = process.env.REALTIME_RAPIDAPI_KEY;
const BASE_URL = `https://${API_HOST}`;

const forecastWeatherService = {
  getHourlyForecast: async (q) => {
    const url = `${BASE_URL}/forecast.json?q=${q}&hours=24`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': API_HOST,
      },
    };

    const response = await axios.get(url, options);
    return response.data;
  },

  getDailyForecast: async (q) => {
    const url = `${BASE_URL}/forecast.json?q=${q}&days=1`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': API_HOST,
      },
    };

    const response = await axios.get(url, options);
    return response.data;
  },

  getThreeDayForecast: async (q) => {
    const url = `${BASE_URL}/forecast.json?q=${q}&days=3`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': API_HOST,
      },
    };

    const response = await axios.get(url, options);
    return response.data;
  },

  getLocationBasedForecast: async (q, days = 3) => {
    const url = `${BASE_URL}/forecast.json?q=${q}&days=${days}`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': API_HOST,
      },
    };

    const response = await axios.get(url, options);
    return response.data;
  },
};

module.exports = forecastWeatherService;
