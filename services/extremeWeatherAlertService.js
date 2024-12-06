const axios = require('axios');
const nodemailer = require('nodemailer');
const forecastWeatherService = require('./forecastWeatherService');
require('dotenv').config();

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

});

/**
 * Generate weather alerts based on thresholds and weather data.
 * @param {Object} weatherData - Weather data from the API.
 * @param {string} location - User's location.
 * @param {Object} thresholds - User-specific thresholds for alerts.
 * @returns {Array<Object>} - Array of generated alerts.
 */
const generateWeatherAlerts = (weatherData, location, thresholds) => {
  const alerts = [];

  // Heat Alert
  if (weatherData.current.temp_c > thresholds.temperature.heat) {
    alerts.push({
      alertId: `${location}_heat_${Date.now()}`,
      alertType: 'extreme_weather',
      alertCondition: {
        conditionType: 'Temperature',
        conditionDescription: `Heat Alert: Temperature exceeds ${thresholds.temperature.heat}°C`,
      },
    });
  }

  // Frost Warning
  if (weatherData.current.temp_c < thresholds.temperature.frost) {
    alerts.push({
      alertId: `${location}_frost_${Date.now()}`,
      alertType: 'frost_warning',
      alertCondition: {
        conditionType: 'Temperature',
        conditionDescription: `Frost Warning: Temperature below ${thresholds.temperature.frost}°C`,
      },
    });
  }

  // Drought Risk
  if (weatherData.drought_days > thresholds.precipitation.droughtDays) {
    alerts.push({
      alertId: `${location}_drought_${Date.now()}`,
      alertType: 'drought_risk',
      alertCondition: {
        conditionType: 'Precipitation',
        conditionDescription: `Drought Risk: No rain for over ${thresholds.precipitation.droughtDays} days`,
      },
    });
  }

  // Flood Warning
  if (weatherData.current.precip_mm > thresholds.precipitation.flood) {
    alerts.push({
      alertId: `${location}_flood_${Date.now()}`,
      alertType: 'extreme_weather',
      alertCondition: {
        conditionType: 'Flood',
        conditionDescription: `Flood Warning: Heavy rainfall exceeds ${thresholds.precipitation.flood} mm`,
      },
    });
  }

  // Pest Risk Alert
  const [minTemp, maxTemp] = thresholds.humidity.pestRiskTempRange;
  if (
    weatherData.current.humidity > thresholds.humidity.pestRiskHumidity &&
    weatherData.current.temp_c >= minTemp &&
    weatherData.current.temp_c <= maxTemp
  ) {
    alerts.push({
      alertId: `${location}_pest_${Date.now()}`,
      alertType: 'pest_risk',
      alertCondition: {
        conditionType: 'Pest Risk',
        conditionDescription: `Pest Risk Alert: Humidity > ${thresholds.humidity.pestRiskHumidity}%, Temperature between ${minTemp}°C and ${maxTemp}°C`,
      },
    });
  }

  // Wind Alert
  if (weatherData.current.wind_kph > thresholds.wind.strongWind) {
    alerts.push({
      alertId: `${location}_wind_${Date.now()}`,
      alertType: 'extreme_weather',
      alertCondition: {
        conditionType: 'Wind',
        conditionDescription: `Wind Alert: Wind speed exceeds ${thresholds.wind.strongWind} km/h`,
      },
    });
  }

  // UV Alert
  if (weatherData.current.uv > thresholds.uv.highUV) {
    alerts.push({
      alertId: `${location}_uv_${Date.now()}`,
      alertType: 'extreme_weather',
      alertCondition: {
        conditionType: 'UV',
        conditionDescription: `UV Alert: UV index exceeds ${thresholds.uv.highUV}`,
      },
    });
  }

  return alerts;
};


const sendAlertEmail = async (alerts, location, recipientEmail) => {
  const emailContent = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <h2 style="text-align: center; color: #0066cc;">Weather Alerts for ${location.address}</h2>
    <p style="text-align: center; font-size: 14px; color: #555;">
      Stay informed with the latest weather updates for your location.
    </p>
    <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
    ${alerts
      .map(
        (alert) => `
          <div style="border: 1px solid #ddd; border-radius: 5px; padding: 15px; margin-bottom: 20px;">
            <h3 style="color: #e74c3c;">⚠️ ${alert.alertType.toUpperCase()}</h3>
            <p><strong>Condition Type:</strong> ${alert.alertCondition.conditionType}</p>
            <p><strong>Description:</strong> ${alert.alertCondition.conditionDescription}</p>
          </div>
        `
      )
      .join('')}
    <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
    <p style="text-align: center; font-size: 12px; color: #999;">
      This is an automated message. Please do not reply.
    </p>
  </div>
`;
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "******" : "Not Set");

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: '56riyaan@gmail.com',
    subject: `AgriLink: Extreme Weather Alerts for ${location.address} 🚨`,
    html: emailContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Weather alerts email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw error;
  }
};

const updateUserThresholds = async (farmerProfileID, newThresholds) => {
  const farmerProfile = await FarmerProfile.findById(farmerProfileID);
  if (!farmerProfile) {
    throw new Error('FarmerProfile not found');
  }

  // Update and save thresholds
  farmerProfile.thresholds = newThresholds;
  await farmerProfile.save();

  return farmerProfile.thresholds; // Return updated thresholds
};

module.exports = { generateWeatherAlerts, sendAlertEmail, updateUserThresholds };

