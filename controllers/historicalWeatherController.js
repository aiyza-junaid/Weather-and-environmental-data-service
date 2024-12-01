const historicalWeatherService = require('../services/historicalWeatherService');
const responseUtils = require('../utils/responseUtils');

const historicalWeatherController = {
  getHistoricalWeather: async (req, res) => {
    try {
    
      const { lat, lon } = req.query;

      if (!lat || !lon) {
        return responseUtils.handleFailure(res, 'Latitude and longitude are required.');
      }

    
      const weatherData = await historicalWeatherService.getHistoricalWeather(lat, lon);
      responseUtils.handleSuccess(
        res,
        weatherData,
        'Historical weather data retrieved successfully.'
      );
    } catch (error) {
      console.error('Error in controller:', error.message);
      responseUtils.handleFailure(res, error.message);
    }
  },
};

module.exports = historicalWeatherController;
