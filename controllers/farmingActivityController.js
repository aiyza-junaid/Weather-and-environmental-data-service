const { responseUtils, cropUtils } = require("../utils");
const path = require("path");
const fs = require("fs");

// Read crop calendar data
const cropData = cropUtils.readJsonData(
  path.join(__dirname, "..", "data", "Crop_Calendar_Data_All.json")
);

const farmingActivityController = {
  // 3.2.1: Suggest times for irrigation, fertilization, and pesticide application
  suggestCropActivities: async (req, res) => {
    try {
      const { country, crop, region, currentWeather } = req.body;

      // Validate input
      if (!country || !crop || !region) {
        return responseUtils.handleBadRequest(
          res,
          "Please provide country, crop, and region"
        );
      }

      // Find specific crop data
      const specificCropData = cropData.find(
        (item) =>
          item["Country Name"] == country &&
          item["Crop"] == crop &&
          item["AgroEcological Zone"] == region
      );

      if (!specificCropData) {
        return responseUtils.handleNotFound(
          res,
          "No crop data found for the specified criteria"
        );
      }

      // Calculate activity timings based on crop data and current weather
      const activities = {
        irrigation: calculateIrrigationTimes(specificCropData, currentWeather),
        fertilization: calculateFertilizationSchedule(specificCropData),
        pesticide: calculatePesticideApplication(
          specificCropData,
          currentWeather
        ),
      };

      return responseUtils.handleSuccess(
        res,
        activities,
        "Crop activity suggestions generated successfully"
      );
    } catch (error) {
      console.error(error);
      return responseUtils.handleFailure(res, error);
    }
  },

  // 3.2.2: Integrate weather-based scheduling with farmer's calendar
  generateFarmingCalendar: async (req, res) => {
    try {
      const { country, crop, region, weatherForecast } = req.body;

      // Validate input
      if (!country || !crop || !region || !weatherForecast) {
        return responseUtils.handleBadRequest(
          res,
          "Please provide country, crop, region, and weather forecast"
        );
      }

      // Find specific crop data
      const specificCropData = cropData.find(
        (item) =>
          item["Country Name"] === country &&
          item["Crop"] === crop &&
          item["AgroEcological Zone"] === region
      );

      if (!specificCropData) {
        return responseUtils.handleNotFound(
          res,
          "No crop data found for the specified criteria"
        );
      }

      // Generate integrated farming calendar
      const farmingCalendar = createWeatherIntegratedCalendar(
        specificCropData,
        weatherForecast
      );

      return responseUtils.handleSuccess(
        res,
        farmingCalendar,
        "Weather-integrated farming calendar generated successfully"
      );
    } catch (error) {
      console.error(error);
      return responseUtils.handleFailure(res, error);
    }
  },

  // 3.2.3: Generate alerts for upcoming farming activities
  generateActivityAlerts: async (req, res) => {
    try {
      const { country, crop, region, weatherForecast } = req.body;

      // Validate input
      if (!country || !crop || !region || !weatherForecast) {
        return responseUtils.handleBadRequest(
          res,
          "Please provide country, crop, region, and weather forecast"
        );
      }

      // Find specific crop data
      const specificCropData = cropData.find(
        (item) =>
          item["Country Name"] === country &&
          item["Crop"] === crop &&
          item["AgroEcological Zone"] === region
      );

      if (!specificCropData) {
        return responseUtils.handleNotFound(
          res,
          "No crop data found for the specified criteria"
        );
      }

      // Generate activity alerts
      const alerts = createActivityAlerts(specificCropData, weatherForecast);

      return responseUtils.handleSuccess(
        res,
        alerts,
        "Farming activity alerts generated successfully"
      );
    } catch (error) {
      console.error(error);
      return responseUtils.handleFailure(res, error);
    }
  },
};

// Helper function to calculate irrigation times
const calculateIrrigationTimes = (cropData, currentWeather) => {
  const sowingPeriod = {
    start: {
      month: parseInt(cropData["Early Sowing"].Month),
      day: parseInt(cropData["Early Sowing"].Day),
    },
    end: {
      month: parseInt(cropData["Later Sowing"].Month),
      day: parseInt(cropData["Later Sowing"].Day),
    },
  };

  const irrigationSchedule = [];
  const growingPeriod = cropData["Growing period"].Value.split(" - ");
  const periodLength = parseInt(growingPeriod[1]);

  // Basic irrigation schedule (adjust based on weather conditions)
  for (let i = 0; i < periodLength; i += 10) {
    // Every 10 days
    const irrigationDate = new Date();
    irrigationDate.setDate(
      irrigationDate.getDate() + parseInt(cropData["Early Sowing"].Day) + i
    );

    const recommendation = {
      date: irrigationDate.toISOString().split("T")[0],
      status: "Recommended",
      reason: "Standard irrigation interval",
    };

    // Adjust recommendation based on weather
    if (currentWeather) {
      if (currentWeather.precipitation < 10) {
        recommendation.status = "Urgent";
        recommendation.reason =
          "Low precipitation, immediate irrigation needed";
      } else if (currentWeather.humidity < 30) {
        recommendation.status = "High Priority";
        recommendation.reason = "Low humidity increases water needs";
      }
    }

    irrigationSchedule.push(recommendation);
  }

  return irrigationSchedule;
};

