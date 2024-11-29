const dummyController = require('./dummyController');
const weatherController = require('./realTimeWeatherController')
const forecastweatherController = require('./ForecastWeatherController')
const cropDataController = require('./cropDataController')
const farmingActivityController = require('./farmingActivityController')
const extremeWeatherAlertController = require('./ExtremeWeatherAlertController')

module.exports = {
  dummyController,
  weatherController,
  forecastweatherController,
  extremeWeatherAlertController,
  cropDataController,
  farmingActivityController
};