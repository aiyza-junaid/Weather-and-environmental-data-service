const axios = require("axios");
const BASE_URL = "https://weatherapi-com.p.rapidapi.com";
const realtimeresponse = require("../utils/realtime");

const weatherService = {
  getCurrentWeather: async (lat, lon) => {
    const url = `${BASE_URL}/current.json?q=${lat},${lon}`;
    const options = {
      method: 'GET',
      headers: {
        "x-rapidapi-key": process.env.REALTIME_RAPIDAPI_KEY,
        "x-rapidapi-host": "weatherapi-com.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.get(url, options);
      console.log(response)
      return { data: response.data };
    } catch (error) {
      console.error("Weather Service Error:", error);
      return { error: error.response ? error.response.data : { message: 'Error fetching weather data' } };
    }
  },
};

module.exports = weatherService;
