const express = require("express");
const router = express.Router();
const Credential = require("../models/Credential");
const { verifyToken, isManagement } = require("../middleware/auth");

// Get all credentials for user's divisions
router.get("/", verifyToken, async (req, res) => {
  try {
    const userDivisions = req.user.divisions.map((d) => d._id);

    const credentials = await Credential.find({
      division: { $in: userDivisions },
    }).populate("division");

    res.json(credentials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching credentials" });
  }
});

// Get credentials by division
router.get("/division/:divisionId", verifyToken, async (req, res) => {
  try {
    const { divisionId } = req.params;

    // check if user has access to this division
    const hasAccess = req.user.divisions.some(
      (d) => d._id.toString() === divisionId,
    );

    if (!hasAccess && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied to this division" });
    }

    const credentials = await Credential.find({
      division: divisionId,
    }).populate("division");

    res.json(credentials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching credentials" });
  }
});

// Add new credential
router.post("/", verifyToken, async (req, res) => {
  try {
    const { serviceName, username, password, division } = req.body;

    // check if user has access to this division
    const hasAccess = req.user.divisions.some(
      (d) => d._id.toString() === division,
    );

    if (!hasAccess && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied to this division" });
    }

    const newCredential = new Credential({
      serviceName,
      username,
      password,
      division,
      createdBy: req.user._id,
    });

    await newCredential.save();
    await newCredential.populate("division");

    res.status(201).json(newCredential);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding credential" });
  }
});

// Update credential (management or admin only)
router.put("/:id", verifyToken, isManagement, async (req, res) => {
  try {
    const { id } = req.params;
    const { serviceName, username, password } = req.body;

    const credential = await Credential.findById(id);

    if (!credential) {
      return res.status(404).json({ message: "Credential not found" });
    }

    // update fields
    if (serviceName) credential.serviceName = serviceName;
    if (username) credential.username = username;
    if (password) credential.password = password;

    await credential.save();
    await credential.populate("division");

    res.json(credential);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating credential" });
  }
});

module.exports = router;
