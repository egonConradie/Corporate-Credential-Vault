const mongoose = require("mongoose");

const divisionSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Finance", "IT"
  ou: { type: String, required: true }, // e.g., "News Management"
});

module.exports = mongoose.model("Division", divisionSchema);
