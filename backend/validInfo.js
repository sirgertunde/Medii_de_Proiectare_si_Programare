const validator = require('email-validator');

module.exports = function(req, res, next) {
    const { email, username, password } = req.body;
    function validEmail(userEmail) {
      return validator.validate(userEmail);
    }
    if (req.path === "/register") {
      if (![email, username, password].every(Boolean)) {
        return res.status(400).json("Missing credentials");
      } else if (!validEmail(email)) {
        return res.status(400).json("Invalid email");
      }
    } else if (req.path === "/login") {
      if (![email, password].every(Boolean)) {
        return res.status(400).json("Missing credentials");
      } else if (!validEmail(email)) {
        return res.status(400).json("Invalid email");
      }
    }
    next();
};