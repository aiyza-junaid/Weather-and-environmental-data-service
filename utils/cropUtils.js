const fs = require("fs");

// Helper function to convert month/day to day of year
const getDayOfYear = (month, day) => {
  const daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let dayOfYear = day;
  for (let i = 1; i < month; i++) {
    dayOfYear += daysInMonth[i];
  }
  return dayOfYear;
};

const cropUtils = {
  readJsonData: (jsonFilePath) => {
    try {
      const rawData = fs.readFileSync(jsonFilePath);
      return JSON.parse(rawData);
    } catch (error) {
      console.error("Error reading crop data:", error);
      return [];
    }
  },

  getMonthName: (monthNum) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[parseInt(monthNum) - 1] || "";
  },

  // Helper function to parse temperature ranges from crop data
  parseTempRanges: (tempData) => {
    const parseRange = (range) => {
      const [min, max] = range.split("-").map((num) => parseFloat(num.trim()));
      return { min, max };
    };

    return {
      min: parseRange(tempData.Min),
      optimal: parseRange(tempData.Optimal),
      max: parseRange(tempData.Max),
    };
  },

  // Calculate how suitable the temperature is for the crop
  calculateTemperatureScore: (avgTemp, minTemp, maxTemp, cropTempRanges) => {
    // Check if temperature is within absolute limits
    if (maxTemp > cropTempRanges.max.max || minTemp < cropTempRanges.min.min) {
      return 0;
    }

    // Calculate score based on how close average temperature is to optimal range
    const optimalRange = cropTempRanges.optimal;
    if (avgTemp >= optimalRange.min && avgTemp <= optimalRange.max) {
      return 1; // Perfect temperature
    }

    // Calculate reduced score based on distance from optimal range
    const distanceFromOptimal = Math.min(
      Math.abs(avgTemp - optimalRange.min),
      Math.abs(avgTemp - optimalRange.max)
    );

    return Math.max(0, 1 - distanceFromOptimal / 10); // Reduce score by 0.1 for each degree away from optimal
  },

  // Calculate how suitable the current date is for sowing
  calculateDateScore: (currentMonth, currentDay, earlyDate, lateDate) => {
    // Convert dates to day of year for easier comparison
    const currentDayOfYear = getDayOfYear(currentMonth, currentDay);
    const earlyDayOfYear = getDayOfYear(earlyDate.month, earlyDate.day);
    const lateDayOfYear = getDayOfYear(lateDate.month, lateDate.day);

    // Handle case where sowing period crosses year boundary
    let dayRange;
    if (lateDayOfYear < earlyDayOfYear) {
      // Sowing period crosses year boundary
      if (
        currentDayOfYear >= earlyDayOfYear ||
        currentDayOfYear <= lateDayOfYear
      ) {
        return 1;
      }
      dayRange = 365 - earlyDayOfYear + lateDayOfYear;
    } else {
      // Normal case
      if (
        currentDayOfYear >= earlyDayOfYear &&
        currentDayOfYear <= lateDayOfYear
      ) {
        return 1;
      }
      dayRange = lateDayOfYear - earlyDayOfYear;
    }

    // Calculate reduced score based on distance from sowing period
    const distanceFromPeriod = Math.min(
      Math.abs(currentDayOfYear - earlyDayOfYear),
      Math.abs(currentDayOfYear - lateDayOfYear)
    );

    return Math.max(0, 1 - distanceFromPeriod / 30); // Reduce score by 0.033 for each day away from sowing period
  },

  // Helper function to calculate various danger levels
  calculateDangers: (avgTemp, minTemp, maxTemp, cropTempRanges) => {
    const dangers = {
      freezingRisk: false,
      coldStress: false,
      heatStress: false,
      extremeHeat: false,
      details: [],
    };

    // Check for freezing risk
    if (minTemp <= 0) {
      dangers.freezingRisk = true;
      dangers.details.push(`Risk of frost damage at ${minTemp}°C`);
    }

    // Check for cold stress
    if (minTemp < cropTempRanges.min.min) {
      dangers.coldStress = true;
      dangers.details.push(
        `Cold stress: minimum temperature ${minTemp}°C below crop minimum ${cropTempRanges.min.min}°C`
      );
    }

    // Check for heat stress
    if (maxTemp > cropTempRanges.optimal.max) {
      dangers.heatStress = true;
      dangers.details.push(
        `Heat stress: maximum temperature ${maxTemp}°C above optimal maximum ${cropTempRanges.optimal.max}°C`
      );
    }

    // Check for extreme heat
    if (maxTemp > cropTempRanges.max.max) {
      dangers.extremeHeat = true;
      dangers.details.push(
        `Extreme heat: maximum temperature ${maxTemp}°C above crop maximum ${cropTempRanges.max.max}°C`
      );
    }

    return dangers;
  },

  // Calculate overall risk level (0-1)
  calculateOverallRisk: (dangers) => {
    let riskScore = 0;

    if (dangers.freezingRisk) riskScore += 0.4;
    if (dangers.coldStress) riskScore += 0.3;
    if (dangers.heatStress) riskScore += 0.3;
    if (dangers.extremeHeat) riskScore += 0.4;

    return Math.min(1, riskScore); // Cap at 1
  },

  // Generate recommendations based on identified risks
  generateRecommendations: (dangers) => {
    const recommendations = [];

    if (dangers.freezingRisk) {
      recommendations.push(
        "Consider using frost protection methods like row covers or sprinkler systems",
        "Monitor nighttime temperatures closely"
      );
    }

    if (dangers.coldStress) {
      recommendations.push(
        "Add mulch to regulate soil temperature",
        "Consider using cold frames or tunnels"
      );
    }

    if (dangers.heatStress) {
      recommendations.push(
        "Ensure adequate irrigation",
        "Consider shade cloth or other cooling methods",
        "Monitor soil moisture levels carefully"
      );
    }

    if (dangers.extremeHeat) {
      recommendations.push(
        "Implement emergency irrigation measures",
        "Apply reflective mulch if available",
        "Consider temporary shade structures"
      );
    }

    return recommendations;
  },
};

module.exports = cropUtils;
