// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// module.exports = function(req, res, next) {
//   const token = req.header("Authorization");
//   console.log(token);
//   if (!token) {
//     return res.status(403).json({ msg: "Authorization denied" });
//   }
//   try {
//     const tokenWithoutPrefix = token.replace("Bearer ", "");
//     const verify = jwt.verify(tokenWithoutPrefix, process.env.JWT_SECRET);
//     req.user = verify.user;
//     next();
//   } catch (err) {
//     res.status(401).json({ msg: "Token is not valid" });
//   }
// };


const jwt = require("jsonwebtoken");
require("dotenv").config();

const authorize = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(403).json({ msg: "Authorization denied" });
  }
  try {
    const tokenWithoutPrefix = token.replace("Bearer ", "");
    const verify = jwt.verify(tokenWithoutPrefix, process.env.JWT_SECRET);
    req.user = verify.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: "Access denied" });
    }
    next();
  };
};

module.exports = { authorize, authorizeRoles };
