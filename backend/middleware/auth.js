const jwt = require('jsonwebtoken');
const Login = require('../models/login');

const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to the request object
    next();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to authenticate token" });
  }
};

module.exports = authenticate;
