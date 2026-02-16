const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Division = require("../models/Division");
const OU = require("../models/OU");
const { verifyToken, isAdmin } = require("../middleware/auth");

// Get all users (admin only)
router.get("/users", verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().populate("divisions");
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Get all divisions
router.get("/divisions", verifyToken, async (req, res) => {
  try {
    const divisions = await Division.find().populate("ou");
    res.json(divisions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching divisions" });
  }
});

// Get all OUs
router.get("/ous", verifyToken, async (req, res) => {
  try {
    const ous = await OU.find();
    res.json(ous);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching OUs" });
  }
});

// Assign user to division (admin only)
router.post(
  "/users/:userId/divisions",
  verifyToken,
  isAdmin,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { divisionId } = req.body;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // check if already assigned
      if (user.divisions.includes(divisionId)) {
        return res
          .status(400)
          .json({ message: "User already in this division" });
      }

      user.divisions.push(divisionId);
      await user.save();
      await user.populate("divisions");

      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error assigning division" });
    }
  },
);

// Remove user from division (admin only)
router.delete(
  "/users/:userId/divisions/:divisionId",
  verifyToken,
  isAdmin,
  async (req, res) => {
    try {
      const { userId, divisionId } = req.params;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.divisions = user.divisions.filter(
        (d) => d.toString() !== divisionId,
      );

      await user.save();
      await user.populate("divisions");

      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error removing division" });
    }
  },
);

// Change user role (admin only)
router.put("/users/:userId/role", verifyToken, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["normal", "management", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true },
    ).populate("divisions");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error changing role" });
  }
});

module.exports = router;
