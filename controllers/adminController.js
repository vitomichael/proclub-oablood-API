const db = require('../models');
const md5 = require('md5');
const jwt = require('jsonwebtoken');

const genToken = (id) => {
  return jwt.sign({ id : id }, process.env.TOKEN_SECRET);
}

function buatAkunRS(req, res, next) {
  try {
    req.body.password = req.body.password
      ? md5(req.body.password)
      : req.body.password;

    db.rumahsakit
      .create(req.body)
      .then(result => {
        res.rest.created("Akun telah dibuat!");
    })
      .catch(err => {
        res.rest.badRequest(err);
    });
  } catch (error) {
    next(error)
  }
}

function buatAkunPMI(req, res, next) {
  try {
    req.body.password = req.body.password
      ? md5(req.body.password)
      : req.body.password;

    db.PMI
      .create(req.body)
      .then(result => {
        res.rest.created("Akun telah dibuat!");
    })
      .catch(err => {
        res.rest.badRequest(err);
    });
  } catch (error) {
    next(error)
  }
}

function login(req, res, next) {
  db.admin
    .findOne({
      where : {
        email : req.body.email, 
        password: md5(req.body.password)
      }
      })
    .then(result => {
      if (result) {
        res.rest.success({
          token: genToken(result.id),
        })
      } else {
        res.rest.unauthorized("Email atau password Anda salah!");
      }
      })
    .catch(error => {
      next(error);
    });
}

function membuatArtikel(req, res) {
  const postArtikel = {
    id_admin: req.user.id,
    judul: req.body.judul,
    link: req.body.link,
    thumbnail: req.body.thumbnail,
  }

  db.artikel
    .create(postArtikel).then(result => {
      res.rest.created("Artikel berhasil dibuat!");
  })
    .catch(error => {
      res.rest.badRequest(err);
  });
}

module.exports = {
  buatAkunRS,
  buatAkunPMI,
  login,
  membuatArtikel,
}