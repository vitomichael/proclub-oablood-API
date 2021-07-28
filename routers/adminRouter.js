const express = require("express");
const {
  buatAkunRS,
  buatAkunPMI,
  login,
  membuatArtikel,
  deleteArtikel,
} = require('../controllers/adminController');

const { authenticateToken, permit } = require("../middleware/auth");
const upload = require("../middleware/image-uploader");

const router = express.Router();

router.post("/login", login);
router.post("/buat-akun-rs", authenticateToken, permit("admin"), buatAkunRS);
router.post("/buat-akun-pmi", authenticateToken, permit("admin"), buatAkunPMI);
router.post("/post-artikel", authenticateToken, permit("admin"), upload, membuatArtikel);
router.delete("/delete-artikel/:id", authenticateToken, permit("admin"), deleteArtikel);

module.exports = router;
