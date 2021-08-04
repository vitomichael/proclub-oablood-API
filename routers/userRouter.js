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
  lihatReward,
  specificReward,
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
  permit("user"),
  updateProfile
);
router.post("/donor-darah-rs", authenticateToken, permit("user"), donorDarahRS);
router.post(
  "/donor-darah-pmi",
  authenticateToken,
  permit("user"),
  donorDarahPMI
);
router.get("/event", authenticateToken, lihatEvent);
router.get("/event/:id", authenticateToken, specificEvent);
router.get("/request-darah", authenticateToken, lihatRequestDarah);
router.get("/request-darah/:id", authenticateToken, specificRequestDarah);
router.get("/reward", authenticateToken, lihatReward);
router.get("/reward/:id", authenticateToken, specificReward);

module.exports = router;
