const express = require("express");
const router = express.Router();
const { farmingActivityController } = require("../controllers");

router.post('/crop-activities', farmingActivityController.suggestCropActivities);
router.post('/farming-calendar', farmingActivityController.generateFarmingCalendar);
router.post('/activity-alerts', farmingActivityController.generateActivityAlerts);

module.exports = router;