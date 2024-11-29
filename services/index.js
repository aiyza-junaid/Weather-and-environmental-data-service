const dummyService = require("./dummyService");
const realTimeWeatherService = require("./realTimeWeatherService")
const forecastWeatherService = require("./forecastWeatherService")
const extremeWeatherAlertService= require('./extremeWeatherAlertService')
// add more services here

module.exports = {
  dummyService,
  realTimeWeatherService,
  forecastWeatherService,
  extremeWeatherAlertService,

  // export more services here
};
