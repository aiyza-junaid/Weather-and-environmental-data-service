const axios = require("axios");
const fs = require("fs");
const path = require("path");

const API_HOST = "weatherapi-com.p.rapidapi.com";
const API_KEY = process.env.REALTIME_RAPIDAPI_KEY;
const BASE_URL = `https://${API_HOST}/forecast.json`;

const fallbackFilePath = path.join(__dirname, "../data/lastForecastWeather.json");

const saveFallbackResponse = (data, type) => {
  try {
    const filePath = path.join(__dirname, `../data/lastForecastWeather_${type}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving fallback response:", error);
  }
};

const getFallbackResponse = (type) => {
  try {
    const filePath = path.join(__dirname, `../data/lastForecastWeather_${type}.json`);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading fallback response:", error);
  }
  return null;
};

const forecastWeatherService = {
  getHourlyForecast: async (q) => {
    const type = "hourly";
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
        saveFallbackResponse(response.data, type);
        return response.data;
      } else {
        console.warn("No data in response, using fallback.");
        const fallbackData = getFallbackResponse(type);
        if (fallbackData) {
          return fallbackData;
        }
        throw new Error("No hourly forecast data available.");
      }
    } catch (error) {
      console.error("Hourly Forecast Service Error:", error);
      const fallbackData = getFallbackResponse(type);
      if (fallbackData) {
        return fallbackData;
      }
      throw new Error("Failed to fetch hourly forecast data.");
    }
  },

  getDailyForecast: async (q) => {
    const type = "daily";
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
        saveFallbackResponse(response.data, type);
        return response.data;
      } else {
        console.warn("No data in response, using fallback.");
        const fallbackData = getFallbackResponse(type);
        if (fallbackData) {
          return fallbackData;
        }
        throw new Error("No daily forecast data available.");
      }
    } catch (error) {
      console.error("Daily Forecast Service Error:", error);
      const fallbackData = getFallbackResponse(type);
      if (fallbackData) {
        return fallbackData;
      }
      throw new Error("Failed to fetch daily forecast data.");
    }
  },

  getThreeDayForecast: async (q) => {
    const type = "three_day";
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
        saveFallbackResponse(response.data, type);
        return response.data;
      } else {
        console.warn("No data in response, using fallback.");
        const fallbackData = getFallbackResponse(type);
        if (fallbackData) {
          return fallbackData;
        }
        throw new Error("No three-day forecast data available.");
      }
    } catch (error) {
      console.error("Three-Day Forecast Service Error:", error);
      const fallbackData = getFallbackResponse(type);
      if (fallbackData) {
        return fallbackData;
      }
      throw new Error("Failed to fetch three-day forecast data.");
    }
  },

  getLocationBasedForecast: async (q, days = 3) => {
    const type = `location_based_${days}_days`;
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
        saveFallbackResponse(response.data, type);
        return response.data;
      } else {
        console.warn("No data in response, using fallback.");
        const fallbackData = getFallbackResponse(type);
        if (fallbackData) {
          return fallbackData;
        }
        throw new Error(`No forecast data available for ${days} days.`);
      }
    } catch (error) {
      console.error("Location-Based Forecast Service Error:", error);
      const fallbackData = getFallbackResponse(type);
      if (fallbackData) {
        return fallbackData;
      }
      throw new Error("Failed to fetch location-based forecast data.");
    }
  },
};

module.exports = forecastWeatherService;
