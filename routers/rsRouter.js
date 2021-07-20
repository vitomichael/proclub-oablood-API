const express = require("express");
const {
  loginRS,
  lihatPendonorRS,
  reqDarah,
  verifikasiPendonor,
} = require("../controllers/rsController");

const {
  lihatEvent,
  lihatRequestDarah,
  specificEvent,
  specificRequestDarah,
} = require("../controllers/userController")
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

router.post("/login", loginRS);
router.get("/pendonor", authenticateToken, lihatPendonorRS);
router.post("/req-darah", authenticateToken, reqDarah);
router.put("/verifikasi/:id", authenticateToken, verifikasiPendonor);
router.get("/event", authenticateToken, lihatEvent);
router.get("/event/:id", authenticateToken, specificEvent);
router.get("/request", authenticateToken, lihatRequestDarah);
router.get("/request/:id", authenticateToken, specificRequestDarah);

module.exports = router;