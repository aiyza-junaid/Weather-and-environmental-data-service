const express = require('express');
const historicalWeatherController = require('../controllers/historicalWeatherController');

const router = express.Router();

router.get('/historical-weather', historicalWeatherController.getHistoricalWeather);

module.exports = router;
