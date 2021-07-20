const express = require("express");
const {
  buatAkunRS,
  buatAkunPMI,
  login,
  membuatArtikel,
} = require('../controllers/adminController');
const {
  lihatRequestDarah,
  lihatEvent,
  specificRequestDarah,
  specificEvent,
} = require("../controllers/userController")
const { authenticateToken, permit } = require("../middleware/auth");

const router = express.Router();

router.post("/login", login);
router.post("/buat-akun-rs", authenticateToken, permit("admin"), buatAkunRS);
router.post("/buat-akun-pmi", authenticateToken, permit("admin"), buatAkunPMI);
router.post("/post-artikel", authenticateToken, permit("admin"), membuatArtikel);
router.post("/request", authenticateToken, permit("admin"), lihatRequestDarah);
router.post("/event", authenticateToken, lihatEvent);
router.post("/request/:id", authenticateToken, specificRequestDarah);
router.post("/eventt/:id", authenticateToken, specificEvent);

module.exports = router;
