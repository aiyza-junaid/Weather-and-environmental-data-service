const axios = require("axios");

const API_HOST = "weatherapi-com.p.rapidapi.com";
const API_KEY = process.env.REALTIME_RAPIDAPI_KEY;
const BASE_URL = `https://${API_HOST}/history.json`;

const historicalWeatherService = {
  getHistoricalWeather: async (latitude, longitude) => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 7); // 7 days before today

    const params = {
      q: `${latitude},${longitude}`,
      dt: startDate.toISOString().split("T")[0],
      end_dt: today.toISOString().split("T")[0],
    };

    const options = {
      method: "GET",
      url: BASE_URL,
      params,
      headers: {
        "x-rapidapi-key": API_KEY,
        "x-rapidapi-host": API_HOST,
      },
    };

    try {
      const response = await axios.request(options);
      if (response && response.data) {
        return response.data;
      } else {
        throw new Error("No historical weather data available.");
      }
    } catch (error) {
      console.error(
        "Historical Weather Service Error:",
        error.response?.data || error.message
      );
      throw new Error("Failed to fetch historical weather data.");
    }
  },
  getHistoricalWeatherCity: async (city) => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 7); // 7 days before today

    const params = {
      q: `${city}`,
      dt: startDate.toISOString().split("T")[0],
      end_dt: today.toISOString().split("T")[0],
    };

    const options = {
      method: "GET",
      url: BASE_URL,
      params,
      headers: {
        "x-rapidapi-key": API_KEY,
        "x-rapidapi-host": API_HOST,
      },
    };

    try {
      const response = await axios.request(options);
      if (response && response.data) {
        return response.data;
      } else {
        throw new Error("No historical weather data available.");
      }
    } catch (error) {
      console.error(
        "Historical Weather Service Error:",
        error.response?.data || error.message
      );
      throw new Error("Failed to fetch historical weather data.");
    }
  },
};

module.exports = historicalWeatherService;
