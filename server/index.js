const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const credentialRoutes = require("./routes/credentials");
const adminRoutes = require("./routes/admin");

const app = express();

// ===== MIDDLEWARE =====
// allow cross origin requests
app.use(cors());

// parse JSON body automatically
app.use(express.json());

// ===== ROUTES =====
app.use("/api/auth", authRoutes); // login/register stuff
app.use("/api/credentials", credentialRoutes); // CRUD credentials
app.use("/api/admin", adminRoutes); // admin actions

// ===== SEED ENDPOINT =====
// just for initial testing/data setup
app.post("/api/seed", async (req, res) => {
  try {
    const OU = require("./models/OU");
    const Division = require("./models/Division");
    const User = require("./models/User");
    const bcrypt = require("bcrypt");

    // create some OUs (if not exist already)
    const newsManagement = await OU.findOneAndUpdate(
      { name: "News Management" },
      { name: "News Management", description: "Manages news content" },
      { upsert: true, new: true }, // create if not exist
    );

    const softwareReviews = await OU.findOneAndUpdate(
      { name: "Software Reviews" },
      { name: "Software Reviews", description: "Reviews software products" },
      { upsert: true, new: true },
    );

    const hardwareReviews = await OU.findOneAndUpdate(
      { name: "Hardware Reviews" },
      { name: "Hardware Reviews", description: "Reviews hardware products" },
      { upsert: true, new: true },
    );

    const opinionPublishing = await OU.findOneAndUpdate(
      { name: "Opinion Publishing" },
      { name: "Opinion Publishing", description: "Publishes opinion pieces" },
      { upsert: true, new: true },
    );

    // create divisions and link to OUs
    const divisions = [
      { name: "Finance", ou: newsManagement._id },
      { name: "IT", ou: newsManagement._id },
      { name: "Writing", ou: newsManagement._id },
      { name: "Development", ou: softwareReviews._id },
      { name: "Testing", ou: softwareReviews._id },
      { name: "Engineering", ou: hardwareReviews._id },
      { name: "Quality Assurance", ou: hardwareReviews._id },
      { name: "Editorial", ou: opinionPublishing._id },
      { name: "Research", ou: opinionPublishing._id },
    ];

    for (const div of divisions) {
      // create division if not exist
      await Division.findOneAndUpdate({ name: div.name, ou: div.ou }, div, {
        upsert: true,
      });
    }

    // create admin user (password hashed)
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // get all divisions for admin to belong to
    const allDivisions = await Division.find();

    await User.findOneAndUpdate(
      { username: "admin" },
      {
        username: "admin",
        password: hashedPassword,
        role: "admin",
        divisions: allDivisions.map((d) => d._id),
      },
      { upsert: true },
    );

    res.json({ message: "Database seeded successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error seeding database", error: error.message });
  }
});

// ===== CONNECT TO MONGO =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    // start express server after db connection
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
