const express = require("express");
const router = express.Router();
const { cropDataController } = require("../controllers");

router.get("/", cropDataController.getData);
router.get("/crops", cropDataController.getCrops);
router.get("/countries", cropDataController.getCountries);
router.get("/regions", cropDataController.getRegions);
router.get("/crop", cropDataController.getCropData);
router.get("/crop/sowing", cropDataController.getSowingData);
router.get("/crop/harvesting", cropDataController.getHarvestingData);

router.post("/crops/recommended", cropDataController.findRecommendedCrops);
router.post("/crops/endangered", cropDataController.findEndangeredCrops);

module.exports = router;
