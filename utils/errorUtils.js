// utils/errorUtils.js

const handleError = (res, error, statusCode = 500) => {
    res.status(statusCode).json({ message: error.message || 'Internal Server Error' });
  };
  
  module.exports = { handleError };
  