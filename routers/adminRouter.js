const express = require("express");
const {
  buatAkunRS,
  buatAkunPMI,
  login,
  membuatArtikel,
} = require('../controllers/adminController');
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/buat-akun-rs", buatAkunRS);
router.post("/buat-akun-pmi", buatAkunPMI);
router.post("/login", login);
router.post(
  "/post-artikel",
  auth.authenticateToken,
  membuatArtikel
);

module.exports = router;
