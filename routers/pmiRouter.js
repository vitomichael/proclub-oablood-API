const express = require("express");
const {
  loginPMI,
  buatEvent,
  verifikasiPendonorPMI,
  lihatPendonorPMI,
  deleteEvent,
} = require("../controllers/pmiController");

const { authenticateToken, permit } = require("../middleware/auth");
const { validate } = require("../middleware/validation");
const {
  loginPMISchema,
  buatEventSchema,
} = require("../middleware/validation/schema/pmiSchema");

const router = express.Router();

router.post("/login", validate(loginPMISchema), loginPMI);
router.post(
  "/buat-event",
  validate(buatEventSchema),
  authenticateToken,
  permit("PMI"),
  buatEvent
);
router.delete("/delete-event", authenticateToken, permit("PMI"), deleteEvent);
router.put(
  "/verifikasi/:id",
  authenticateToken,
  permit("PMI"),
  verifikasiPendonorPMI
);
router.get("/pendonor", authenticateToken, permit("PMI"), lihatPendonorPMI);

module.exports = router;
