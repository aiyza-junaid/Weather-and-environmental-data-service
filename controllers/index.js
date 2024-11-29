const dummyController = require('./dummyController');
const weatherController = require('./realTimeWeatherController')
const forecastweatherController = require('./ForecastWeatherController')
const cropDataController = require('./cropDataController')
const farmingActivityController = require('./farmingActivityController')
const ExtremeWeatherAlertController = require('./ExtremeWeatherAlertController')

module.exports = {
  dummyController,
  weatherController,
  forecastweatherController,
  ExtremeWeatherAlertController,
  cropDataController,
  farmingActivityController
};