const jwt = require('jsonwebtoken');

const payload = {
  id: 6, // system admin user id
  email: "sysadmin@gmail.com",
  role: "system_admin"
};

const token = jwt.sign(payload, process.env.JWT_SECRET || "BeeSecretKey1987@!%", {
  expiresIn: process.env.JWT_EXPIRES_IN || "7d"
});

console.log("Your token:", token);
