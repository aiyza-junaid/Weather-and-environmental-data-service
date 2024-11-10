const dummyController = require('./dummyController');
const weatherController = require('./realTimeWeatherController')
const forecastweatherController = require('./ForecastWeatherController')
const cropDataController = require('./cropDataController')
// add more controllers here

module.exports = {
  dummyController,
  weatherController,
  forecastweatherController,
  cropDataController
  
  // export more controllers here
};