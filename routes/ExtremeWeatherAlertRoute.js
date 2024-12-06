const express = require('express');
const router = express.Router();
const { getWeatherAlerts, sendWeatherAlertsEmail, updateThresholds } = require('../controllers/ExtremeWeatherAlertController');

// GET route to fetch weather alerts
router.get('/check', getWeatherAlerts);

// POST route to send weather alerts email
router.post('/send-email', sendWeatherAlertsEmail); // Corrected POST route

router.patch('/update-thresholds', updateThresholds);




module.exports = router;
