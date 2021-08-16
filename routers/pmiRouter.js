const express = require("express");
const {
  loginPMI,
  buatEvent,
  lihatPendonorPMI,
  deleteEvent,
  selesaiDonorPMI,
  spesificPendonorPMI,
  batalDonorPMI
} = require("../controllers/pmiController");

const upload = require("../middleware/image-uploader");
const { authenticateToken, permit } = require("../middleware/auth");
const { validate } = require("../middleware/validation");
const {
  loginPMISchema,
} = require("../middleware/validation/schema/pmiSchema");

const router = express.Router();

router.post("/login", validate(loginPMISchema), loginPMI);
router.post(
  "/buat-event",
  authenticateToken,
  permit("PMI"),
  upload,
  buatEvent
);
router.delete(
  "/delete-event/:id",
  authenticateToken,
  permit("PMI"),
  deleteEvent
);
router.put(
  "/selesai-pmi/:id",
  authenticateToken,
  permit("PMI"),
  selesaiDonorPMI
);
router.delete("/batal/:id", authenticateToken, permit("PMI"), batalDonorPMI);
router.get("/pendonor", authenticateToken, permit("PMI"), lihatPendonorPMI);
router.get("/pendonor/:id", authenticateToken, permit("PMI"), spesificPendonorPMI);

module.exports = router;
