const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    videoLink: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
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

videoSchema.index(
  {
    title: "text",
    description: "text",
    keywords: "text",
    "relatedPeople.name": "text",
  },
  {
    weights: {
      "relatedPeople.name": 10,
      keywords: 5,
      description: 3,
    },
  }
);

const Video = mongoose.model("Video", videoSchema);
module.exports = Video;
