const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(userId) {
  const payload = {
    user: {
      id: userId
    }
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });
}

module.exports = jwtGenerator;