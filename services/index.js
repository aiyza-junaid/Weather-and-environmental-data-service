const dummyService = require("./dummyService");
const realTimeWeatherService = require("./realTimeWeatherService")
const forecastWeatherService = require("./forecastWeatherService")

const extremeWeatherAlertService = require("./extremeWeatherAlertService")
const historicalWeatherService = require("./historicalWeatherService")

module.exports = {
  dummyService,
  realTimeWeatherService,
  forecastWeatherService,
  WeatherAlertService,
  extremeWeatherAlertService,
  historicalWeatherService
};
