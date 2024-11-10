const dummyController = require('./dummyController');
const weatherController = require('./realTimeWeatherController')
const forecastweatherController = require('./ForecastWeatherController')
const ExtremeWeatherAlertController= require('./ExtremeWeatherAlertController')

module.exports = {
  dummyController,
  weatherController,
  forecastweatherController,
  ExtremeWeatherAlertController
  
  // export more controllers here
};