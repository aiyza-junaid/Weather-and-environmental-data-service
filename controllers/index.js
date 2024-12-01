const dummyController = require('./dummyController');
const weatherController = require('./realTimeWeatherController')
const forecastweatherController = require('./ForecastWeatherController')
const cropDataController = require('./cropDataController')
const farmingActivityController = require('./farmingActivityController')
const extremeWeatherAlertController = require('./ExtremeWeatherAlertController')
const historicalWeatherController = require("./historicalWeatherController")

module.exports = {
  dummyController,
  weatherController,
  forecastweatherController,
  extremeWeatherAlertController,
  cropDataController,
  farmingActivityController,
  historicalWeatherController
};