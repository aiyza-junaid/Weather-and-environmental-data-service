const weatherService = require('../services/forecastWeatherService');
const responseUtils = require('../utils/responseUtils');

const forecastweatherController = {
  getHourlyForecast: async (req, res) => {
    const { q } = req.query;
    if (!q) {
      return responseUtils.handleBadRequest(res, 'Location query parameter is required.');
    }

    try {
      const weatherData = await weatherService.getHourlyForecast(q);
      responseUtils.handleSuccess(res, weatherData, 'Hourly weather forecast retrieved successfully.');
    } catch (error) {
      responseUtils.handleFailure(res, error.message);
    }
  },

  getDailyForecast: async (req, res) => {
    const { q } = req.query;
    if (!q) {
      return responseUtils.handleBadRequest(res, 'Location query parameter is required.');
    }

    try {
      const weatherData = await weatherService.getDailyForecast(q);
      responseUtils.handleSuccess(res, weatherData, 'Daily weather forecast retrieved successfully.');
    } catch (error) {
      responseUtils.handleFailure(res, error.message);
    }
  },

  getThreeDayForecast: async (req, res) => {
    const { q } = req.query;
    if (!q) {
      return responseUtils.handleBadRequest(res, 'Location query parameter is required.');
    }

    try {
      const weatherData = await weatherService.getThreeDayForecast(q);
      responseUtils.handleSuccess(res, weatherData, '3-day weather forecast retrieved successfully.');
    } catch (error) {
      responseUtils.handleFailure(res, error.message);
    }
  },

  getLocationBasedForecast: async (req, res) => {
    let { q, lat, lon } = req.query;
    

    if (lat && lon) {
      q = `${lat},${lon}`;
    }
    if (!q) {
      return responseUtils.handleBadRequest(res, 'A location query parameter (either q, or lat and lon) is required.');
    }

    try {
      const weatherData = await weatherService.getLocationBasedForecast(q);
      responseUtils.handleSuccess(res, weatherData, 'Location-based weather forecast retrieved successfully.');
    } catch (error) {
      responseUtils.handleFailure(res, error.message);
    }
}
};

module.exports = forecastweatherController;
