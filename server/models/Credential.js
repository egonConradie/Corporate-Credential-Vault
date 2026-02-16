const mongoose = require("mongoose");

// schema = structure of how a credential is stored in MongoDB
const credentialSchema = new mongoose.Schema(
  {
    // name of the system/service (gmail, aws, server etc)
    serviceName: {
      type: String,
      required: true, // cannot save without this
    },

    // login username/email for that service
    username: {
      type: String,
      required: true,
    },

    // password linked to that account
    password: {
      type: String,
      required: true,
    },

    // Division this credential belongs to
    // ObjectId.... links to another collection
    division: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Division", // references Division model
      required: true,
    },

    // which user created the credential
    // not required but useful for tracking
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    // mongoose auto adds createdAt and updatedAt fields
    timestamps: true,
  },
);

// exports model so routes/controllers can use it
module.exports = mongoose.model("Credential", credentialSchema);
