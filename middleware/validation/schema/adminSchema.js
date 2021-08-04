const { body } = require("express-validator");
const { findOneByEmailRS } = require("../../../controllers/rsController");
const { findOneByEmailPMI } = require("../../../controllers/pmiController");
const { findOneByEmailAdmin } = require("../../../controllers/adminController");

const loginSchema = [
  body("email")
    .isEmail()
    .withMessage("Masukkan email yang valid")
    .notEmpty()
    .withMessage("email tidak boleh kosong")
    .custom(async (value) => {
      return findOneByEmailAdmin(value).then((user) => {
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

const buatAkunRSSchema = [
  body("name").notEmpty().withMessage("nama rumah sakit tidak boleh kosong"),
  body("alamat")
    .notEmpty()
    .withMessage("alamat rumah sakit tidak boleh kosong"),
  body("no_telp")
    .notEmpty()
    .withMessage("nomor telepon rumah sakit tidak boleh kosong"),
  body("email")
    .isEmail()
    .withMessage("Masukkan email yang valid")
    .notEmpty()
    .withMessage("email tidak boleh kosong")
    .custom(async (value) => {
      return findOneByEmailRS(value).then((user) => {
        if (user) {
          return Promise.reject("email telah terdaftar");
        }
      });
    }),
  body("password")
    .notEmpty()
    .withMessage("password tidak boleh kosong")
    .isLength({ min: 8 })
    .withMessage("Password minimal 8 karakter"),
];

const buatAkunPMISchema = [
  body("name").notEmpty().withMessage("nama PMI tidak boleh kosong"),
  body("alamat").notEmpty().withMessage("alamat PMI tidak boleh kosong"),
  body("no_telp")
    .notEmpty()
    .withMessage("nomor telepon PMI tidak boleh kosong"),
  body("email")
    .isEmail()
    .withMessage("Masukkan email yang valid")
    .notEmpty()
    .withMessage("email tidak boleh kosong")
    .custom(async (value) => {
      return findOneByEmailPMI(value).then((user) => {
        if (user) {
          return Promise.reject("email telah terdaftar");
        }
      });
    }),
  body("password")
    .notEmpty()
    .withMessage("password tidak boleh kosong")
    .isLength({ min: 8 })
    .withMessage("Password minimal 8 karakter"),
];

const membuatArtikelSchema = [
  body("judul").notEmpty().withMessage("judul artikel tidak boleh kosong"),
  body("link").notEmpty().withMessage("Masukkan link artikel"),
  body("thumbnail").notEmpty().withMessage("Masukkan thumbnail"),
];

const membuatRewardSchema = [
  body("name").notEmpty().withMessage("nama reward tidak boleh kosong"),
  body("jumlah").notEmpty().withMessage("jumlah tidak boleh kosong"),
  body("point").notEmpty().withMessage("point tidak boleh kosong"),
];

module.exports = {
  loginSchema,
  buatAkunRSSchema,
  buatAkunPMISchema,
  membuatArtikelSchema,
  membuatRewardSchema,
};
