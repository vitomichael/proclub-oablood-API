const express = require("express");
const { logout } = require("../controllers/adminController");
const {
  createUser,
  loginUser,
  updateProfile,
  lihatProfile,
  donorDarahRS,
  donorDarahPMI,
  lihatEvent,
  specificEvent,
  lihatRequestDarah,
  specificRequestDarah,
  lihatReward,
  specificReward,
  tukarPoint,
  uploadPicture,
  forgotPassword,
  deletePicture,
  lihatArtikel,
  specificArtikel,
  membuatKomplain,
  checkCredentials,
} = require("../controllers/userController");
const router = express.Router();

const { authenticateToken, permit } = require("../middleware/auth");
const upload = require("../middleware/image-uploader");
const { validate } = require("../middleware/validation");
const {
  createUserSchema,
  loginUserSchema,
  updateProfileSchema,
  forgotPasswordSchema,
  membuatKomplainSchmea,
  membuatKomplainSchema,
} = require("../middleware/validation/schema/userSchema");
const komplain = require("../models/komplain");
const { route } = require("./menuRouter");

router.post("/register", validate(createUserSchema), createUser);
router.post("/login", validate(loginUserSchema), loginUser);
router.get("/profile/:id", authenticateToken, lihatProfile);
router.put(
  "/profile/:id",
  validate(updateProfileSchema),
  authenticateToken,
  permit("user", "premium"),
  updateProfile
);
router.put(
  "/picture",
  authenticateToken,
  permit("user", "premium"),
  upload,
  uploadPicture
);
router.put("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post(
  "/donor-darah-rs",
  authenticateToken,
  permit("user", "premium"),
  donorDarahRS
);
router.post(
  "/donor-darah-pmi",
  authenticateToken,
  permit("user", "premium"),
  donorDarahPMI
);
router.delete(
  "/delete-picture",
  authenticateToken,
  permit("user", "premium"),
  deletePicture
);
router.get("/artikel", authenticateToken, lihatArtikel);
router.get("/artikel/:id", authenticateToken, specificArtikel);
router.get("/event", authenticateToken, lihatEvent);
router.get("/event/:id", authenticateToken, specificEvent);
router.get("/request-darah", authenticateToken, lihatRequestDarah);
router.get("/request-darah/:id", authenticateToken, specificRequestDarah);
router.get("/reward", authenticateToken, lihatReward);
router.get("/reward/:id", authenticateToken, specificReward);
router.post("/tukarpoint", authenticateToken, tukarPoint);
router.post(
  "/komplain",
  validate(membuatKomplainSchema),
  authenticateToken,
  membuatKomplain
);
router.post("/check-data", checkCredentials);
router.delete("/logout", authenticateToken, logout);

module.exports = router;
