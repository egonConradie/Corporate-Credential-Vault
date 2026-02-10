// Load the jsonwebtoken library to handle token validation
const jwt = require("jsonwebtoken");

// Verify Token Middleware
exports.verifyToken = (req, res, next) => {
  // Grab Authorization header from the incoming request
  const token = req.header("Authorization");

  // No header found ---> stop the request here
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    /* Split string to remove the "Bearer " prefix and get just the token.
       Then verifyy against our secret key stored in the .env file.
    */
    const verified = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);

    // Attach the decoded user data (ID, Role) to the request object for later use
    req.user = verified;

    // Move to the next function
    next();
  } catch (err) {
    // Call if the token is expired
    res.status(400).json({ error: "Invalid token" });
  }
};

// 2. Check Role Middleware
/* This is a higher-order function that takes an array of allowed roles.
   It checks the role attached to the request by the verifyToken middleware above.
*/
exports.checkRole = (roles) => (req, res, next) => {
  // Check if the user's role exists within the allowed roles array
  if (!roles.includes(req.user.role)) {
    // Returns a 403 Forbidden if they don't have clearance (e.g. Normal user trying to Edit)
    return res
      .status(403)
      .json({ error: "Access forbidden: Insufficient permissions" });
  }

  // If role is authorized, proceed to -----> controller logic
  next();
};
