const mongoose = require("mongoose");

// schema for divisions inside the org
const divisionSchema = new mongoose.Schema(
  {
    // name of the division (example --. Sales, IT)
    name: {
      type: String,
      required: true, // cannot save without name....
    },

    // links division to an organizational unit
    ou: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OU", // references OU collection
      required: true,
    },
  },
  {
    // automatically adds createdAt and updatedAt
    timestamps: true,
  },
);

// export model so we can use it in controllers/routes
module.exports = mongoose.model("Division", divisionSchema);
