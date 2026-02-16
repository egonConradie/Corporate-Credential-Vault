const mongoose = require("mongoose");

// schema for organizational unit (OU)
const ouSchema = new mongoose.Schema(
  {
    // name of the OU (unique.....duplicates)
    name: {
      type: String,
      required: true,
      unique: true,
    },

    // optional description of what this OU does
    description: String,
  },
  {
    // adds createdAt and updatedAt automatically
    timestamps: true,
  },
);

// export model so we can use it in routes/controllers
module.exports = mongoose.model("OU", ouSchema);
