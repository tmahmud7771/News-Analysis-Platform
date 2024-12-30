const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const logger = require("./utils/logger");

const app = express();

// Error handling

const errorHandler = (err, req, res, next) => {
  // Log error details
  logger.error("Unhandled Error", {
    error: {
      message: err.message,
      stack: err.stack,
      statusCode: err.statusCode || 500,
    },
    request: {
      method: req.method,
      url: req.url,
      body: req.body,
      params: req.params,
      query: req.query,
      headers: req.headers,
    },
  });

  // Send error response
  res.status(err.statusCode || 500).json({
    status: "error",
    message: err.message || "Internal server error",
  });
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use(errorHandler);

//DB SETUP

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
