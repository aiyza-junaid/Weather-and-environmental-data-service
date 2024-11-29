const { responseUtils, cropUtils } = require("../utils");

const path = require("path");
const fs = require("fs");

const cropCalendarData = path.join(
  __dirname,
  "..",
  "data",
  "Crop_Calendar_Data_All.json"
);

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
      const data = cropUtils.readJsonData(cropCalendarData);

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
            ? `${cropData["Early Sowing"].Day} ${cropUtils.getMonthName(
                cropData["Early Sowing"].Month
              )}`
            : null,
        },
        lateSowing: {
          day: cropData["Later Sowing"].Day,
          month: cropData["Later Sowing"].Month,
          // Convert to formatted date string
          formattedDate: cropData["Later Sowing"].Month
            ? `${cropData["Later Sowing"].Day} ${cropUtils.getMonthName(
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
            ? `${cropData["Early harvest"].Day} ${cropUtils.getMonthName(
                cropData["Early harvest"].Month
              )}`
            : null,
        },
        lateHarvest: {
          day: cropData["Late harvest"].Day,
          month: cropData["Late harvest"].Month,
          // Convert to formatted date string
          formattedDate: cropData["Late harvest"].Month
            ? `${cropData["Late harvest"].Day} ${cropUtils.getMonthName(
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
        const tempRanges = cropUtils.parseTempRanges(crop.Temperature);

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
        const temperatureScore = cropUtils.calculateTemperatureScore(
          avgTemperature,
          minTemperature,
          maxTemperature,
          tempRanges
        );

        const dateScore = cropUtils.calculateDateScore(
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
        const tempRanges = cropUtils.parseTempRanges(crop.Temperature);
        
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
        const dangers = cropUtils.calculateDangers(
          avgTemperature,
          minTemperature,
          maxTemperature,
          tempRanges
        );
  
        // Check if current date is within sowing period
        const dateScore = cropUtils.calculateDateScore(
          currentMonth,
          currentDay,
          earlyDate,
          lateDate
        );
  
        // Only include if the crop is in active growing period
        if (dateScore > 0) {
          return {
            crop: crop.Crop,
            riskLevel: cropUtils.calculateOverallRisk(dangers),
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
              recommendations: cropUtils.generateRecommendations(dangers),
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
