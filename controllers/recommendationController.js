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
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return months[parseInt(monthNum) - 1] || "";
};

const recommendationController = {
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
      const data = readJsonData(cropCalendarData);
      const crops = data.map((crop) => crop["Crop"]);
      const uniqueCrops = [...new Set(crops)];
      return responseUtils.handleSuccess(
        res,
        uniqueCrops,
        "Crops fetched successfully"
      );
    } catch (error) {
      console.log(error);
      return responseUtils.handleFailure(res, error);
    }
  },

  // getRegions based on country and crop
  getRegions: async (req, res) => {
    try {
      const data = readJsonData(cropCalendarData);
      const countryName = req.query.country;
      const cropName = req.query.crop;
      const regions = data
        .filter((crop) => crop["Crop"] === cropName && crop["Country Name"] === countryName)
        .map((crop) => crop["AgroEcological Zone"]);
      const uniqueRegions = [...new Set(regions)];
      return responseUtils.handleSuccess(
        res,
        uniqueRegions,
        "Regions fetched successfully"
      );
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
        return responseUtils.handleFailure(
          res, 
          { message: "No data found for the specified criteria" },
          404
        );
      }
  
      // Extract and format sowing data
      const sowingData = {
        earlySowing: {
          day: cropData["Early Sowing"].Day,
          month: cropData["Early Sowing"].Month,
          // Convert to formatted date string
          formattedDate: cropData["Early Sowing"].Month ? 
            `${cropData["Early Sowing"].Day} ${getMonthName(cropData["Early Sowing"].Month)}` : 
            null
        },
        lateSowing: {
          day: cropData["Later Sowing"].Day,
          month: cropData["Later Sowing"].Month,
          // Convert to formatted date string
          formattedDate: cropData["Later Sowing"].Month ? 
            `${cropData["Later Sowing"].Day} ${getMonthName(cropData["Later Sowing"].Month)}` : 
            null
        },
        sowingRate: {
          value: cropData["Sowing rate"].Value,
          unit: cropData["Sowing rate"].Unit
        },
        additionalInformation: cropData["Additional information"],
        allYear: cropData["All year"]
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
        return responseUtils.handleFailure(
          res, 
          { message: "No data found for the specified criteria" },
          404
        );
      }
  
      // Extract and format harvesting data
      const harvestingData = {
        earlyHarvest: {
          day: cropData["Early harvest"].Day,
          month: cropData["Early harvest"].Month,
          // Convert to formatted date string
          formattedDate: cropData["Early harvest"].Month ? 
            `${cropData["Early harvest"].Day} ${getMonthName(cropData["Early harvest"].Month)}` : 
            null
        },
        lateHarvest: {
          day: cropData["Late harvest"].Day,
          month: cropData["Late harvest"].Month,
          // Convert to formatted date string
          formattedDate: cropData["Late harvest"].Month ? 
            `${cropData["Late harvest"].Day} ${getMonthName(cropData["Late harvest"].Month)}` : 
            null
        },
        growingPeriod: {
          value: cropData["Growing period"].Value,
          period: cropData["Growing period"].Period
        }
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
};

module.exports = recommendationController;
