const jwt = require("jsonwebtoken");
const db = require("../models");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.rest.unauthorized("Authentikasi Gagal");

  jwt.verify(token, process.env.TOKEN_SECRET, async (err, user) => {
    if (err) return res.rest.unauthorized("Authentikasi Gagal");

    const userToken = await db.Token.findOne({
      where: { token },
    });
    if (!userToken) return res.rest.unauthorized("Token tidak sesuai");

    req.user = user;
    next();
  });
};

const permit = (...allow) => {
  const isAllowed = (status) => allow.indexOf(status) > -1;

  return (req, res, next) => {
    if (isAllowed(req.user.role)) {
      next();
    } else {
      return res.rest.unauthorized("Role tidak sesuai");
    }
  };
};

module.exports = { authenticateToken, permit };
