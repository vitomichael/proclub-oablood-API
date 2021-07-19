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

const { authenticateToken } = require("../middleware/auth");

module.exports = router;

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/profile", lihatProfile);
router.put("/profile/:id", updateProfile);
router.get("/event", lihatEvent);
router.get("/event/:id", specificEvent);
router.get("/request", lihatRequestDarah);
router.get("/request/:id", specificRequestDarah);
router.post("/donordarah", authenticateToken, donorDarah);
