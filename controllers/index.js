const dummyController = require('./dummyController');
const weatherController = require('./realTimeWeatherController')
const forecastweatherController = require('./ForecastWeatherController')
// add more controllers here

module.exports = {
  dummyController,
  weatherController,
  forecastweatherController
  
  // export more controllers here
};