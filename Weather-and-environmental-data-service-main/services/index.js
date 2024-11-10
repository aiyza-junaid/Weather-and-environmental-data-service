const dummyService = require("./dummyService");
const realTimeWeatherService = require("./realTimeWeatherService")
const forecastWeatherService = require("./forecastWeatherService")
// add more services here

module.exports = {
  dummyService,
  realTimeWeatherService,
  forecastWeatherService,
  extremeWeatherAlertService: require('./extremeWeatherAlertService'),

  // export more services here
};
