const db = require('../models');
const md5 = require('md5');
const jwt = require('jsonwebtoken');

const genToken = (id) => {
  return jwt.sign({ id : id }, process.env.TOKEN_SECRET);
};

const buatAkunRS = (req, res, next) => {
  try {
    req.body.password = req.body.password
      ? md5(req.body.password)
      : req.body.password;

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

const buatAkunPMI = (req, res, next) => {
  try {
    req.body.password = req.body.password
      ? md5(req.body.password)
      : req.body.password;

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
          token: genToken(result.id),
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

module.exports = {
  buatAkunRS,
  buatAkunPMI,
  login,
  membuatArtikel,
  lihatRequestDarah,
  specificRequestDarah,
  lihatEvent,
  specificEvent,
}