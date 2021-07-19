const express = require('express');
const adminController = require('../controller/adminController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/buat-akun-rs', adminController.buatAkunRS);
router.post('/buat-akun-pmi', adminController.buatAkunPMI);
router.post('/login', adminController.login);
router.post('/post-artikel', auth.authenticateToken, adminController.membuatArtikel);

module.exports = router;