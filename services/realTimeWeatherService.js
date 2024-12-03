const axios = require("axios");
const fs = require("fs");
const path = require("path");
const BASE_URL = "https://weatherapi-com.p.rapidapi.com";
const realtimeresponse = require("../utils/realtime");

const fallbackFilePath = path.join(__dirname, "../data/lastWeatherResponse.json");

const saveFallbackResponse = (data) => {
  try {
    console.log("hello")
    fs.writeFileSync(fallbackFilePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving fallback response:", error);
  }
};

const getFallbackResponse = () => {
  try {
    if (fs.existsSync(fallbackFilePath)) {
      const data = fs.readFileSync(fallbackFilePath, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading fallback response:", error);
  }
  return null;
};

const weatherService = {
  getCurrentWeather: async (lat, lon) => {
    const url = `${BASE_URL}/current.json?q=${lat},${lon}`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.REALTIME_RAPIDAPI_KEY,
        "x-rapidapi-host": "weatherapi-com.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.get(url, options);
      if (response && response.data) {
        saveFallbackResponse(response.data);
        return { data: response.data };
      } else {
        console.warn("No data in response, using fallback.");
        const fallbackData = getFallbackResponse();
        return fallbackData ? { data: fallbackData } : { error: { message: "No data available" } };
      }
    } catch (error) {
      console.error("Weather Service Error:", error);
      const fallbackData = getFallbackResponse();
      return fallbackData
        ? { data: fallbackData }
        : { error: error.response ? error.response.data : { message: "Error fetching weather data" } };
    }
  },
};

module.exports = weatherService;
