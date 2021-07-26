const db = require('../models');
const md5 = require('md5');
const jwt = require('jsonwebtoken');

const genToken = (id, role) => {
  return jwt.sign({ id : id, role: role }, process.env.TOKEN_SECRET);
};

const buatAkunRS = async (req, res, next) => {
  try {
    let rs = await db.rumahsakit.findOne({ where: { email: req.body.email } });

    if (rs) return res.status(409).json({
      message: "Email already exist!",
    });

    req.body.password = req.body.password
      ? md5(req.body.password)
      : req.body.password;
    req.body.role = "rs";

    db.rumahsakit
      .create(req.body)
      .then((result) => {
        res.rest.created("Akun telah dibuat!");
    })
      .catch((err) => {
        res.rest.badRequest(err);
    });
  } catch (error) {
    next(error);
  };
};

const buatAkunPMI = async (req, res, next) => {
  try {
    let pmi = await db.PMI.findOne({ where: { email: req.body.email } });

    if (pmi) return res.status(409).json({
      message: "Email already exist!",
    });

    req.body.password = req.body.password
      ? md5(req.body.password)
      : req.body.password;
    req.body.role = "PMI";

    db.PMI
      .create(req.body)
      .then((result) => {
        res.rest.created("Akun telah dibuat!");
    })
      .catch((err) => {
        res.rest.badRequest(err);
    });
  } catch (error) {
    next(error);
  };
};

const login = (req, res, next) => {
  db.admin
    .findOne({
      where : {
        email : req.body.email, 
        password: md5(req.body.password)
      }
      })
    .then((result) => {
      if (result) {
        res.rest.success({
          token: genToken(result.id, result.role),
        })
      } else {
        res.rest.unauthorized("Email atau password Anda salah!");
      };
    })
    .catch((error) => {
      next(error);
    });
};

const membuatArtikel = (req, res) => {
  const postArtikel = {
    id_admin: req.user.id,
    judul: req.body.judul,
    link: req.body.link,
    thumbnail: req.body.thumbnail,
  };

  db.artikel
    .create(postArtikel).then((result) => {
      res.rest.created("Artikel berhasil dibuat!");
  })
    .catch((error) => {
      res.rest.badRequest(err);
  });
};

module.exports = {
  buatAkunRS,
  buatAkunPMI,
  login,
  membuatArtikel,
};