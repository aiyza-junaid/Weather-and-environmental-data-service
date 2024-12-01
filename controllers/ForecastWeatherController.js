const express = require('express');
const { getLocationBasedForecast } = require('./forecastWeatherService');
const { sendEmailAlert, sendPushNotification } = require('../services/emailService');
const WeatherAlertService = require('../services/extremeWeatherAlertService');
const weatherAlertsConfig = require('../utils/thresholds');

const router = express.Router();

// Controller to generate weather alerts for a specific location
router.post('/generate-alerts', async (req, res) => {
  try {
    // Retrieve location and user details from request body
    const { location, user } = req.body;

    // Initialize the WeatherAlertService with user preferences, location, and user details
    const weatherAlertService = new WeatherAlertService({}, location, user); // Assuming user preferences are provided in the body if required

    // Fetch weather data for the location
    const weatherData = await getLocationBasedForecast(location, 1); // Get the forecast for the next day

    // Generate weather alerts based on the fetched weather data
    const alerts = weatherAlertService.generateWeatherAlerts(weatherData);

    // If there are alerts, send them to the user via email and push notification
    if (alerts.length > 0) {
      console.log(`Weather Alerts for ${location}:`);
      alerts.forEach(alert => {
        console.log(`${alert.alertCondition.extremeWeather.conditionDescription}`);
      });

      // Send alerts to the user
      await weatherAlertService.sendAlerts(alerts);

      // Respond to the client with a success message
      return res.status(200).json({
        message: 'Weather alerts generated and sent successfully.',
        alerts: alerts
      });
    } else {
      // No alerts to send
      return res.status(200).json({
        message: `No weather alerts for ${location}.`
      });
    }

  } catch (error) {
    console.error("Error generating weather alerts:", error);
    // Handle any errors that occurred during the process
    return res.status(500).json({
      message: 'Error generating weather alerts.',
      error: error.message
    });
  }
});

// Controller to fetch weather data for a given location (optional helper endpoint)
router.get('/weather-data', async (req, res) => {
  try {
    const { location } = req.query; // Get location from query parameters

    // Fetch weather data for the location
    const weatherData = await getLocationBasedForecast(location, 1); // Get the forecast for the next day

    // Send the weather data as a response
    return res.status(200).json({
      location: location,
      weatherData: weatherData
    });

  } catch (error) {
    console.error("Error fetching weather data:", error);
    return res.status(500).json({
      message: 'Error fetching weather data.',
      error: error.message
    });
  }
});

module.exports = router;
