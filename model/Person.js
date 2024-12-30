const mongoose = require("mongoose");

const personSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    occupation: [
      {
        type: String,
        trim: true,
      },
    ],
    description: {
      type: String,
      required: true,
    },
    aliases: [
      {
        type: String,
        trim: true,
      },
    ],
    img: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

personSchema.index(
  {
    name: "text",
    description: "text",
    aliases: "text",
    occupation: "text",
  },
  {
    weights: {
      name: 10,
      aliases: 8,
      occupation: 5,
      description: 3,
    },
  }
);

const Person = mongoose.model("Person", personSchema);
module.exports = Person;
