const express = require('express');
const router = express.Router();
const extremeWeatherAlertsController = require('../controllers/ExtremeWeatherAlertController');

router.get('/extreme-weather-alerts', extremeWeatherAlertsController.getExtremeWeatherAlerts);
router.get('/storm-alerts', extremeWeatherAlertsController.getStormAlerts);
router.get('/flood-alerts', extremeWeatherAlertsController.getFloodAlerts);
router.get('/temperature-alerts', extremeWeatherAlertsController.getTemperatureAlerts);
router.get('/rain-alerts', extremeWeatherAlertsController.getRainAlerts);
router.post('/custom-alerts', extremeWeatherAlertsController.getCustomAlert); // Custom alerts using POST

module.exports = router;
