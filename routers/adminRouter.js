const express = require("express");
const {
  buatAkunRS,
  buatAkunPMI,
  login,
  membuatArtikel,
  deleteArtikel,
} = require("../controllers/adminController");

const { authenticateToken, permit } = require("../middleware/auth");
const upload = require("../middleware/image-uploader");
const { validate } = require("../middleware/validation");
const {
  loginSchema,
  buatAkunRSSchema,
  buatAkunPMISchema,
  membuatArtikelSchema,
} = require("../middleware/validation/schema/adminSchema");

const router = express.Router();

router.post("/login", validate(loginSchema), login);
router.post(
  "/buat-akun-rs",
  validate(buatAkunRSSchema),
  authenticateToken,
  permit("admin"),
  buatAkunRS
);
router.post(
  "/buat-akun-pmi",
  validate(buatAkunPMISchema),
  authenticateToken,
  permit("admin"),
  buatAkunPMI
);
router.post(
  "/post-artikel",
  validate(membuatArtikelSchema),
  authenticateToken,
  permit("admin"),
  upload,
  membuatArtikel
);
router.delete(
  "/delete-artikel/:id",
  authenticateToken,
  permit("admin"),
  deleteArtikel
);

module.exports = router;
