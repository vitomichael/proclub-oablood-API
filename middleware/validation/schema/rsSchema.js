const { body } = require("express-validator");
const { findOneByEmail } = require("../../../controllers/rsController");

const loginRSSchema = [
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

const reqDarahSchema = [
  body("golongan_darah")
    .notEmpty()
    .withMessage("golongan darah tidak boleh kosong"),
  body("rhesus").notEmpty().withMessage("rhesus tidak boleh kosong"),
  body("tanggal").notEmpty().withMessage("tanggal tidak boleh kosong"),
  body("keterangan").notEmpty().withMessage("keterangan tidak boleh kosong"),
];

module.exports = {
  loginRSSchema,
  reqDarahSchema,
};
