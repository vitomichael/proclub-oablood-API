const express = require("express");
const {
  buatAkunRS,
  buatAkunPMI,
  login,
  membuatArtikel,
} = require('../controllers/adminController');
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

router.post("/login", login);
router.post("/buat-akun-rs", authenticateToken, buatAkunRS);
router.post("/buat-akun-pmi", authenticateToken, buatAkunPMI);
router.post("/post-artikel", authenticateToken, membuatArtikel);

module.exports = router;
