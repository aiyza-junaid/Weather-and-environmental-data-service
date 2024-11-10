const extremeWeatherAlertsService = require('../services/extremeWeatherAlertsService');
const { handleError } = require('../utils/errorUtils'); 

const extremeWeatherAlertsController = {
  // Get general extreme weather alerts
  getExtremeWeatherAlerts: async (req, res) => {
    try {
      const location = req.query.q;
      const data = await extremeWeatherAlertsService.getExtremeWeatherAlerts(location);
      res.status(200).json(data);
    } catch (error) {
      handleError(res, error); 
    }
  },

  // Get storm alerts for a location
  getStormAlerts: async (req, res) => {
    try {
      const location = req.query.q;
      const data = await extremeWeatherAlertsService.getStormAlerts(location);
      res.status(200).json(data);
    } catch (error) {
      handleError(res, error);
    }
  },

  // Get flood alerts for a location
  getFloodAlerts: async (req, res) => {
    try {
      const location = req.query.q;
      const data = await extremeWeatherAlertsService.getFloodAlerts(location);
      res.status(200).json(data);
    } catch (error) {
      handleError(res, error);
    }
  },

  // Get temperature alerts for a location
  getTemperatureAlerts: async (req, res) => {
    try {
      const location = req.query.q;
      const data = await extremeWeatherAlertsService.getTemperatureAlerts(location);
      res.status(200).json(data);
    } catch (error) {
      handleError(res, error);
    }
  },

  // Get rain alerts for a location
  getRainAlerts: async (req, res) => {
    try {
      const location = req.query.q;
      const data = await extremeWeatherAlertsService.getRainAlerts(location);
      res.status(200).json(data);
    } catch (error) {
      handleError(res, error);
    }
  },

  getCustomAlert: async (req, res) => {
    try {
      const location = req.query.q;
      const conditions = req.body;  // Assuming conditions will be passed in the request body
      const data = await extremeWeatherAlertsService.getCustomAlert(location, conditions);
      res.status(200).json(data);
    } catch (error) {
      handleError(res, error);
    }
  },
};

module.exports = extremeWeatherAlertsController;
