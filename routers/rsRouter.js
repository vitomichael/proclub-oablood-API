const express = require("express");
const {
  loginRS,
  lihatPendonorRS,
  reqDarah,
  verifikasiPendonorRS,
  kelolaJadwal,
  selesaiDonorRS,
  spesificPendonorRS,
} = require("../controllers/rsController");

const { authenticateToken, permit } = require("../middleware/auth");
const { validate } = require("../middleware/validation");
const {
  loginRSSchema,
  reqDarahSchema,
} = require("../middleware/validation/schema/rsSchema");

const router = express.Router();

router.post("/login", validate(loginRSSchema), loginRS);
router.get("/pendonor", authenticateToken, permit("rs"), lihatPendonorRS);
router.get("/pendonor/:id", authenticateToken, permit("rs"), spesificPendonorRS);
router.post(
  "/req-darah",
  validate(reqDarahSchema),
  authenticateToken,
  permit("rs"),
  reqDarah
);
router.put(
  "/verifikasi/:id",
  authenticateToken,
  permit("rs"),
  verifikasiPendonorRS
);
router.put(
  "/selesai-rs/:id",
  authenticateToken,
  permit("rs"),
  selesaiDonorRS
);
router.put(
  "/jadwal/:id", 
  authenticateToken, 
  permit("rs"), 
  kelolaJadwal
);

module.exports = router;
