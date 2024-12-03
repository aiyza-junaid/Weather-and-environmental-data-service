const express = require('express');
const router = express.Router();
const { getWeatherAlerts, sendWeatherAlertsEmail } = require('../controllers/ExtremeWeatherAlertController');

// GET route to fetch weather alerts
router.get('/:location', getWeatherAlerts);

// POST route to send weather alerts email
router.post('/send-email', sendWeatherAlertsEmail); // Corrected POST route

router.put('/update-thresholds', updateThresholds);


module.exports = router;
