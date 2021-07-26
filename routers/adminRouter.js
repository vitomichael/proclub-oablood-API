const express = require("express");
const {
  buatAkunRS,
  buatAkunPMI,
  login,
  membuatArtikel,
} = require('../controllers/adminController');

const { authenticateToken, permit } = require("../middleware/auth");

const router = express.Router();

router.post("/login", login);
router.post("/buat-akun-rs", authenticateToken, permit("admin"), buatAkunRS);
router.post("/buat-akun-pmi", authenticateToken, permit("admin"), buatAkunPMI);
router.post("/post-artikel", authenticateToken, permit("admin"), membuatArtikel);

module.exports = router;
