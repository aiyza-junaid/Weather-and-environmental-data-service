const axios = require("axios");

const BASE_URL = "https://weatherapi-com.p.rapidapi.com"; // Correct base URL

const weatherService = {
  getCurrentWeather: async (lat, lon) => {
    const url = `${BASE_URL}/current.json?q=${lat},${lon}`; // Correct endpoint with .json and query format
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.REALTIME_RAPIDAPI_KEY, // API key from environment variables
        "x-rapidapi-host": "weatherapi-com.p.rapidapi.com", // API host
      },
    };

    try {
      const response = await axios.request({ url, ...options });
      if (response && response.data) {
        return { data: response.data }; // Return parsed data
      } else {
        return { error: { message: "No data available from the WeatherAPI" } };
      }
    } catch (error) {
      console.error("Weather Service Error:", error.message);
      return {
        error: error.response?.data || { message: "Error fetching weather data" },
      };
    }
  },
};

module.exports = weatherService;
