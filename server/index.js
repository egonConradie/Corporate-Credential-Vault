const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const credentialRoutes = require("./routes/credentials");
const adminRoutes = require("./routes/admin");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/credentials", credentialRoutes);
app.use("/api/admin", adminRoutes);

// Seed endpoint for initial data
app.post("/api/seed", async (req, res) => {
  try {
    const OU = require("./models/OU");
    const Division = require("./models/Division");
    const User = require("./models/User");
    const bcrypt = require("bcrypt");

    // Create OUs
    const newsManagement = await OU.findOneAndUpdate(
      { name: "News Management" },
      { name: "News Management", description: "Manages news content" },
      { upsert: true, new: true },
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

    // Create Divisions
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
      await Division.findOneAndUpdate({ name: div.name, ou: div.ou }, div, {
        upsert: true,
      });
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
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

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
