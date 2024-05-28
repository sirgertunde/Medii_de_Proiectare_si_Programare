const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(userId, userRole) {
  const payload = {
    user: {
      id: userId,
      role: userRole
    }
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });
}

module.exports = jwtGenerator;