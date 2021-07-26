const express = require("express");
const {
  lihatRequestDarah,
  lihatEvent,
  specificRequestDarah,
  specificEvent,
} = require("../controllers/userController");

const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

router.get("/request", authenticateToken, lihatRequestDarah);
router.get("/event", authenticateToken, lihatEvent);
router.get("/request/:id", authenticateToken, specificRequestDarah);
router.get("/event/:id", authenticateToken, specificEvent);

module.exports = router;