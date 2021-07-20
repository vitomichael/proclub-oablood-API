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
const { authenticateToken, permit } = require("../middleware/auth");

const router = express.Router();

router.post("/login", loginRS);
router.get("/pendonor", authenticateToken, permit("rs"), lihatPendonorRS);
router.post("/req-darah", authenticateToken, permit("rs"), reqDarah);
router.put("/verifikasi/:id", authenticateToken, permit("rs"), verifikasiPendonor);
router.get("/event", authenticateToken, permit("rs"), lihatEvent);
router.get("/event/:id", authenticateToken, permit("rs"), specificEvent);
router.get("/request", authenticateToken, permit("rs"), lihatRequestDarah);
router.get("/request/:id", authenticateToken, permit("rs"), specificRequestDarah);

module.exports = router;