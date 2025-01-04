const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    img: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add text indexes for better search functionality
channelSchema.index(
  {
    name: "text",
  },
  {
    weights: {
      name: 10, // Give more weight to name matches
    },
  }
);

// Add regular index for standard queries
channelSchema.index({ name: 1 });
channelSchema.index({ createdAt: -1 });

const Channel = mongoose.model("Channel", channelSchema);
module.exports = Channel;
