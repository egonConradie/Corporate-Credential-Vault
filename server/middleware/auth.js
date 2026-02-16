const jwt = require("jsonwebtoken");
const User = require("../models/User");

// middleware to verify token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).populate("divisions");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
};

// middleware to check if user is management or admin
const isManagement = (req, res, next) => {
  if (req.user.role !== "management" && req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Access denied. Management or Admin only." });
  }
  next();
};

module.exports = { verifyToken, isAdmin, isManagement };
