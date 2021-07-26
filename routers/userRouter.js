const express = require("express");
const {
  createUser,
  loginUser,
  updateProfile,
  lihatProfile,
  donorDarah,
} = require("../controllers/userController");
const router = express.Router();

const { authenticateToken, permit } = require("../middleware/auth");


router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/profile", authenticateToken, permit("user"), lihatProfile);
router.put("/profile/:id", authenticateToken, permit("user"), updateProfile);
router.post("/donordarah", authenticateToken, permit("user"), donorDarah);

module.exports = router;