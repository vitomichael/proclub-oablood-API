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

const selesaiDonorPMI = async (req, res, next) => {
  try {
    let donor = await db.donorDarahPMI.findOne({ where: { id: req.params.id } });
  
    if (!donor) return res.rest.notFound("ID tidak ditemukan");

    let event = await db.eventPMI.findOne({ where: { id: donor.id_event } });

    if (!event) return res.rest.notFound("Event tidak ditemukan")
  
    if (event.jadwal > new Date()) return res.rest.notAcceptable("Event belum dilaksanakan!");
    if (donor.status == false) return res.rest.notAcceptable("Donor belum di verifikasi!"); 
  
    let userDonor = await db.user.findOne({ where: { id: donor.id_user }});
    
    if (!userDonor) return res.rest.notFound("ID tidak ditemukan");

    await donor.update({
      selesai: true,
    });

    await userDonor.update({
      riwayat_donor: new Date(),
      point: userDonor.point + 100,
    });

    return res.rest.success("User telah selesai melakukan donor");
  } catch (error) {
    next(error);
  };

};

module.exports = {
  loginPMI,
  buatEvent,
  verifikasiPendonorPMI,
  lihatPendonorPMI,
  deleteEvent,
  findOneByEmailPMI,
  selesaiDonorPMI,
};
