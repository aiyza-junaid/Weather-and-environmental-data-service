const dummyRoutes = require("./dummyRoutes");
const realtimeweatherRoutes = require("./realTimeWeatherRoute")
const forecastWeatherRoutes = require("./ForecastWeatherRoute")
const extremeWeatherAlertRoute = require('./ExtremeWeatherAlertRoute');

// add more routes here

module.exports = {
  dummyRoutes,
  realtimeweatherRoutes,
  forecastWeatherRoutes,
  extremeWeatherAlertRoute
  
  // export more routes here
};
