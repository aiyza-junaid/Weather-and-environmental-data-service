const dummyRoutes = require("./dummyRoutes");
const realtimeweatherRoutes = require("./realTimeWeatherRoute");
const forecastWeatherRoutes = require("./ForecastWeatherRoute");
const cropDataRoutes = require("./cropDataRoutes");
const farmingActivityRoutes = require("./farmingActivityRoutes");
const extremeWeatherAlertRoute = require("./ExtremeWeatherAlertRoute");
const historicalWeatherRoute = require("./historicalWeatherRoute")

module.exports = {
  dummyRoutes,
  realtimeweatherRoutes,
  forecastWeatherRoutes,
  extremeWeatherAlertRoute,
  cropDataRoutes,
  farmingActivityRoutes,
  historicalWeatherRoute
};
