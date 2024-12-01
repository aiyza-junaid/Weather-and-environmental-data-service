const dummyService = require("./dummyService");
const realTimeWeatherService = require("./realTimeWeatherService")
const forecastWeatherService = require("./forecastWeatherService")
const WeatherAlertService = require("./extremeWeatherAlertService")

module.exports = {
  dummyService,
  realTimeWeatherService,
  forecastWeatherService,
  WeatherAlertService,
};