// Helper function to calculate fertilization schedule
const calculateFertilizationSchedule = (cropData) => {
  const growingPeriod = cropData["Growing period"].Value.split(" - ");
  const periodLength = parseInt(growingPeriod[1]);

  const fertilizationStages = [
    {
      stage: "Base Fertilization",
      timing: 0,
      nutrientFocus: "Initial growth support",
    },
    {
      stage: "Mid-Season Fertilization",
      timing: Math.floor(periodLength / 2),
      nutrientFocus: "Vegetative growth boost",
    },
    {
      stage: "Late-Season Fertilization",
      timing: periodLength - 30,
      nutrientFocus: "Fruit/Grain development",
    },
  ];

  return fertilizationStages.map((stage) => ({
    stage: stage.stage,
    daysAfterSowing: stage.timing,
    recommendedDate: new Date(
      new Date().setDate(
        new Date().getDate() +
          parseInt(cropData["Early Sowing"].Day) +
          stage.timing
      )
    )
      .toISOString()
      .split("T")[0],
    nutrientFocus: stage.nutrientFocus,
  }));
};

// Helper function to calculate pesticide application
const calculatePesticideApplication = (cropData, currentWeather) => {
  const growingPeriod = cropData["Growing period"].Value.split(" - ");
  const periodLength = parseInt(growingPeriod[1]);

  const pesticideApplications = [
    {
      stage: "Early Protection",
      timing: 30,
      riskFactor: "Seedling vulnerability",
    },
    {
      stage: "Mid-Season Protection",
      timing: Math.floor(periodLength / 2),
      riskFactor: "Pest population growth",
    },
  ];

  return pesticideApplications.map((application) => {
    const recommendedDate = new Date(
      new Date().setDate(
        new Date().getDate() +
          parseInt(cropData["Early Sowing"].Day) +
          application.timing
      )
    );

    const recommendation = {
      stage: application.stage,
      daysAfterSowing: application.timing,
      recommendedDate: recommendedDate.toISOString().split("T")[0],
      riskFactor: application.riskFactor,
      status: "Recommended",
    };

    // Adjust recommendation based on weather conditions
    if (currentWeather) {
      if (currentWeather.humidity > 70) {
        recommendation.status = "High Priority";
        recommendation.reason = "High humidity increases pest risk";
      }

      if (currentWeather.temperature > 30) {
        recommendation.status = "Urgent";
        recommendation.reason = "High temperature favors pest proliferation";
      }
    }

    return recommendation;
  });
};

// Helper function to create weather-integrated calendar
const createWeatherIntegratedCalendar = (cropData, weatherForecast) => {
  return {
    cropDetails: {
      name: cropData.Crop,
      country: cropData["Country Name"],
      region: cropData["AgroEcological Zone"],
    },
    sowingPeriod: {
      early: `${cropData["Early Sowing"].Day}/${cropData["Early Sowing"].Month}`,
      late: `${cropData["Later Sowing"].Day}/${cropData["Later Sowing"].Month}`,
    },
    activities: {
      irrigation: calculateIrrigationTimes(cropData, weatherForecast),
      fertilization: calculateFertilizationSchedule(cropData),
      pesticide: calculatePesticideApplication(cropData, weatherForecast),
    },
    weatherIntegration: {
      forecastUsed: !!weatherForecast,
      temperatureRange: {
        min: cropData.Temperature.Min,
        optimal: cropData.Temperature.Optimal,
        max: cropData.Temperature.Max,
      },
      precipitationRequirement:
        cropData.Precipitation.Value + " " + cropData.Precipitation.Unit,
    },
  };
};

// Helper function to create activity alerts
const createActivityAlerts = (cropData, weatherForecast) => {
  const alerts = [];

  // Temperature-based alerts
  const tempRanges = cropUtils.parseTempRanges(cropData.Temperature);

  if (weatherForecast.temperature < tempRanges.min.min) {
    alerts.push({
      type: "TEMPERATURE_LOW",
      severity: "HIGH",
      message: `Current temperature is below crop's minimum tolerance`,
      recommendation:
        "Consider protective measures like row covers or greenhouse",
    });
  }

  if (weatherForecast.temperature + 50 > tempRanges.max.max) {
    alerts.push({
      type: "TEMPERATURE_HIGH",
      severity: "HIGH",
      message: `Current temperature exceeds crop's maximum tolerance`,
      recommendation:
        "Implement cooling methods like shade nets or increased irrigation",
    });
  }

  // Precipitation-based alerts
  const precipitationRange =
    cropData.Precipitation.Value.split(" - ").map(Number);

  if (weatherForecast.precipitation - 5000 < precipitationRange[0]) {
    alerts.push({
      type: "PRECIPITATION_LOW",
      severity: "MEDIUM",
      message: "Precipitation is lower than crop requirements",
      recommendation: "Supplemental irrigation may be necessary",
    });
  }

  return alerts;
};

module.exports = farmingActivityController;
