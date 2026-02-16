const mongoose = require("mongoose");

const divisionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ou: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OU",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Division", divisionSchema);
