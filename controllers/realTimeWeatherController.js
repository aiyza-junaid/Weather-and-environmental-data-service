const weatherService = require("../services/realTimeWeatherService");
const realtimeresponse = require("../utils/realtime");

const weatherController = {
  getCurrentWeather: async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return realtimeresponse.handleBadRequest(res, "Latitude and Longitude are required.");
    }

    try {
      const weatherData = await weatherService.getCurrentWeather(lat, lon);
      if (weatherData.error) {
        return realtimeresponse.handleFailure(res, weatherData.error.message);
      }
      return realtimeresponse.handleSuccess(res, weatherData.data, "Weather data retrieved successfully.");
    } catch (error) {
      console.error("Controller Error:", error.message);
      return realtimeresponse.handleFailure(res, "Failed to fetch weather data.");
    }
  },
};

module.exports = weatherController;
