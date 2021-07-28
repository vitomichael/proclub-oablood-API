const express = require("express");
const {
  loginRS,
  lihatPendonorRS,
  reqDarah,
  verifikasiPendonorRS,
  kelolaJadwal,
} = require("../controllers/rsController");

const { authenticateToken, permit } = require("../middleware/auth");

const router = express.Router();

router.post("/login", loginRS);
router.get("/pendonor", authenticateToken, permit("rs"), lihatPendonorRS);
router.post("/req-darah", authenticateToken, permit("rs"), reqDarah);
router.put("/verifikasi/:id", authenticateToken, permit("rs"), verifikasiPendonorRS);
router.put("/jadwal/:id", authenticateToken, permit("rs"), kelolaJadwal);

module.exports = router;