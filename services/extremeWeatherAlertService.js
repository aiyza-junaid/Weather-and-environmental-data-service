const axios = require('axios');
const forecastWeatherService = require('./forecastWeatherService'); // Assuming this is the path

// Function to generate alerts based on weather conditions specific to Pakistan
const generateWeatherAlerts = (weatherData, location) => {
  const alerts = [];

  // Temperature Alert: High temperatures (example: > 40°C for Pakistan)
  if (weatherData.current.temp_c > 45) {
    alerts.push({
      alertId: `${location}_heat_${Date.now()}`,
      userId: location,
      alertType: "extreme_weather",
      alertCondition: {
        extremeWeather: {
          conditionType: "Temperature",
          conditionDescription: "Heat Alert: Temperature exceeds 45°C",
        },
      },
    });
  }

  // Frost Warning: Low temperatures (example: < 4°C for frost)
  if (weatherData.current.temp_c < 4) {
    alerts.push({
      alertId: `${location}_frost_${Date.now()}`,
      userId: location,
      alertType: "frost_warning",
      alertCondition: {
        extremeWeather: {
          conditionType: "Temperature",
          conditionDescription: "Frost Warning: Temperature below 4°C",
        },
      },
    });
  }

  // Drought Risk: No rainfall for 10 consecutive days (example: Check weatherData.history)
  if (weatherData.drought_days > 10) {
    alerts.push({
      alertId: `${location}_drought_${Date.now()}`,
      userId: location,
      alertType: "drought_risk",
      alertCondition: {
        extremeWeather: {
          conditionType: "Precipitation",
          conditionDescription: "Drought Risk: No rain for over 10 days",
        },
      },
    });
  }

  // Storm Alert
  if (weatherData.current.condition.text.toLowerCase().includes("storm")) {
    alerts.push({
      alertId: `${location}_storm_${Date.now()}`,
      userId: location,
      alertType: "extreme_weather",
      alertCondition: {
        extremeWeather: {
          conditionType: "Storm",
          conditionDescription: "Storm Alert: Severe weather conditions expected",
        },
      },
    });
  }

  // Flood Warning: High rainfall
  if (weatherData.current.precip_mm > 70) {
    alerts.push({
      alertId: `${location}_flood_${Date.now()}`,
      userId: location,
      alertType: "extreme_weather",
      alertCondition: {
        extremeWeather: {
          conditionType: "Flood",
          conditionDescription: "Flood Warning: Heavy rainfall detected",
        },
      },
    });
  }

  // Hail Warning: Keywords indicating hail in forecast
  if (weatherData.current.condition.text.toLowerCase().includes("hail")) {
    alerts.push({
      alertId: `${location}_hail_${Date.now()}`,
      userId: location,
      alertType: "hail_warning",
      alertCondition: {
        extremeWeather: {
          conditionType: "Hail",
          conditionDescription: "Hail Warning: Potential hailstorm expected",
        },
      },
    });
  }

  // Pest Risk Indicator: High humidity and moderate temperature
  if (weatherData.current.humidity > 70 && weatherData.current.temp_c >= 20 && weatherData.current.temp_c <= 30) {
    alerts.push({
      alertId: `${location}_pest_${Date.now()}`,
      userId: location,
      alertType: "pest_risk",
      alertCondition: {
        extremeWeather: {
          conditionType: "Pest Risk",
          conditionDescription: "Pest Risk Alert: Conditions favorable for pest infestations",
        },
      },
    });
  }

  // Wind Speed Alert: Strong winds
  if (weatherData.current.wind_kph > 60) {
    alerts.push({
      alertId: `${location}_wind_${Date.now()}`,
      userId: location,
      alertType: "extreme_weather",
      alertCondition: {
        extremeWeather: {
          conditionType: "Wind",
          conditionDescription: "Wind Alert: Wind speed exceeds 60 km/h",
        },
      },
    });
  }

  // Soil Dryness Alert: Low precipitation over a week
  if (weatherData.dry_days > 7) {
    alerts.push({
      alertId: `${location}_soil_dryness_${Date.now()}`,
      userId: location,
      alertType: "soil_dryness",
      alertCondition: {
        extremeWeather: {
          conditionType: "Soil Moisture",
          conditionDescription: "Soil Dryness Alert: Prolonged dryness detected",
        },
      },
    });
  }

  // UV Index Alert
  if (weatherData.current.uv > 8) {
    alerts.push({
      alertId: `${location}_uv_${Date.now()}`,
      userId: location,
      alertType: "extreme_weather",
      alertCondition: {
        extremeWeather: {
          conditionType: "UV",
          conditionDescription: "UV Alert: UV index exceeds 8",
        },
      },
    });
  }

  // Harvest Readiness Indicator: Moderate temperatures and dry conditions
  if (weatherData.current.temp_c > 20 && weatherData.current.temp_c < 35 && weatherData.current.precip_mm < 5) {
    alerts.push({
      alertId: `${location}_harvest_${Date.now()}`,
      userId: location,
      alertType: "harvest_ready",
      alertCondition: {
        extremeWeather: {
          conditionType: "Harvest",
          conditionDescription: "Harvest Ready: Favorable weather conditions for harvesting",
        },
      },
    });
  }

  return alerts;
};

// Function to get weather data from forecast service and generate alerts
const getLocationWeatherAlerts = async (location) => {
  try {
    const weatherData = await forecastWeatherService.getLocationBasedForecast(location, 1); // Get the daily forecast

    const alerts = generateWeatherAlerts(weatherData, location);

    if (alerts.length > 0) {
      console.log(`Weather Alerts for ${location}:`);
      alerts.forEach((alert, index) => {
        console.log(`${index + 1}. Alert ID: ${alert.alertId}`);
        console.log(`   Alert Type: ${alert.alertType}`);
        console.log(`   Condition Type: ${alert.alertCondition.extremeWeather.conditionType}`);
        console.log(`   Condition Description: ${alert.alertCondition.extremeWeather.conditionDescription}`);
      });
    } else {
      console.log(`No weather alerts for ${location}`);
    }
  } catch (error) {
    console.error("Error retrieving weather alerts:", error);
  }
};

// Example usage
//const location = "Toronto";
// getLocationWeatherAlerts(location);
