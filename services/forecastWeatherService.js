const axios = require("axios");

const API_HOST = "weatherapi-com.p.rapidapi.com";
const API_KEY = process.env.REALTIME_RAPIDAPI_KEY;
const BASE_URL = `https://${API_HOST}/forecast.json`;

const forecastWeatherService = {
  getHourlyForecast: async (q) => {
    const url = `${BASE_URL}?q=${q}&hours=24`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": API_KEY,
        "x-rapidapi-host": API_HOST,
      },
    };

    try {
      const response = await axios.get(url, options);
      if (response && response.data) {
        return response.data;
      } else {
        throw new Error("No hourly forecast data available.");
      }
    } catch (error) {
      console.error("Hourly Forecast Service Error:", error.message);
      throw new Error("Failed to fetch hourly forecast data.");
    }
  },

  getDailyForecast: async (q) => {
    const url = `${BASE_URL}?q=${q}&days=1`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": API_KEY,
        "x-rapidapi-host": API_HOST,
      },
    };

    try {
      const response = await axios.get(url, options);
      if (response && response.data) {
        return response.data;
      } else {
        throw new Error("No daily forecast data available.");
      }
    } catch (error) {
      console.error("Daily Forecast Service Error:", error.message);
      throw new Error("Failed to fetch daily forecast data.");
    }
  },

  getThreeDayForecast: async (q) => {
    const url = `${BASE_URL}?q=${q}&days=3`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": API_KEY,
        "x-rapidapi-host": API_HOST,
      },
    };

    try {
      const response = await axios.get(url, options);
      if (response && response.data) {
        return response.data;
      } else {
        throw new Error("No three-day forecast data available.");
      }
    } catch (error) {
      console.error("Three-Day Forecast Service Error:", error.message);
      throw new Error("Failed to fetch three-day forecast data.");
    }
  },

  getLocationBasedForecast: async (q, days = 3) => {
    const url = `${BASE_URL}?q=${q}&days=${days}`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": API_KEY,
        "x-rapidapi-host": API_HOST,
      },
    };

    try {
      const response = await axios.get(url, options);
      if (response && response.data) {
        return response.data;
      } else {
        throw new Error(`No forecast data available for ${days} days.`);
      }
    } catch (error) {
      console.error("Location-Based Forecast Service Error:", error.message);
      throw new Error("Failed to fetch location-based forecast data.");
    }
  },
};

module.exports = forecastWeatherService;
