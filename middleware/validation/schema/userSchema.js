const { body } = require("express-validator");
const { findOneByEmail } = require("../../../controllers/userController");

const createUserSchema = [
  body("name").notEmpty().withMessage("nama tidak boleh kosong"),
  body("jenis_kelamin")
    .notEmpty()
    .withMessage("Jenis kelamin tidak boleh kosong"),
  body("tempat_lahir")
    .notEmpty()
    .withMessage("tempat lahir tidak boleh kosong"),
  body("tanggal_lahir")
    .notEmpty()
    .withMessage("tanggal lahir tidak boleh kosong"),
  body("golongan_darah")
    .notEmpty()
    .withMessage("golongan darah tidak boleh kosong"),
  body("rhesus").notEmpty().withMessage("rhesus tidak boleh kosong"),
  body("alamat").notEmpty().withMessage("alamat tidak boleh kosong"),
  body("no_telp").notEmpty().withMessage("nomor telepon tidak boleh kosong"),
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
  body("name").notEmpty().withMessage("nama tidak boleh kosong"),
  body("jenis_kelamin")
    .notEmpty()
    .withMessage("Jenis kelamin tidak boleh kosong"),
  body("tempat_lahir")
    .notEmpty()
    .withMessage("tempat lahir tidak boleh kosong"),
  body("tanggal_lahir")
    .notEmpty()
    .withMessage("tanggal lahir tidak boleh kosong"),
  body("golongan_darah")
    .notEmpty()
    .withMessage("golongan darah tidak boleh kosong"),
  body("rhesus").notEmpty().withMessage("rhesus tidak boleh kosong"),
  body("alamat").notEmpty().withMessage("alamat tidak boleh kosong"),
  body("no_telp").notEmpty().withMessage("nomor telepon tidak boleh kosong"),
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

module.exports = {
  createUserSchema,
  loginUserSchema,
  updateProfileSchema,
};
