// weatherAlertService.js
const { getLocationBasedForecast } = require('./forecastWeatherService');
const { sendEmailAlert, sendPushNotification } = require('./alertService');
const weatherAlertsConfig = require('../utils/thresholds');

class WeatherAlertService {
  constructor(userPreferences, location, user) {
    this.userPreferences = userPreferences;  // User preferences for alert notifications
    this.location = location;  // Location for weather data
    this.user = user;  // User details for notification (email, pushToken)
  }

  // Helper function to create an alert
  createAlert(alertType, conditionType, conditionDescription, severity) {
    return {
      alertId: `${this.location}_${alertType}_${Date.now()}`,
      userId: this.user.email,
      alertType: alertType,
      severity: severity,
      alertCondition: {
        extremeWeather: {
          conditionType: conditionType,
          conditionDescription: conditionDescription,
        },
      },
    };
  }

  // Helper function to check if a condition crosses the threshold
  checkThreshold(value, threshold, comparison) {
    switch (comparison) {
      case 'greater':
        return value > threshold;
      case 'less':
        return value < threshold;
      case 'greaterEqual':
        return value >= threshold;
      case 'lessEqual':
        return value <= threshold;
      default:
        return false;
    }
  }

  // Generate weather alerts based on weather data
  generateWeatherAlerts(weatherData) {
    const alerts = [];
    const locationThresholds = weatherAlertsConfig.locationSpecificThresholds[this.location] || {};

    // Heat Alert (Temperature exceeds threshold)
    if (this.checkThreshold(weatherData.current.temp_c, weatherAlertsConfig.temperature.heat, 'greater')) {
      alerts.push(this.createAlert("heat_alert", "Temperature", `Heat Alert: Temperature exceeds ${weatherAlertsConfig.temperature.heat}°C`, weatherAlertsConfig.severity.heat));
    }

    // Frost Alert (Temperature below threshold)
    if (this.checkThreshold(weatherData.current.temp_c, weatherAlertsConfig.temperature.frost, 'less')) {
      alerts.push(this.createAlert("frost_warning", "Temperature", `Frost Warning: Temperature below ${weatherAlertsConfig.temperature.frost}°C`, weatherAlertsConfig.severity.frost));
    }

    // Drought Alert (No precipitation over a certain number of days)
    if (this.checkThreshold(weatherData.forecast.forecastday[0].day.totalprecip_mm, weatherAlertsConfig.drought.noRainDays, 'less')) {
      alerts.push(this.createAlert("drought_alert", "Precipitation", `Drought Alert: No rain for ${weatherAlertsConfig.drought.noRainDays} days`, weatherAlertsConfig.severity.drought));
    }

    // Storm Alert (Condition contains storm)
    if (weatherData.forecast.forecastday[0].day.condition.text.toLowerCase().includes(weatherAlertsConfig.storm.keyword)) {
      alerts.push(this.createAlert("storm_alert", "Weather", "Storm Alert: Storm expected in the forecast", weatherAlertsConfig.severity.storm));
    }

    // Flood Alert (Heavy rainfall or prolonged rain)
    if (this.checkThreshold(weatherData.forecast.forecastday[0].day.totalprecip_mm, weatherAlertsConfig.flood.rainfall, 'greater')) {
      alerts.push(this.createAlert("flood_alert", "Precipitation", "Flood Alert: Heavy rainfall expected", weatherAlertsConfig.severity.flood));
    }

    // Hail Alert (Condition contains hail)
    if (weatherData.forecast.forecastday[0].day.condition.text.toLowerCase().includes(weatherAlertsConfig.hail.keyword)) {
      alerts.push(this.createAlert("hail_alert", "Weather", "Hail Alert: Hail expected in the forecast", weatherAlertsConfig.severity.hail));
    }

    // Pest Risk Alert (High humidity and favorable temperature range)
    if (this.checkThreshold(weatherData.current.humidity, weatherAlertsConfig.pestRisk.humidity, 'greater') &&
        weatherData.current.temp_c >= weatherAlertsConfig.pestRisk.temperatureRange[0] &&
        weatherData.current.temp_c <= weatherAlertsConfig.pestRisk.temperatureRange[1]) {
      alerts.push(this.createAlert("pest_risk_alert", "Weather", "Pest Risk Alert: High humidity and favorable temperature for pests", weatherAlertsConfig.severity.pestRisk));
    }

    // Wind Alert (High wind speed)
    if (this.checkThreshold(weatherData.current.wind_kph, weatherAlertsConfig.wind.speed, 'greater')) {
      alerts.push(this.createAlert("wind_alert", "Wind", `Wind Alert: Wind speed exceeds ${weatherAlertsConfig.wind.speed} km/h`, weatherAlertsConfig.severity.wind));
    }

    // Soil Dryness Alert (No rain for certain days)
    if (this.checkThreshold(weatherData.forecast.forecastday[0].day.totalprecip_mm, weatherAlertsConfig.soilDryness.dryDays, 'less')) {
      alerts.push(this.createAlert("soil_dryness_alert", "Precipitation", `Soil Dryness Alert: No rain for ${weatherAlertsConfig.soilDryness.dryDays} days`, weatherAlertsConfig.severity.soilDryness));
    }

    // UV Index Alert (High UV index)
    if (this.checkThreshold(weatherData.current.uv, weatherAlertsConfig.uvIndex.threshold, 'greater')) {
      alerts.push(this.createAlert("uv_index_alert", "UV Index", `UV Index Alert: UV index exceeds ${weatherAlertsConfig.uvIndex.threshold}`, weatherAlertsConfig.severity.uvIndex));
    }

    // Harvest Readiness Alert (Temperature and precipitation conditions for harvest)
    if (weatherData.current.temp_c >= weatherAlertsConfig.harvestReadiness.temperatureRange[0] &&
        weatherData.current.temp_c <= weatherAlertsConfig.harvestReadiness.temperatureRange[1] &&
        this.checkThreshold(weatherData.forecast.forecastday[0].day.totalprecip_mm, weatherAlertsConfig.harvestReadiness.maxPrecipitation, 'less')) {
      alerts.push(this.createAlert("harvest_readiness_alert", "Harvest", "Harvest Readiness Alert: Suitable conditions for harvest", weatherAlertsConfig.severity.harvestReadiness));
    }

    

    return alerts;
  }

  // Function to send generated alerts to the user via email and push notification
  async sendAlerts(alerts) {
    for (const alert of alerts) {
      // Send email alert
      await sendEmailAlert(this.user.email, 'Weather Alert', alert.alertCondition.extremeWeather.conditionDescription);
      
      // Send push notification (if push token is available)
      if (this.user.pushToken) {
        await sendPushNotification(this.user.pushToken, alert.alertCondition.extremeWeather.conditionDescription);
      }
    }
  }

  // Main function to handle the entire alert generation and sending process
  async handleWeatherAlerts() {
    try {
      const weatherData = await getLocationBasedForecast(this.location, 1);  // Fetch weather for the next day

      // Generate weather alerts based on the fetched data
      const alerts = this.generateWeatherAlerts(weatherData);

      // If there are alerts, send them to the user
      if (alerts.length > 0) {
        console.log(`Weather Alerts for ${this.location}:`);
        alerts.forEach(alert => {
          console.log(`${alert.alertCondition.extremeWeather.conditionDescription}`);
        });
        await this.sendAlerts(alerts);
      } else {
        console.log(`No weather alerts for ${this.location}`);
      }
    } catch (error) {
      console.error("Error retrieving weather alerts:", error);
    }
  }
}

module.exports = WeatherAlertService;
