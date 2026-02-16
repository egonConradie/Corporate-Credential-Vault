const mongoose = require("mongoose");

// schema for users in the system
const userSchema = new mongoose.Schema(
  {
    // username/login name (unique so no duplicates)
    username: {
      type: String,
      required: true,
      unique: true,
    },

    // password for login
    password: {
      type: String,
      required: true,
    },

    // user role (normal,management,admin)
    role: {
      type: String,
      enum: ["normal", "management", "admin"],
      default: "normal", // default role if nothing is set
    },

    // divisions the user belongs to
    divisions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Division", // links to division collection
      },
    ],
  },
  {
    // automatically adds createdAt and updatedAt
    timestamps: true,
  },
);

// export model so we can use in routes/controllers
module.exports = mongoose.model("User", userSchema);
