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
        return realtimeresponse.handleFailure(res, weatherData.error); 
      }
      return realtimeresponse.handleSuccess(res, weatherData.data, 'Weather data retrieved successfully.'); 
    } catch (error) {
      return realtimeresponse.handleFailure(res, error.message);
    }
  },
};

module.exports = weatherController;
