const { body } = require("express-validator");
const { findOneByEmail } = require("../../../controllers/userController");

const createUserSchema = [
  body("name").notEmpty().withMessage("nama tidak boleh kosong"),
  body("email")
    .isEmail()
    .withMessage("Masukkan email yang valid")
    .notEmpty()
    .withMessage("email tidak boleh kosong")
    .custom(async (value) => {
      return findOneByEmail(value).then((user) => {
        if (user) {
          return Promise.reject("email sudah digunakan");
        }
      });
    }),
  body("password")
    .notEmpty()
    .withMessage("password tidak boleh kosong")
    .isLength({ min: 8 })
    .withMessage("Password minimal 8 karakter"),
];

const loginUserSchema = [
  body("email")
    .isEmail()
    .withMessage("Masukkan email yang valid")
    .notEmpty()
    .withMessage("email tidak boleh kosong")
    .custom(async (value) => {
      return findOneByEmail(value).then((user) => {
        if (!user) {
          return Promise.reject("email tidak terdaftar");
        }
      });
    }),
  body("password")
    .notEmpty()
    .withMessage("password tidak boleh kosong")
    .isLength({ min: 8 })
    .withMessage("Password minimal 8 karakter"),
];

const updateProfileSchema = [
  body("name").notEmpty().withMessage("nama tidak boleh kosong").optional(),
  body("jenis_kelamin").optional(),
  body("tempat_lahir").optional(),
  body("tanggal_lahir").optional(),
  body("golongan_darah").optional(),
  body("rhesus").optional(),
  body("alamat").optional(),
  body("no_telp").optional(),
  body("email")
    .isEmail()
    .withMessage("Masukkan email yang valid")
    .notEmpty()
    .withMessage("email tidak boleh kosong")
    .custom(async (value) => {
      return findOneByEmail(value).then((user) => {
        if (user) {
          return Promise.reject("email sudah digunakan");
        }
      });
    })
    .optional(),
  body("password")
    .notEmpty()
    .withMessage("password tidak boleh kosong")
    .isLength({ min: 8 })
    .withMessage("Password minimal 8 karakter")
    .optional(),
];

const forgotPasswordSchema = [
  body("password")
    .notEmpty()
    .withMessage("password tidak boleh kosong")
    .isLength({ min: 8 })
    .withMessage("Password minimal 8 karakter"),
];

const membuatKomplainSchema = [
  body("name").notEmpty().withMessage("Nama tidak boleh kosong"),
  body("email").notEmpty().withMessage("email tidak boleh kosong"),
  body("pesan").notEmpty().withMessage("pesan tidak boleh kosong"),
];

module.exports = {
  createUserSchema,
  loginUserSchema,
  updateProfileSchema,
  forgotPasswordSchema,
  membuatKomplainSchema,
};
