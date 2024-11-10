const express = require('express');
const router = express.Router();
const forecastweatherController = require('../controllers/ForecastWeatherController');


router.get('/hourly', forecastweatherController.getHourlyForecast);

router.get('/daily', forecastweatherController.getDailyForecast);

router.get('/3-day', forecastweatherController.getThreeDayForecast);

router.get('/location-based', forecastweatherController.getLocationBasedForecast);

module.exports = router;
