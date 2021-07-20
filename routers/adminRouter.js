const express = require("express");
const {
  buatAkunRS,
  buatAkunPMI,
  login,
  membuatArtikel,
  lihatRequestDarah,
  lihatEvent,
  specificRequestDarah,
  specificEvent,
} = require('../controllers/adminController');
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

router.post("/login", login);
router.post("/buat-akun-rs", authenticateToken, buatAkunRS);
router.post("/buat-akun-pmi", authenticateToken, buatAkunPMI);
router.post("/post-artikel", authenticateToken, membuatArtikel);
router.post("/request", authenticateToken, lihatRequestDarah);
router.post("/event", authenticateToken, lihatEvent);
router.post("/request/:id", authenticateToken, specificRequestDarah);
router.post("/eventt/:id", authenticateToken, specificEvent);

module.exports = router;
