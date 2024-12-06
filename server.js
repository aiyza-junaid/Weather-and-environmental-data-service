const express = require("express");
const dotenv = require("dotenv");
const mongoose= require("mongoose");


const FarmerProfile = require('./models/FarmerProfile'); // Adjust import path as needed

const cors = require("cors");
const cronJob = require('./controllers/scheduler');  // Import the cron job file to ensure it's executed

// const cookieParser = require("cookie-parser");
dotenv.config();
const {
  dummyRoutes,
  realtimeweatherRoutes,
  forecastWeatherRoutes,
  cropDataRoutes,
  farmingActivityRoutes,
  extremeWeatherAlertRoute
} = require("./routes");

const app = express();
// app.use(cookieParser());
app.use(express.json());
app.use(express.json({ limit: "10mb" })); // if you want to send images or files to the server you need to increase the limit
app.use(cors({ origin: true, credentials: true }));
app.use("/dummy", dummyRoutes);
app.use("/weather", realtimeweatherRoutes);
app.use("/forecast", forecastWeatherRoutes);
app.use("/crop-data", cropDataRoutes);
app.use("/farming-activity", farmingActivityRoutes);
app.use('/alerts', extremeWeatherAlertRoute);


app.get("/", (req, res) => {
  res.send("Welcome to the Dummy Microservice");
});



// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoURI = "mongodb://localhost:27017/dumdum";
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

  


  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // Exit process with failure
  }
};

// Start the Server
const PORT = process.env.PORT || 3001;

const startServer = async () => {
  await connectDB(); // Ensure MongoDB is connected before starting the server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();