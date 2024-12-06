const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userID: { 
    type: Number, 
    required: true, 
    default: 123 // Default value for name
  },
  email: { 
    type: String, 
    required: true, 
    default: '56riyaan@gmail.com' // Default value for email
  },
  location: { 
    type: String, 
    required: true, 
    default: 'Toronto' // Default value for email
  },
  thresholds: {
    temperature: {
      heat: { 
        type: Number, 
        required: true, 
        default: 35 // Default heat alert threshold
      },
      frost: { 
        type: Number, 
        required: true, 
        default: 0 // Default frost warning threshold
      },
    },
    precipitation: {
      droughtDays: { 
        type: Number, 
        required: true, 
        default: 7 // Default drought risk after 7 days with no rain
      },
      flood: { 
        type: Number, 
        required: true, 
        default: 50 // Default flood warning threshold
      },
    },
    humidity: {
      pestRiskHumidity: { 
        type: Number, 
        required: true, 
        default: 80 // Default pest risk humidity threshold
      },
      pestRiskTempRange: { 
        type: [Number], 
        required: true, 
        default: [15, 30] // Default pest risk temperature range
      },
    },
    wind: {
      strongWind: { 
        type: Number, 
        required: true, 
        default: 40 // Default strong wind threshold
      },
    },
    uv: {
      highUV: { 
        type: Number, 
        required: true, 
        default: 8 // Default high UV threshold
      },
    },
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
