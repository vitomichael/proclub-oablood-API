const express = require("express");
const {
  loginPMI,
  buatEvent,
  verifikasiPendonorPMI,
  lihatPendonorPMI,
} = require("../controllers/pmiController");
const {
  lihatRequestDarah,
  lihatEvent,
  specificRequestDarah,
  specificEvent,
} = require("../controllers/userController");
const { authenticateToken, permit } = require("../middleware/auth");

const router = express.Router();

router.post("/login", loginPMI);
router.post("/buat-event", authenticateToken, permit("PMI"), buatEvent);
router.put("/verifikasi/:id", authenticateToken, permit("PMI"), verifikasiPendonorPMI);
router.get("/pendonor", authenticateToken, permit("PMI"), lihatPendonorPMI);
router.get("/event", authenticateToken, permit("PMI"), lihatEvent);
router.get("/event/:id", authenticateToken, permit("PMI"), specificEvent);
router.get("/request", authenticateToken, permit("PMI"), lihatRequestDarah);
router.get("/request/:id", authenticateToken, permit("PMI"), specificRequestDarah);

module.exports = router;