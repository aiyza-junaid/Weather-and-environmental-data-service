const dummyController = require('./dummyController');
const weatherController = require('./realTimeWeatherController')
const forecastweatherController = require('./ForecastWeatherController')
const cropDataController = require('./cropDataController')
const farmingActivityController = require('./farmingActivityController')

module.exports = {
  dummyController,
  weatherController,
  forecastweatherController,
  cropDataController,
  farmingActivityController
};