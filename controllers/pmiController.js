const db = require("../models");
const md5 = require("md5");
const jwt = require("jsonwebtoken");

const genToken = (id, role) => {
  return jwt.sign({ id: id, role: role }, process.env.TOKEN_SECRET);
};

const loginPMI = (req, res, next) => {
  db.PMI.findOne({
    where: {
      email: req.body.email,
      password: md5(req.body.password),
    },
  })
    .then((result) => {
      if (result) {
        res.rest.success({
          token: genToken(result.id, result.role),
        });
      } else {
        res.rest.unauthorized("Email atau password Anda salah!");
      }
    })
    .catch((error) => {
      next(error);
    });
};

const buatEvent = (req, res, next) => {
  try {
    const postEvent = {
      id_pmi: req.user.id,
      lokasi: req.body.lokasi,
      jadwal: req.body.jadwal,
      status: req.body.status,
    };

    db.eventPMI
      .create(postEvent)
      .then((result) => {
        res.rest.created("Event berhasil dibuat!");
      })
      .catch((err) => {
        res.rest.badRequest(err);
      });
  } catch (error) {
    next(error);
  }
};

const verifikasiPendonorPMI = async (req, res, next) => {
  try {
    let donor = await db.donorDarahPMI.findOne({
      where: { id: req.params.id },
    });

    if (!donor) return res.rest.notFound("ID tidak ditemukan");

    const verifStatus = {
      status: true,
    }

    donor
      .update(verifStatus)
      .then((result) => {
        res.rest.success("Pendonor telah diverifikasi");
      })
      .catch((err) => {
        res.rest.badRequest(err);
      });
  } catch (error) {
    next(error);
  }
};

const lihatPendonorPMI = (req, res, next) => {
  db.donorDarahPMI
    .findAll()
    .then((result) => {
      res.rest.success(result);
    })
    .catch((err) => {
      next(err);
    });
};

const deleteEvent = (req, res) => {
  const id = req.params.id;
  const id_pmi = req.user.id;

  db.eventPMI
    .destroy({
      where: {
        id: id,
        id_pmi: id_pmi,
      },
    })
    .then((result) => {
      if (result) {
        res.rest.success("Event berhasil dihapus!");
      } else {
        res.rest.notFound("Event tidak ditemukan!");
      }
    })
    .catch((error) => {
      res.rest.badRequest(error);
    });
};

const findOneByEmailPMI = async (email) => {
  return await db.PMI.findOne({ where: { email: email } });
};

module.exports = {
  loginPMI,
  buatEvent,
  verifikasiPendonorPMI,
  lihatPendonorPMI,
  deleteEvent,
  findOneByEmailPMI,
};
