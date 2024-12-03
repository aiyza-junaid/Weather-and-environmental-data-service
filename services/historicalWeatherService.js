const axios = require("axios");
const fs = require("fs");
const path = require("path");

const API_HOST = "weatherapi-com.p.rapidapi.com";
const API_KEY = process.env.REALTIME_RAPIDAPI_KEY;
const BASE_URL = `https://${API_HOST}/history.json`;

const fallbackFilePath = path.join(__dirname, "../data/lastHistoricalWeather.json");

const saveFallbackResponse = (data) => {
  try {
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
        saveFallbackResponse(response.data);
        return response.data;
      } else {
        console.warn("No data in response, using fallback.");
        const fallbackData = getFallbackResponse();
        if (fallbackData) {
          return fallbackData;
        }
        throw new Error("No historical weather data available.");
      }
    } catch (error) {
      console.error("Historical Weather Service Error:", error.response?.data || error.message);
      const fallbackData = getFallbackResponse();
      if (fallbackData) {
        return fallbackData;
      }
      throw new Error("Failed to fetch historical weather data.");
    }
  },
};

module.exports = historicalWeatherService;
