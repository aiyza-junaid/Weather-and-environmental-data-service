module.exports = {
  temperature: {
    heat: 45,  // Temperature > 45°C triggers heat alert
    frost: 4,  // Temperature < 4°C triggers frost alert
  },
  drought: {
    noRainDays: 10,  // No rain for 10 days triggers drought alert
  },
  storm: {
    keyword: "storm",  // Alert if the forecast contains the word 'storm'
  },
  flood: {
    rainfall: 70,  // If rainfall > 70mm triggers flood alert
    rainIntensity: {
      threshold: 10,  // 10mm/h of rainfall triggers a heavy rain alert
      duration: 2,    // Rain lasting more than 2 hours triggers a prolonged rain alert
    },
  },
  hail: {
    keyword: "hail",  // Alert if the forecast contains the word 'hail'
  },
  pestRisk: {
    humidity: 70,  // High humidity > 70% triggers pest risk alert
    temperatureRange: [20, 30],  // Temperature between 20°C and 30°C triggers pest risk alert
  },
  wind: {
    speed: 60,  // Wind speed > 60 km/h triggers wind alert
  },
  soilDryness: {
    dryDays: 7,  // No rain for 7 days triggers soil dryness alert
  },
  uvIndex: {
    threshold: 8,  // UV index > 8 triggers UV alert
  },
  harvestReadiness: {
    temperatureRange: [20, 35],  // Temperature between 20°C and 35°C triggers harvest readiness
    maxPrecipitation: 5,  // Precipitation < 5mm triggers harvest readiness
  },
  airQuality: {
    pm25: 100,  // PM2.5 levels above 100 µg/m³ trigger an air quality alert
    pm10: 150,  // PM10 levels above 150 µg/m³ trigger an air quality alert
  },
  // Customizable alert preferences
  alertsPreferences: {
    temperatureAlert: true,
    droughtAlert: false,
    stormAlert: true,
    floodAlert: true,
    hailAlert: true,
    pestRiskAlert: false,
    windAlert: true,
    soilDrynessAlert: true,
    uvIndexAlert: true,
    harvestReadinessAlert: true,
    airQualityAlert: false,
  },
  // Severity levels for alerts
  severity: {
    heat: "High",
    frost: "Medium",
    drought: "High",
    storm: "High",
    flood: "High",
    hail: "Medium",
    pestRisk: "Medium",
    wind: "High",
    soilDryness: "Medium",
    uvIndex: "High",
    harvestReadiness: "Low",
    airQuality: "High",
  },
  // Location-specific thresholds
  locationSpecificThresholds: {
    urban: {
      temperature: { heat: 40, frost: 5 },
      drought: { noRainDays: 12 },
      wind: { speed: 70 },
    },
    rural: {
      temperature: { heat: 42, frost: 3 },
      drought: { noRainDays: 8 },
      wind: { speed: 60 },
    },
  },
  // Seasonal thresholds
  seasonalThresholds: {
    winter: {
      temperature: { frost: -5 },
      drought: { noRainDays: 15 },
    },
    summer: {
      temperature: { heat: 38 },
      drought: { noRainDays: 8 },
    },
  },
};
