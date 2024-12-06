const express = require('express');
const historicalWeatherController = require('../controllers/historicalWeatherController');

const router = express.Router();

router.get('/historical-weather', historicalWeatherController.getHistoricalWeather);
router.get('/historical-weather-city', historicalWeatherController.getHistoricalWeatherCity);

module.exports = router;
