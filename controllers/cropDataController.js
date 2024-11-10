const { responseUtils } = require("../utils");
const { dummyService } = require("../services");

const path = require("path");
const fs = require("fs");
const { get } = require("http");

const cropCalendarData = path.join(
  __dirname,
  "..",
  "data",
  "Crop_Calendar_Data_All.json"
);

const readJsonData = (jsonFilePath) => {
  try {
    const rawData = fs.readFileSync(jsonFilePath);
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Error reading crop data:", error);
    return [];
  }
};

const getMonthName = (monthNum) => {
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
};

// Helper function to parse temperature ranges from crop data
const parseTempRanges = (tempData) => {
  const parseRange = (range) => {
    const [min, max] = range.split("-").map((num) => parseFloat(num.trim()));
    return { min, max };
  };

  return {
    min: parseRange(tempData.Min),
    optimal: parseRange(tempData.Optimal),
    max: parseRange(tempData.Max),
  };
};

// Calculate how suitable the temperature is for the crop
const calculateTemperatureScore = (
  avgTemp,
  minTemp,
  maxTemp,
  cropTempRanges
) => {
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
};

// Calculate how suitable the current date is for sowing
const calculateDateScore = (currentMonth, currentDay, earlyDate, lateDate) => {
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
};

// Helper function to convert month/day to day of year
const getDayOfYear = (month, day) => {
  const daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let dayOfYear = day;
  for (let i = 1; i < month; i++) {
    dayOfYear += daysInMonth[i];
  }
  return dayOfYear;
};

