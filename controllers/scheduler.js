const cron = require('node-cron');
const { FarmerProfile } = require('../models/FarmerProfile');
const { User } = require('../models/User'); // Import the User model
const { generateWeatherAlerts, sendAlertEmail } = require('../services/extremeWeatherAlertService');
const forecastWeatherService = require('../services/forecastWeatherService');

// Schedule the cron job at 5:18 AM daily
cron.schedule('50 5 * * *', async () => {  
  try {
    // Fetch all profiles to send alerts
    console.log('Cron job triggered at 5:18 AM');

    const profiles = await FarmerProfile.find({});

    for (const profile of profiles) {
      const location = profile.farmDetails?.farmLocation;
      
      if (!location) continue;  // Skip profiles without a farm location

      try {
        // Get weather data for the location (e.g., 3-day forecast)
        const weatherData = await forecastWeatherService.getLocationBasedForecast(location, 3);

        // Generate weather alerts based on the forecast
        const alerts = generateWeatherAlerts(weatherData, location, profile.thresholds);

        if (alerts.length > 0) {
          // Get the user associated with this farmer profile
          const user = await User.findById(profile.user); // Assuming 'profile.user' stores the user ID

          if (user && user.personalDetails?.contactInfo?.email) {
            const email = user.personalDetails.contactInfo.email;

            // Send the alert email
            await sendAlertEmail(email, alerts);
          } else {
            console.warn(`No email found for user ${profile.user}`);
          }
        }
      } catch (error) {
        console.error(`Error processing profile ${profile._id}:`, error);
      }
    }
  } catch (error) {
    console.error('Error in cron job:', error);
  }
}, {
  scheduled: true,
  timezone: "Asia/Karachi"  // Set the timezone for Islamabad
});
