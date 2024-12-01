const express = require('express');
const router = express.Router();
const { weatherAlertController }  = require('../controllers/ExtremeWeatherAlertController');

router.post('/alerts/generate-alerts', async (req, res) => {
    try {
      const { userPreferences, location, user } = req.body;
  
      if (!userPreferences || !location || !user) {
        return res.status(400).json({ message: 'Missing required parameters' });
      }
  
      // Call the controller's method to handle the alerts generation
      const weatherAlertService = new weatherAlertController(userPreferences, location, user);
      await weatherAlertService.handleWeatherAlerts();
  
      return res.status(200).json({ message: 'Weather alerts generated successfully' });
    } catch (error) {
      console.error('Error generating alerts:', error);
      return res.status(500).json({ message: 'Error generating weather alerts', error: error.message });
    }
  });
  
  // Route to get weather data for a specific location
  router.get('/weather/:location', async (req, res) => {
    try {
      const location = req.params.location;
  
      // Fetch weather data (assuming you have a weather service for this)
      const weatherData = await getLocationBasedForecast(location, 1);  // Fetch weather for the next day
      return res.status(200).json({ weatherData });
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return res.status(500).json({ message: 'Error fetching weather data', error: error.message });
    }
  });
  

module.exports = router;
