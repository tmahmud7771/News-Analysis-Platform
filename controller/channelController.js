// controllers/channelController.js
const Channel = require("../model/Channel");
const logger = require("../utils/logger");

// Create new channel
exports.createChannel = async (req, res) => {
  try {
    const channel = await Channel.create(req.body);
    logger.info(`Channel created successfully: ${channel._id}`);

    res.status(201).json({
      status: "success",
      data: channel,
    });
  } catch (error) {
    logger.error(`Error creating channel: ${error.message}`);
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Get all channels
exports.getAllChannels = async (req, res) => {
  try {
    const channels = await Channel.find().sort("-createdAt");

    res.json({
      status: "success",
      data: channels,
    });
  } catch (error) {
    logger.error(`Error getting channels: ${error.message}`);
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Get channel by ID
exports.getChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      logger.warn(`Channel not found with ID: ${req.params.id}`);
      return res.status(404).json({
        status: "error",
        message: "Channel not found",
      });
    }

    res.json({
      status: "success",
      data: channel,
    });
  } catch (error) {
    logger.error(`Error getting channel: ${error.message}`);
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Update channel
exports.updateChannel = async (req, res) => {
  try {
    const channel = await Channel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!channel) {
      logger.warn(`Channel not found: ${req.params.id}`);
      return res.status(404).json({
        status: "error",
        message: "Channel not found",
      });
    }

    logger.info(`Channel updated successfully: ${channel._id}`);
    res.json({
      status: "success",
      data: channel,
    });
  } catch (error) {
    logger.error(`Error updating channel: ${error.message}`);
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Delete channel
exports.deleteChannel = async (req, res) => {
  try {
    const channel = await Channel.findByIdAndDelete(req.params.id);

    if (!channel) {
      logger.warn(`Channel not found: ${req.params.id}`);
      return res.status(404).json({
        status: "error",
        message: "Channel not found",
      });
    }

    logger.info(`Channel deleted successfully: ${channel._id}`);
    res.json({
      status: "success",
      data: null,
    });
  } catch (error) {
    logger.error(`Error deleting channel: ${error.message}`);
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Search channels
exports.searchChannels = async (req, res) => {
  try {
    const { query } = req.query;
    let searchCriteria = {};

    if (query) {
      const searchRegex = new RegExp(
        query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );
      searchCriteria.name = { $regex: searchRegex };
    }

    const channels = await Channel.find(searchCriteria).sort("-createdAt");

    res.json({
      status: "success",
      data: channels,
    });
  } catch (error) {
    logger.error(`Error searching channels: ${error.message}`);
    res.status(500).json({
      status: "error",
      message: "Error searching channels",
    });
  }
};
