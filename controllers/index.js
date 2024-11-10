const dummyController = require('./dummyController');
const weatherController = require('./realTimeWeatherController')
const forecastweatherController = require('./ForecastWeatherController')
const recommendationController = require('./recommendationController')
// add more controllers here

module.exports = {
  dummyController,
  weatherController,
  forecastweatherController,
  recommendationController
  
  // export more controllers here
};