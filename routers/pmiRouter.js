const express = require("express");
const {
  loginPMI,
  buatEvent,
  verifikasiPendonorPMI,
  lihatPendonorPMI,
} = require("../controllers/pmiController");

const { authenticateToken, permit } = require("../middleware/auth");

const router = express.Router();

router.post("/login", loginPMI);
router.post("/buat-event", authenticateToken, permit("PMI"), buatEvent);
router.put("/verifikasi/:id", authenticateToken, permit("PMI"), verifikasiPendonorPMI);
router.get("/pendonor", authenticateToken, permit("PMI"), lihatPendonorPMI);

module.exports = router;