// Helper function to calculate various danger levels
const calculateDangers = (avgTemp, minTemp, maxTemp, cropTempRanges) => {
  const dangers = {
    freezingRisk: false,
    coldStress: false,
    heatStress: false,
    extremeHeat: false,
    details: []
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
};

// Calculate overall risk level (0-1)
const calculateOverallRisk = (dangers) => {
  let riskScore = 0;
  
  if (dangers.freezingRisk) riskScore += 0.4;
  if (dangers.coldStress) riskScore += 0.3;
  if (dangers.heatStress) riskScore += 0.3;
  if (dangers.extremeHeat) riskScore += 0.4;

  return Math.min(1, riskScore); // Cap at 1
};

// Generate recommendations based on identified risks
const generateRecommendations = (dangers) => {
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
};

const cropDataController = {
  getData: async (req, res) => {
    try {
      const data = readJsonData(cropCalendarData);
      return responseUtils.handleSuccess(
        res,
        data,
        "Data fetched successfully"
      );
    } catch (error) {
      console.log(error);
      return responseUtils.handleFailure(res, error);
    }
  },

  getCrops: async (req, res) => {
    try {
      const { country, region } = req.query;
      const data = readJsonData(cropCalendarData);

      let filteredData = data;

      // Apply filters based on provided query parameters
      if (country) {
        filteredData = filteredData.filter(
          (crop) => crop["Country Name"].toLowerCase() === country.toLowerCase()
        );

        // If no crops found for the country, return appropriate message
        if (filteredData.length === 0) {
          return responseUtils.handleFailure(
            res,
            { message: `No crops found for country: ${country}` },
            404
          );
        }

        // If region is provided, filter by region as well
        if (region) {
          const countryRegionData = filteredData.filter(
            (crop) =>
              crop["AgroEcological Zone"].toLowerCase() === region.toLowerCase()
          );

          // If no crops found for the region, return appropriate message
          if (countryRegionData.length === 0) {
            return responseUtils.handleFailure(
              res,
              {
                message: `No crops found for region: ${region} in country: ${country}`,
              },
              404
            );
          }

          filteredData = countryRegionData;
        }
      }

      // Extract unique crop names from the filtered data
      const crops = filteredData.map((crop) => crop["Crop"]);
      const uniqueCrops = [...new Set(crops)].sort();

      // Prepare response message based on filters applied
      let successMessage = "All crops fetched successfully";
      if (country && region) {
        successMessage = `Crops fetched successfully for ${region}, ${country}`;
      } else if (country) {
        successMessage = `Crops fetched successfully for ${country}`;
      }

      // Include metadata in response
      const response = {
        crops: uniqueCrops,
        metadata: {
          total: uniqueCrops.length,
          filters: {
            country: country || "none",
            region: region || "none",
          },
        },
      };

      return responseUtils.handleSuccess(res, response, successMessage);
    } catch (error) {
      console.log(error);
      return responseUtils.handleFailure(res, error);
    }
  },

  getCountries: async (req, res) => {
    try {
      const data = readJsonData(cropCalendarData);
      const countries = data.map((crop) => crop["Country Name"]);
      const uniqueCountries = [...new Set(countries)];
      return responseUtils.handleSuccess(
        res,
        uniqueCountries,
        "Countries fetched successfully"
      );
    } catch (error) {
      console.log(error);
      return responseUtils.handleFailure(res, error);
    }
  },

  getRegions: async (req, res) => {
    try {
      const { country, crop } = req.query;
      const data = readJsonData(cropCalendarData);

      let filteredData = data;

      // Apply filters based on provided query parameters
      if (country) {
        filteredData = filteredData.filter(
          (item) => item["Country Name"].toLowerCase() === country.toLowerCase()
        );

        // If no data found for the country
        if (filteredData.length === 0) {
          return responseUtils.handleFailure(
            res,
            { message: `No regions found for country: ${country}` },
            404
          );
        }

        // If crop is provided, filter by crop as well
        if (crop) {
          const countryCropData = filteredData.filter(
            (item) => item["Crop"].toLowerCase() === crop.toLowerCase()
          );

          // If no data found for the crop in country
          if (countryCropData.length === 0) {
            return responseUtils.handleFailure(
              res,
              {
                message: `No regions found for crop: ${crop} in country: ${country}`,
              },
              404
            );
          }

          filteredData = countryCropData;
        }
      }

      // Extract unique regions from the filtered data
      const regions = filteredData.map((item) => item["AgroEcological Zone"]);
      const uniqueRegions = [...new Set(regions)].sort();

      // Prepare response message based on filters applied
      let successMessage = "All regions fetched successfully";
      if (country && crop) {
        successMessage = `Regions fetched successfully for ${crop} in ${country}`;
      } else if (country) {
        successMessage = `Regions fetched successfully for ${country}`;
      }

      // Include metadata in response
      const response = {
        regions: uniqueRegions,
        metadata: {
          total: uniqueRegions.length,
          filters: {
            country: country || "none",
            crop: crop || "none",
          },
        },
      };

      return responseUtils.handleSuccess(res, response, successMessage);
    } catch (error) {
      console.log(error);
      return responseUtils.handleFailure(res, error);
    }
  },

  getCropData: async (req, res) => {
    try {
      const data = readJsonData(cropCalendarData);
      const countryName = req.query.country;
      const cropName = req.query.crop;
      const cropData = data.filter(
        (crop) =>
          crop["Crop"] === cropName && crop["Country Name"] === countryName
      );
      return responseUtils.handleSuccess(
        res,
        cropData,
        "Data fetched successfully"
      );
    } catch (error) {
      console.log(error);
      return responseUtils.handleFailure(res, error);
    }
  },

  getSowingData: async (req, res) => {
    try {
      const data = readJsonData(cropCalendarData);
      const countryName = req.query.country;
      const cropName = req.query.crop;
      const region = req.query.region;

      const cropData = data.find(
        (crop) =>
          crop["Crop"] === cropName &&
          crop["Country Name"] === countryName &&
          crop["AgroEcological Zone"] === region
      );

      if (!cropData) {
        return responseUtils.handleNotFound(
          res,
          "No data found for the specified criteria"
        );
      }

      // Extract and format sowing data
      const sowingData = {
        earlySowing: {
          day: cropData["Early Sowing"].Day,
          month: cropData["Early Sowing"].Month,
          // Convert to formatted date string
          formattedDate: cropData["Early Sowing"].Month
            ? `${cropData["Early Sowing"].Day} ${getMonthName(
                cropData["Early Sowing"].Month
              )}`
            : null,
        },
        lateSowing: {
          day: cropData["Later Sowing"].Day,
          month: cropData["Later Sowing"].Month,
          // Convert to formatted date string
          formattedDate: cropData["Later Sowing"].Month
            ? `${cropData["Later Sowing"].Day} ${getMonthName(
                cropData["Later Sowing"].Month
              )}`
            : null,
        },
        sowingRate: {
          value: cropData["Sowing rate"].Value,
          unit: cropData["Sowing rate"].Unit,
        },
        additionalInformation: cropData["Additional information"],
        allYear: cropData["All year"],
      };

      return responseUtils.handleSuccess(
        res,
        sowingData,
        "Sowing data fetched successfully"
      );
    } catch (error) {
      console.log(error);
      return responseUtils.handleFailure(res, error);
    }
  },

  getHarvestingData: async (req, res) => {
    try {
      const data = readJsonData(cropCalendarData);
      const countryName = req.query.country;
      const cropName = req.query.crop;
      const region = req.query.region;

      const cropData = data.find(
        (crop) =>
          crop["Crop"] === cropName &&
          crop["Country Name"] === countryName &&
          crop["AgroEcological Zone"] === region
      );

      if (!cropData) {
        return responseUtils.handleNotFound(
          res,
          "No data found for the specified criteria"
        );
      }

      // Extract and format harvesting data
      const harvestingData = {
        earlyHarvest: {
          day: cropData["Early harvest"].Day,
          month: cropData["Early harvest"].Month,
          // Convert to formatted date string
          formattedDate: cropData["Early harvest"].Month
            ? `${cropData["Early harvest"].Day} ${getMonthName(
                cropData["Early harvest"].Month
              )}`
            : null,
        },
        lateHarvest: {
          day: cropData["Late harvest"].Day,
          month: cropData["Late harvest"].Month,
          // Convert to formatted date string
          formattedDate: cropData["Late harvest"].Month
            ? `${cropData["Late harvest"].Day} ${getMonthName(
                cropData["Late harvest"].Month
              )}`
            : null,
        },
        growingPeriod: {
          value: cropData["Growing period"].Value,
          period: cropData["Growing period"].Period,
        },
      };

      return responseUtils.handleSuccess(
        res,
        harvestingData,
        "Harvesting data fetched successfully"
      );
    } catch (error) {
      console.log(error);
      return responseUtils.handleFailure(res, error);
    }
  },

  findRecommendedCrops: async (req, res) => {
    try {
      const { temperatures, country, region, startDate } = req.body;

      // Validate input
      if (
        !temperatures ||
        !Array.isArray(temperatures) ||
        !country ||
        !region ||
        !startDate
      ) {
        return responseUtils.handleBadRequest(
          res,
          "Please provide temperatures array, country, region and start date"
        );
      }

      // Read all crop data
      const cropData = readJsonData(cropCalendarData);

      // Get crops for the specified region
      const regionalCrops = cropData.filter(
        (crop) =>
          crop["Country Name"] === country &&
          crop["AgroEcological Zone"] === region
      );

      // Calculate average temperature from forecast
      const avgTemperature =
        temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length;
      const minTemperature = Math.min(...temperatures);
      const maxTemperature = Math.max(...temperatures);

      // Parse the start date
      const currentDate = new Date(startDate);
      const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-based
      const currentDay = currentDate.getDate();

      const recommendations = regionalCrops.map((crop) => {
        // Parse temperature ranges
        const tempRanges = parseTempRanges(crop.Temperature);

        // Check sowing dates
        const earlyDate = {
          month: parseInt(crop["Early Sowing"].Month),
          day: parseInt(crop["Early Sowing"].Day),
        };

        const lateDate = {
          month: parseInt(crop["Later Sowing"].Month),
          day: parseInt(crop["Later Sowing"].Day),
        };

        // Calculate suitability scores
        const temperatureScore = calculateTemperatureScore(
          avgTemperature,
          minTemperature,
          maxTemperature,
          tempRanges
        );

        const dateScore = calculateDateScore(
          currentMonth,
          currentDay,
          earlyDate,
          lateDate
        );

        // Calculate overall suitability
        const overallScore = (temperatureScore + dateScore) / 2;

        return {
          crop: crop.Crop,
          suitability: overallScore,
          details: {
            temperatureCompatibility: temperatureScore,
            sowingTimeCompatibility: dateScore,
            idealTempRange: {
              min: tempRanges.min,
              optimal: tempRanges.optimal,
              max: tempRanges.max,
            },
            sowingDates: {
              early: `${earlyDate.day}/${earlyDate.month}`,
              late: `${lateDate.day}/${lateDate.month}`,
            },
            additionalInfo: crop["Additional information"],
          },
        };
      });

      // Sort recommendations by suitability score
      const sortedRecommendations = recommendations
        .sort((a, b) => b.suitability - a.suitability)
        .filter((rec) => rec.suitability > 0.4); // Only include reasonably suitable crops

      return responseUtils.handleSuccess(
        res,
        {
          weatherSummary: {
            average: avgTemperature.toFixed(1),
            min: minTemperature,
            max: maxTemperature,
          },
          recommendations: sortedRecommendations,
        },
        "Crop recommendations generated successfully"
      );
    } catch (error) {
      console.log(error);
      return responseUtils.handleFailure(res, error);
    }
  },

  findEndangeredCrops: async (req, res) => {
    try {
      const { temperatures, country, region, startDate } = req.body;
      
      // Validate input
      if (!temperatures || !Array.isArray(temperatures) || !country || !region || !startDate) {
        return responseUtils.handleBadRequest(
          res,
          "Please provide temperatures array, country, region and start date"
        );
      }
  
      // Read all crop data
      const cropData = readJsonData(cropCalendarData);
  
      // Get crops for the specified region
      const regionalCrops = cropData.filter(
        crop => crop["Country Name"] === country && 
                crop["AgroEcological Zone"] === region
      );
  
      // Calculate temperature metrics
      const avgTemperature = temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length;
      const minTemperature = Math.min(...temperatures);
      const maxTemperature = Math.max(...temperatures);
  
      // Parse the start date
      const currentDate = new Date(startDate);
      const currentMonth = currentDate.getMonth() + 1;
      const currentDay = currentDate.getDate();
  
      const endangeredCrops = regionalCrops.map(crop => {
        // Parse temperature ranges
        const tempRanges = parseTempRanges(crop.Temperature);
        
        // Check sowing dates
        const earlyDate = {
          month: parseInt(crop["Early Sowing"].Month),
          day: parseInt(crop["Early Sowing"].Day)
        };
        
        const lateDate = {
          month: parseInt(crop["Later Sowing"].Month),
          day: parseInt(crop["Later Sowing"].Day)
        };
  
        // Calculate danger levels
        const dangers = calculateDangers(
          avgTemperature,
          minTemperature,
          maxTemperature,
          tempRanges
        );
  
        // Check if current date is within sowing period
        const dateScore = calculateDateScore(
          currentMonth,
          currentDay,
          earlyDate,
          lateDate
        );
  
        // Only include if the crop is in active growing period
        if (dateScore > 0) {
          return {
            crop: crop.Crop,
            riskLevel: calculateOverallRisk(dangers),
            details: {
              temperature: {
                current: {
                  avg: avgTemperature.toFixed(1),
                  min: minTemperature,
                  max: maxTemperature
                },
                ideal: {
                  min: tempRanges.min,
                  optimal: tempRanges.optimal,
                  max: tempRanges.max
                }
              },
              risks: dangers,
              sowingDates: {
                early: `${earlyDate.day}/${earlyDate.month}`,
                late: `${lateDate.day}/${lateDate.month}`
              },
              recommendations: generateRecommendations(dangers),
              additionalInfo: crop["Additional information"]
            }
          };
        }
        return null;
      }).filter(crop => crop !== null && crop.riskLevel > 0);
  
      // Sort by risk level (highest risk first)
      const sortedEndangeredCrops = endangeredCrops.sort((a, b) => b.riskLevel - a.riskLevel);
  
      return responseUtils.handleSuccess(
        res,
        {
          weatherSummary: {
            average: avgTemperature.toFixed(1),
            min: minTemperature,
            max: maxTemperature
          },
          endangeredCrops: sortedEndangeredCrops
        },
        "Endangered crops analysis completed successfully"
      );
  
    } catch (error) {
      console.log(error);
      return responseUtils.handleFailure(res, error);
    }
  },
};

module.exports = cropDataController;
