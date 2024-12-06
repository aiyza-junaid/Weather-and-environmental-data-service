const { User, Role, Permission } = require('../models/User'); // Adjust the path as needed
const FarmerProfile = require('../models/FarmerProfile'); // Adjust import path as needed

const forecastWeatherService = require('../services/forecastWeatherService'); // Import the forecast weather service
const { generateWeatherAlerts, sendAlertEmail } = require('../services/extremeWeatherAlertService'); // Import the generateWeatherAlerts and sendAlertEmail functions
const { ObjectId } = require('mongodb'); // Import ObjectId from MongoDB

// GET Route: Get weather alerts based on location
const getWeatherAlerts = async (req, res) => {
  const { user } = req.query;

  if (!user) {
    return res.status(400).json({ message: 'User ID is required' });
  }
 


  try {
    // Check if the farmer profile exists

    // Check if the farmer profile exists
    const farmerProfile = await FarmerProfile.findOne({ user}).populate('user', 'email');
    
        if (!farmerProfile) {
      return res.status(404).json({ message: 'Farmer profile not found' });
    }

    const email = farmerProfile.user?.email; // Email from User model
    const thresholds = farmerProfile.thresholds; // Thresholds object
    const location = farmerProfile.farmDetails?.farmLocation; // Farm location object

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
  const user = req.query.user.trim(); // Trim any extra whitespace or newline characters

  
  if (!user) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    // Check if the farmer profile exists
    const farmerProfile = await FarmerProfile.findOne({ user }); // Populate email from User model
    const userP = await User.findById(user); // Correct population using user _id

    if (!farmerProfile) {
      return res.status(404).json({ message: 'Farmer profile not found' });
    }
    

    const email = userP.personalDetails.contactInfo.email;
    const thresholds = farmerProfile.thresholds; // Thresholds object

    const location = farmerProfile.farmDetails?.farmLocation; // Farm location object

    const weatherData = await forecastWeatherService.getLocationBasedForecast(location, 3); // 3-day forecast
    const alerts = generateWeatherAlerts(weatherData, location, thresholds); // Use thresholds for generating alerts

    if (alerts.length > 0) {
      await sendAlertEmail(alerts, location, email); // Send the email to the recipient
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


const updateThresholds = async (req, res) => {
  const { user, newThresholds } = req.body;

  if (!user) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const farmerProfile = await FarmerProfile.findOne({ user });
    if (!farmerProfile) {
      return res.status(404).json({ message: 'Farmer profile not found' });
    }

    // Update temperature thresholds if provided
    if (newThresholds.temperature) {
      if (newThresholds.temperature.heat !== undefined) {
        farmerProfile.thresholds.temperature.heat = newThresholds.temperature.heat;
      }
      if (newThresholds.temperature.frost !== undefined) {
        farmerProfile.thresholds.temperature.frost = newThresholds.temperature.frost;
      }
    }

    // Update precipitation thresholds if provided
    if (newThresholds.precipitation) {
      if (newThresholds.precipitation.droughtDays !== undefined) {
        farmerProfile.thresholds.precipitation.droughtDays = newThresholds.precipitation.droughtDays;
      }
      if (newThresholds.precipitation.flood !== undefined) {
        farmerProfile.thresholds.precipitation.flood = newThresholds.precipitation.flood;
      }
    }

    // Update humidity thresholds if provided
    if (newThresholds.humidity) {
      if (newThresholds.humidity.pestRiskHumidity !== undefined) {
        farmerProfile.thresholds.humidity.pestRiskHumidity = newThresholds.humidity.pestRiskHumidity;
      }
      if (newThresholds.humidity.pestRiskTempRange !== undefined) {
        farmerProfile.thresholds.humidity.pestRiskTempRange = newThresholds.humidity.pestRiskTempRange;
      }
    }

    // Update wind thresholds if provided
    if (newThresholds.wind) {
      if (newThresholds.wind.strongWind !== undefined) {
        farmerProfile.thresholds.wind.strongWind = newThresholds.wind.strongWind;
      }
    }

    // Update UV thresholds if provided
    if (newThresholds.uv) {
      if (newThresholds.uv.highUV !== undefined) {
        farmerProfile.thresholds.uv.highUV = newThresholds.uv.highUV;
      }
    }

    // Save the updated farmer profile
    await farmerProfile.save();

    res.status(200).json({
      message: 'Thresholds updated successfully',
      updatedThresholds: farmerProfile.thresholds,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating thresholds', error: error.message });
  }
};


module.exports = {
  getWeatherAlerts,
  sendWeatherAlertsEmail,
  updateThresholds,
};
