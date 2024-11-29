const express = require('express');
const router = express.Router();
const { extremeWeatherAlertController }  = require('../controllers');

// Define routes for extreme weather alerts
router.get('/extreme-weather-alerts', extremeWeatherAlertController.getExtremeWeatherAlerts);
router.get('/storm-alerts', extremeWeatherAlertController.getStormAlerts);
router.get('/flood-alerts', extremeWeatherAlertController.getFloodAlerts);
router.get('/temperature-alerts', extremeWeatherAlertController.getTemperatureAlerts);
router.get('/rain-alerts', extremeWeatherAlertController.getRainAlerts);
router.post('/custom-alerts', extremeWeatherAlertController.getCustomAlert); // Custom alerts using POST

module.exports = router;
