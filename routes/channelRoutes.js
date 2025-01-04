// routes/channelRoutes.js
const express = require("express");
const router = express.Router();
const channelController = require("../controller/channelController");
const { protect, restrictTo } = require("../middleware/auth");

// Apply auth protection to all routes
router.use(protect);

// Search route
router.get("/search", channelController.searchChannels);

// Basic CRUD routes
router.get("/", channelController.getAllChannels);
router.get("/:id", channelController.getChannel);

// Admin only routes
router.use(restrictTo("admin"));
router.post("/", channelController.createChannel);
router.patch("/:id", channelController.updateChannel);
router.delete("/:id", channelController.deleteChannel);

module.exports = router;
