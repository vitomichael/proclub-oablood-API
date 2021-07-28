const { body } = require("express-validator");
const { findOneByEmail } = require("../../../controllers/pmiController");

const loginPMISchema = [
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

const buatEventSchema = [
  body("lokasi").notEmpty().withMessage("lokasi tidak boleh kosong"),
  body("jadwal").notEmpty().withMessage("jadwal tidak boleh kosong"),
];

module.exports = {
  loginPMISchema,
  buatEventSchema,
};
