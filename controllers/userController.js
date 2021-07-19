const db = require("../models");
const md5 = require("md5");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id: id }, process.env.TOKEN_SECRET);
};

const createUser = (req, res, next) => {
  try {
    req.body.password = req.body.password
      ? md5(req.body.password)
      : req.body.password;

    db.user
      .create(req.body)
      .then((result) => {
        res.rest.success("Anda telah berhasil Mendaftar");
      })
      .catch((err) => {
        res.rest.badRequest(err);
      });
  } catch (error) {
    next(error);
  }
};

const loginUser = (req, res, next) => {
  let { email, password } = req.body;
  console.log(email, md5(password));
  db.user
    .findOne({
      where: {
        email: email,
        password: md5(password),
      },
    })
    .then((result) => {
      if (result) {
        res.rest.success({
          token: generateToken(result.id),
        });
      } else {
        res.rest.badRequest("email / password salah");
      }
    })
    .catch((error) => {
      next(error);
    });
};

const lihatProfile = async (req, res, next) => {
  try {
    const dataProfile = await db.user.findOne({ where: { id: req.params.id } });

    if (!dataProfile)
      return res.rest.badRequest(
        `Profile dengan ID ${req.params.id} tidak ditemukan`
      );

    res.rest.success({ profile: dataProfile });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    let profile = await db.user.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!profile) return res.rest.badRequest("Id not found");

    profile
      .update(req.body)
      .then((result) => {
        if (result) {
          return res.rest.success("Profile telah terupdate");
        }
        return res.rest.badRequest("Profile gagal diupdate");
      })
      .catch((err) => {
        res.rest.badRequest(err);
      });
  } catch (error) {
    next(error);
  }
};

const lihatEvent = (req, res, next) => {
  db.eventPMI
    .findAll()
    .then((result) => {
      res.rest.success(result);
    })
    .catch((error) => {
      next(error);
    });
};

const specificEvent = async (req, res, next) => {
  try {
    const dataEvent = await db.eventPMI.findOne({
      where: { id: req.params.id },
    });

    if (!dataEvent)
      return res.rest.badRequest(
        `Event dengan ID ${req.params.id} tidak ditemukan`
      );

    res.rest.success({ event: dataEvent });
  } catch (error) {
    next(error);
  }
};

const lihatRequestDarah = (req, res, next) => {
  db.requestdarah
    .findAll()
    .then((result) => {
      res.rest.success(result);
    })
    .catch((error) => {
      next(error);
    });
};

const specificRequestDarah = async (req, res, next) => {
  try {
    const dataRequest = await db.requestdarah.findOne({
      where: { id: req.params.id },
    });

    if (!dataRequest)
      return res.rest.badRequest(
        `Request Darah dengan ID ${req.params.id} tidak ditemukan`
      );

    res.rest.success({ request: dataRequest });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  loginUser,
  updateProfile,
  lihatProfile,
  lihatEvent,
  specificEvent,
  lihatRequestDarah,
  specificRequestDarah,
};
