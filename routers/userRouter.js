const express = require("express");
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
} = require("../controllers/userController");
const router = express.Router();

const { authenticateToken, permit } = require("../middleware/auth");
const { validate } = require("../middleware/validation");
const {
  createUserSchema,
  loginUserSchema,
  updateProfileSchema,
} = require("../middleware/validation/schema/userSchema");
const { route } = require("./menuRouter");

router.post("/register", validate(createUserSchema), createUser);
router.post("/login", validate(loginUserSchema), loginUser);
router.get("/profile", authenticateToken, lihatProfile);
router.put(
  "/profile/:id",
  validate(updateProfileSchema),
  authenticateToken,
  permit("user", "premium"),
  updateProfile
);
router.post("/donor-darah-rs", authenticateToken, permit("user", "premium"), donorDarahRS);
router.post(
  "/donor-darah-pmi",
  authenticateToken,
  permit("user", "premium"),
  donorDarahPMI
);
router.get("/event", lihatEvent);
router.get("/event/:id", specificEvent);
router.get("/request-darah", lihatRequestDarah);
router.get("/request-darah/:id", specificRequestDarah);

module.exports = router;
