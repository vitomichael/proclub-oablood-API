const express = require("express");
const {
  loginRS,
  lihatPendonorRS,
  reqDarah,
  selesaiDonorRS,
  spesificPendonorRS,
  batalDonorRS,
  deleteReqDarah,
  lihatProfileRS,
} = require("../controllers/rsController");

const upload = require("../middleware/image-uploader");
const { authenticateToken, permit } = require("../middleware/auth");
const { validate } = require("../middleware/validation");
const { loginRSSchema } = require("../middleware/validation/schema/rsSchema");

const router = express.Router();

router.post("/login", validate(loginRSSchema), loginRS);
router.get("/profile-rs/:id", authenticateToken, lihatProfileRS);
router.get("/pendonor", authenticateToken, permit("rs"), lihatPendonorRS);
router.get(
  "/pendonor/:id",
  authenticateToken,
  permit("rs", "user", "premium"),
  spesificPendonorRS
);
router.post("/req-darah", authenticateToken, permit("rs"), upload, reqDarah);
router.put("/selesai-rs/:id", authenticateToken, permit("rs"), selesaiDonorRS);
router.delete("/batal/:id", authenticateToken, permit("rs"), batalDonorRS);
router.delete(
  "/delete-req/:id",
  authenticateToken,
  permit("rs"),
  deleteReqDarah
);

module.exports = router;
