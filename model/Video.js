const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    videoLink: {
      type: String,
      required: true,
    },
    keywords: [
      {
        type: String,
        trim: true,
      },
    ],
    relatedPeople: [
      {
        person: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Person",
          required: true,
        },
        name: String,
      },
    ],
    datetime: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound indexes for better search performance
videoSchema.index({
  title: "text",
  description: "text",
  keywords: "text",
  "relatedPeople.name": "text",
});
videoSchema.index({ datetime: 1, createdAt: -1 });

module.exports = mongoose.model("Video", videoSchema);
