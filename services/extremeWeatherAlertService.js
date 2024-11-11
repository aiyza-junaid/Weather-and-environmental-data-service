const axios = require('axios');

const API_HOST = 'weatherapi-com.p.rapidapi.com';
const API_KEY = process.env.REALTIME_RAPIDAPI_KEY;
const BASE_URL = `https://${API_HOST}`;

const extremeWeatherAlertsService = {
  getExtremeWeatherAlerts: async (q) => {
    const url = `${BASE_URL}/alerts.json?q=${q}`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': API_HOST,
      },
    };

    try {
      const response = await axios.get(url, options);
      return response.data;
    } catch (error) {
      console.error("Error fetching extreme weather alerts:", error);
      throw new Error("Could not fetch extreme weather alerts");
    }
  },

  getStormAlerts: async (q) => {
    const url = `${BASE_URL}/alerts.json?q=${q}&storm=true`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': API_HOST,
      },
    };

    try {
      const response = await axios.get(url, options);
      return response.data;
    } catch (error) {
      console.error("Error fetching storm alerts:", error);
      throw new Error("Could not fetch storm alerts");
    }
  },

  getFloodAlerts: async (q) => {
    const url = `${BASE_URL}/alerts.json?q=${q}&flood=true`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': API_HOST,
      },
    };

    try {
      const response = await axios.get(url, options);
      return response.data;
    } catch (error) {
      console.error("Error fetching flood alerts:", error);
      throw new Error("Could not fetch flood alerts");
    }
  },

  getTemperatureAlerts: async (q) => {
    const url = `${BASE_URL}/alerts.json?q=${q}&temp=true`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': API_HOST,
      },
    };

    try {
      const response = await axios.get(url, options);
      return response.data;
    } catch (error) {
      console.error("Error fetching temperature alerts:", error);
      throw new Error("Could not fetch temperature alerts");
    }
  },

  getRainAlerts: async (q) => {
    const url = `${BASE_URL}/alerts.json?q=${q}&rain=true`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': API_HOST,
      },
    };

    try {
      const response = await axios.get(url, options);
      return response.data;
    } catch (error) {
      console.error("Error fetching rain alerts:", error);
      throw new Error("Could not fetch rain alerts");
    }
  },

  getCustomAlert: async (q, conditions) => {
    let queryParams = `q=${q}`;
    if (conditions.storm) queryParams += '&storm=true';
    if (conditions.flood) queryParams += '&flood=true';
    if (conditions.temp) queryParams += '&temp=true';
    if (conditions.rain) queryParams += '&rain=true';
    
    const url = `${BASE_URL}/alerts.json?${queryParams}`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': API_HOST,
      },
    };

    try {
      const response = await axios.get(url, options);
      return response.data;
    } catch (error) {
      console.error("Error fetching custom weather alerts:", error);
      throw new Error("Could not fetch custom weather alerts");
    }
  },
};

module.exports = extremeWeatherAlertsService;
