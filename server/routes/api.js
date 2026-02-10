const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Division = require("../models/Division");
const Credential = require("../models/Credential");
const { verifyToken, checkRole } = require("../middleware/authMiddleware");

// --- AUTHENTICATION (Task 1) ---

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Default role is 'normal'
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "User not found" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ error: "Invalid password" });

    // Create Token with ID and Role
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
    );
    res
      .header("Authorization", token)
      .json({ token, role: user.role, userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- CREDENTIALS (Task 2) ---

// Get Credentials for a specific Division
router.get("/credentials/:divisionId", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Check if user belongs to this division OR is admin
    if (
      user.role !== "admin" &&
      !user.divisions.includes(req.params.divisionId)
    ) {
      return res
        .status(403)
        .json({ error: "Not authorized for this division" });
    }

    const credentials = await Credential.find({
      division: req.params.divisionId,
    });
    res.json(credentials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add Credential (Normal, Management, Admin)
router.post("/credentials", verifyToken, async (req, res) => {
  try {
    const { platformName, username, password, divisionId } = req.body;
    const cred = new Credential({
      platformName,
      username,
      password,
      division: divisionId,
    });
    await cred.save();
    res.status(201).json(cred);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Credential (Management, Admin only)
router.put(
  "/credentials/:id",
  verifyToken,
  checkRole(["management", "admin"]),
  async (req, res) => {
    try {
      const updated = await Credential.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
      );
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// --- ADMIN & DATA (Task 3) ---

// Get All Divisions (For UI)
router.get("/divisions", verifyToken, async (req, res) => {
  const divisions = await Division.find();
  res.json(divisions);
});

// Assign User to Division (Admin Only)
router.post("/assign", verifyToken, checkRole(["admin"]), async (req, res) => {
  try {
    const { username, divisionId } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.divisions.includes(divisionId)) {
      user.divisions.push(divisionId);
      await user.save();
    }
    res.json({ message: "User assigned to division" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Change User Role (Admin Only)
router.put("/role", verifyToken, checkRole(["admin"]), async (req, res) => {
  try {
    const { username, newRole } = req.body;
    const user = await User.findOneAndUpdate(
      { username },
      { role: newRole },
      { new: true },
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SEED ROUTE (To create sample OUs/Divisions quickly)
router.post("/seed", async (req, res) => {
  const OUs = [
    "News Management",
    "Software Reviews",
    "Hardware Reviews",
    "Opinion Publishing",
  ];
  const createdDivisions = [];

  for (const ou of OUs) {
    // Create 2 divisions per OU for testing
    const div1 = await new Division({ name: "IT Support", ou }).save();
    const div2 = await new Division({ name: "Finances", ou }).save();
    createdDivisions.push(div1, div2);
  }

  // Create an Admin user automatically for testing
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash("admin123", salt);
  await new User({ username: "admin", password: hash, role: "admin" }).save();

  res.json({ message: "Database Seeded", createdDivisions });
});

module.exports = router;
