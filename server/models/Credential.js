const mongoose = require("mongoose");

const credentialSchema = new mongoose.Schema({
  platformName: { type: String, required: true }, // e.g., "WordPress Site A"
  username: { type: String, required: true },
  password: { type: String, required: true },
  division: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Division",
    required: true,
  },
});

module.exports = mongoose.model("Credential", credentialSchema);
