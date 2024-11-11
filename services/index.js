const dummyService = require("../Weather-and-environmental-data-service-main/services/dummyService");
const realTimeWeatherService = require("../Weather-and-environmental-data-service-main/services/realTimeWeatherService")
const forecastWeatherService = require("../Weather-and-environmental-data-service-main/services/forecastWeatherService")
// add more services here

module.exports = {
  dummyService,
  realTimeWeatherService,
  forecastWeatherService,
  extremeWeatherAlertService: require('./extremeWeatherAlertService'),

  // export more services here
};
