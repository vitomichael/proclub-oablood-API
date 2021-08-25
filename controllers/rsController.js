const db = require("../models");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const user = require("../models/user");
const { unlinkAsync } = require("../helpers/deleteFile");

const genToken = async (id, role) => {
  const token = jwt.sign({ id, role }, process.env.TOKEN_SECRET);
  await db.Token.create({ token });
  return token;
};

const loginRS = (req, res, next) => {
  db.rumahsakit
    .findOne({
      where: {
        email: req.body.email,
        password: md5(req.body.password),
      },
    })
    .then(async (result) => {
      if (result) {
        res.rest.success({
          token: await genToken(result.id, result.role),
          id_user: result.id,
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
    .findAll({ where: { id: req.user.id } })
    .then((result) => {
      res.rest.success(result);
    })
    .catch((error) => {
      next(error);
    });
};

const spesificPendonorRS = (req, res, next) => {
  try {
    db.user
      .findOne({ where: { id: req.params.id } })
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
    req.body.image = req.files ? req.files.image[0].filename : "";
    const postReqDarah = {
      id_rs: req.user.id,
      golongan_darah: req.body.golongan_darah,
      rhesus: req.body.rhesus,
      keterangan: req.body.keterangan,
      kebutuhan: req.body.kebutuhan,
      image: req.body.image,
      linkGmaps: req.body.linkGmaps,
    };

    if (
      req.body.golongan_darah === "" ||
      req.body.rhesus === "" ||
      req.body.kebutuhan === "" ||
      req.body.linkGmaps === ""
    ) {
      if (req.body.image !== "") {
        unlinkAsync(req.files.image[0].path);
      }
      return res.rest.badRequest("Lengkapi data terlebih dahulu");
    }

    db.requestdarah
      .create(postReqDarah)
      .then((result) => {
        res.rest.created("Request berhasil dibuat!");
      })
      .catch(async (err) => {
        if (req.image != "") await unlinkAsync(req.files.image[0].path);
        res.rest.badRequest(err);
      });
  } catch (error) {
    next(error);
  }
};

const findOneByEmailRS = async (email) => {
  return await db.rumahsakit.findOne({ where: { email: email } });
};

const selesaiDonorRS = async (req, res, next) => {
  try {
    let donor = await db.donorDarahRS.findOne({ where: { id: req.params.id } });

    if (!donor) return res.rest.notFound("ID tidak ditemukan");

    if (donor.jadwal_donor > new Date())
      return res.rest.notAcceptable("Donor belum dilaksanakan!");

    let userDonor = await db.user.findOne({ where: { id: donor.id_user } });

    if (!userDonor) return res.rest.notFound("ID tidak ditemukan");

    let reqdarah = await db.requestdarah.findOne({
      where: { id: donor.id_rs },
    });
    if (!reqdarah) return res.rest.notFound("Request tidak ditemukan");

    await reqdarah.update({
      terpenuhi: reqdarah.terpenuhi + 1,
    });

    await donor.update({
      selesai: true,
    });

    if (userDonor.role === "premium") {
      await userDonor.update({
        point: userDonor.point + 10,
      });
    }

    var date = new Date();
    await userDonor.update({
      riwayat_donor: new Date(),
      point: userDonor.point + 10,
      totalDonor: userDonor.totalDonor + 1,
      donor_kembali: new Date(date.setMonth(date.getMonth() + 3)),
    });

    return res.rest.success("User telah selesai melakukan donor");
  } catch (error) {
    next(error);
  }
};

const batalDonorRS = async (req, res, next) => {
  try {
    let donor = await db.donorDarahRS.findOne({
      where: { id: req.params.id, id_rs: req.user.id },
    });

    if (!donor) return res.rest.notFound("Donor tidak ditemukan");

    donor
      .destroy()
      .then((result) => {
        res.rest.success("Pendonor berhasil dibatalkan!");
      })
      .catch((err) => {
        res.rest.badRequest(err);
      });
  } catch (error) {
    next(error);
  }
};

const deleteReqDarah = async (req, res, next) => {
  try {
    let reqdarah = await db.requestdarah.findOne({
      where: { id: req.params.id, id_rs: req.user.id },
    });

    if (!reqdarah) return res.rest.notFound("Request tidak ditemukan");

    if (reqdarah.image != null) {
      await unlinkAsync(`uploads/${reqdarah.image}`);
    }

    reqdarah
      .destroy()
      .then((result) => {
        res.rest.success("Request berhasil dihapus!");
      })
      .catch((err) => {
        res.rest.badRequest(err);
      });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginRS,
  lihatPendonorRS,
  reqDarah,
  findOneByEmailRS,
  selesaiDonorRS,
  spesificPendonorRS,
  batalDonorRS,
  deleteReqDarah,
};
