const mongoose = require("mongoose");

const credentialSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    division: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Division",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Credential", credentialSchema);
