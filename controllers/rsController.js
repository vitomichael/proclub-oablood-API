const db = require("../models");
const md5 = require("md5");
const jwt = require("jsonwebtoken");

const genToken = (id, role) => {
  return jwt.sign({ id: id, role: role }, process.env.TOKEN_SECRET);
};

const loginRS = (req, res, next) => {
  db.rumahsakit
    .findOne({
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

const spesificPendonorRS = (req, res, next) => {
  try {
    db.donorDarahRS
      .findOne({where : { id : req.params.id } })
      .then((result) => {
        res.rest.success(result);
      })
      .catch((error) => {
        res.rest.badRequest("Pendonor tidak ditemukan");
      });
  } catch (error) {
    next(error);
  }
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
    };

    db.requestdarah
      .create(postReqDarah)
      .then((result) => {
        res.rest.created("Request berhasil dibuat!");
      })
      .catch((err) => {
        res.rest.badRequest(err);
      });
  } catch (error) {
    next(error);
  }
};

const verifikasiPendonorRS = async (req, res, next) => {
  try {
    let donor = await db.donorDarahRS.findOne({ where: { id: req.params.id } });

    if (!donor) return res.rest.notFound("ID tidak ditemukan");

    const verifStatus = {
      status: true,
    };

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

const kelolaJadwal = async (req, res, next) => {
  try {
    let donor = await db.donorDarahRS.findOne({ where: { id: req.params.id } });

    if (!donor) return res.rest.notFound("ID tidak ditemukan");

    let userDonor = await db.user.findOne({ where: { id: donor.id_user }});

    if (!userDonor) return res.rest.notFound("User tidak ditemukan");

    if (userDonor.role === "premium") return res.rest.notAcceptable("Donor dilakukan oleh user Premium")

    const jadwal = {
      jadwal_donor: req.body.jadwal_donor,
    };

    donor
      .update(jadwal)
      .then((result) => {
        res.rest.success("Jadwal telah ditambahkan!");
      })
      .catch((err) => {
        res.rest.badRequest(err);
      });
  } catch (error) {
    next(error);
  };
};

const findOneByEmailRS = async (email) => {
  return await db.rumahsakit.findOne({ where: { email: email } });
};

const selesaiDonorRS = async (req, res, next) => {
  try {
    let donor = await db.donorDarahRS.findOne({ where: { id: req.params.id }});
  
    if (!donor) return res.rest.notFound("ID tidak ditemukan");
  
    if (donor.status == false) return res.rest.notAcceptable("Donor belum di verifikasi!"); 
    if (donor.jadwal_donor > new Date()) return res.rest.notAcceptable("Donor belum dilaksanakan!");
  
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
  loginRS,
  lihatPendonorRS,
  reqDarah,
  verifikasiPendonorRS,
  kelolaJadwal,
  findOneByEmailRS,
  selesaiDonorRS,
  spesificPendonorRS,
};
