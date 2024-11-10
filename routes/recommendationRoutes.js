const express = require("express");
const router = express.Router();
const { recommendationController } = require("../controllers");

router.get("/", recommendationController.getData);
router.get("/crops", recommendationController.getCrops);
router.get("/crop", recommendationController.getCropData);
router.get("/crop/sowing", recommendationController.getSowingData);
router.get("/crop/harvesting", recommendationController.getHarvestingData);

module.exports = router;
