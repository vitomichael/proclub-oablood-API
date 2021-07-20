const db = require("../models");
const md5 = require("md5");
const jwt = require("jsonwebtoken");

const genToken = (id, role) => {
  return jwt.sign({ id : id,  role: role  }, process.env.TOKEN_SECRET);
};

const loginRS = (req, res, next) => {
  db.rumahsakit
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

const lihatPendonorRS = (req, res, next) => {
  db.donorDarahRS
    .findAll()
    .then((result) => {
      res.rest.success(result);
    })
    .catch((error) => {
      next(error);
    });
};

const reqDarah = (req, res, next) => {
  try {
    const postReqDarah = {
      id_rs: req.user.id,
      golongan_darah: req.body.golongan_darah,
      rhesus: req.body.rhesus,
      tanggal: req.body.tanggal,
      keterangan: req.body.keterangan,
      status: req.body.status,
    }

    db.requestdarah
      .create(postReqDarah)
      .then((result) => {
          res.rest.created("Request berhasil dibuat!");
      })
      .catch((err) => {
          res.rest.badRequest(err);
      })
  } catch (error) {
     next(error);
  };
};

const verifikasiPendonor = async (req, res, next) => {
  try {
    let donor = await db.donorDarahRS.findOne({ where : { id: req.params.id } });
    
    if (!donor) return res.rest.notFound("ID tidak ditemukan");

    donor
      .update(req.body)
      .then((result) => {
          res.rest.success("Pendonor telah diverifikasi");
      })
      .catch((err) =>  {
          res.rest.badRequest(err)
      })
  } catch (error) {
     next(error);
  }
};

module.exports ={
  loginRS,
  lihatPendonorRS,
  reqDarah,
  verifikasiPendonor,
}