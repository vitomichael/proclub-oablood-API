const express = require("express");
const {
  createUser,
  loginUser,
  updateProfile,
  lihatProfile,
  lihatEvent,
  specificEvent,
  lihatRequestDarah,
  specificRequestDarah,
  donorDarah,
} = require("../controllers/userController");
const router = express.Router();

const { authenticateToken, permit } = require("../middleware/auth");

module.exports = router;

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/profile", authenticateToken, permit("user"), lihatProfile);
router.put("/profile/:id", authenticateToken, permit("user"), updateProfile);
router.get("/event", lihatEvent);
router.get("/event/:id", specificEvent);
router.get("/request", lihatRequestDarah);
router.get("/request/:id", specificRequestDarah);
router.post("/donordarah", authenticateToken, permit("user"), donorDarah);
