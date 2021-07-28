const express = require("express");
const {
  createUser,
  loginUser,
  updateProfile,
  lihatProfile,
  donorDarahRS,
  donorDarahPMI,
  lihatEvent,
  specificEvent,
  lihatRequestDarah,
  specificRequestDarah,
} = require("../controllers/userController");
const router = express.Router();

const { authenticateToken, permit } = require("../middleware/auth");
const { route } = require("./menuRouter");

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/profile", authenticateToken, lihatProfile);
router.put("/profile/:id", authenticateToken, permit("user"), updateProfile);
router.post("/donor-darah-rs", authenticateToken, permit("user"), donorDarahRS);
router.post(
  "/donor-darah-pmi",
  authenticateToken,
  permit("user"),
  donorDarahPMI
);
router.get("/event", lihatEvent);
router.get("/event/:id", specificEvent);
router.get("/request-darah", lihatRequestDarah);
router.get("/request-darah/:id", specificRequestDarah);

module.exports = router;
