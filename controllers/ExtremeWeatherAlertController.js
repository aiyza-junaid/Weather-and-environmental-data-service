// controllers/ExtremeWeatherAlertController.js
const forecastWeatherService = require('../services/forecastWeatherService'); // Import the forecast weather service
const { generateWeatherAlerts, sendAlertEmail } = require('../services/extremeWeatherAlertService'); // Import the generateWeatherAlerts and sendAlertEmail functions

// GET Route: Get weather alerts based on location
const getWeatherAlerts = async (req, res) => {
  const { userID } = req.body;

  if (!userID) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    // Check if the user exists
    const user = await User.findById(userID); // Adjust this according to your database query method
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { location, thresholds } = user; // Extract location and thresholds

    const weatherData = await forecastWeatherService.getLocationBasedForecast(location, 3); // 3-day forecast
    const alerts = generateWeatherAlerts(weatherData, location, thresholds); // Use thresholds for generating alerts

    if (alerts.length > 0) {
      res.status(200).json({
        location: location,
        alerts: alerts,
      });
    } else {
      res.status(200).json({
        location: location,
        message: "No weather alerts",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error fetching weather alerts",
      error: error.message,
    });
  }
};

// POST route: Send weather alerts email
const sendWeatherAlertsEmail = async (req, res) => {
  const { userID } = req.body;

  if (!userID) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    // Check if the user exists
    const user = await User.findById(userID); // Adjust this according to your database query method
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { location, email: recipientEmail, thresholds } = user; // Extract location, email, and thresholds

    const weatherData = await forecastWeatherService.getLocationBasedForecast(location, 3); // 3-day forecast
    const alerts = generateWeatherAlerts(weatherData, location, thresholds); // Use thresholds for generating alerts

    if (alerts.length > 0) {
      await sendAlertEmail(alerts, location, recipientEmail); // Send the email to the recipient
      res.status(200).json({
        location: location,
        alerts: alerts,
        message: 'Weather alerts sent successfully!',
      });
    } else {
      res.status(200).json({
        location: location,
        message: "No weather alerts",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error sending weather alerts email",
      error: error.message,
    });
  }
};

// POST route: Send weather alerts email based on updated thresholds
const updateThresholds = async (req, res) => {
  const { userID, newThresholds } = req.body;

  if (!userID) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    // Check if the user exists
    const user = await User.findById(userID); // Adjust this according to your database query method
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { location, email: recipientEmail } = user; // Extract location and email

    // If new thresholds are provided, update the user's thresholds
    let thresholds = user.thresholds;
    if (newThresholds) {
      thresholds = await updateUserThresholds(userID, newThresholds);
    }

    // Fetch weather data and generate alerts based on updated thresholds
    const weatherData = await forecastWeatherService.getLocationBasedForecast(location, 3); // 3-day forecast
    const alerts = generateWeatherAlerts(weatherData, location, thresholds); // Use updated thresholds for generating alerts

    if (alerts.length > 0) {
      await sendAlertEmail(alerts, location, recipientEmail); // Send the email to the recipient
      res.status(200).json({
        location: location,
        alerts: alerts,
        message: 'Weather alerts sent successfully based on updated thresholds!',
      });
    } else {
      res.status(200).json({
        location: location,
        message: 'No weather alerts based on the provided thresholds',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error sending weather alerts email',
      error: error.message,
    });
  }
};

module.exports = {
  getWeatherAlerts,
  sendWeatherAlertsEmail,
  updateThresholds,
};
