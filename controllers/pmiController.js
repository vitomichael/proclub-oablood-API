const db = require("../models");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const { unlinkAsync } = require("../helpers/deleteFile");

const genToken = async (id, role) => {
  const token = jwt.sign({ id, role }, process.env.TOKEN_SECRET);
  await db.Token.create({ token });
  return token;
};

const loginPMI = (req, res, next) => {
  db.PMI.findOne({
    where: {
      email: req.body.email,
      password: md5(req.body.password),
    },
  })
    .then(async (result) => {
      if (result) {
        res.rest.success({
          token: await genToken(result.id, result.role),
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
    req.body.image = req.files ? req.files.image[0].filename : "";
    const postEvent = {
      id_pmi: req.user.id,
      lokasi: req.body.lokasi,
      jadwal: req.body.jadwal,
      start: req.body.start,
      end: req.body.end,
      image: req.body.image,
      linkGmaps: req.body.linkGmaps,
    };

    if (
      req.body.lokasi === "" ||
      req.body.jadwal === "" ||
      req.body.start === "" ||
      req.body.end === "" ||
      req.body.image === "" ||
      req.body.linkGmaps === ""
    ) {
      unlinkAsync(req.files.image[0].path);
      return res.rest.badRequest("Lengkapi data terlebih dahulu");
    }

    db.eventPMI
      .create(postEvent)
      .then((result) => {
        res.rest.created("Event berhasil dibuat!");
      })
      .catch(async (err) => {
        if (req.image != "") await unlinkAsync(req.files.image[0].path);
        res.rest.badRequest(err);
      });
  } catch (error) {
    next(error);
  }
};

const lihatPendonorPMI = (req, res, next) => {
  db.donorDarahPMI
    .findAll({ where: { id_pmi: req.user.id } })
    .then((result) => {
      res.rest.success(result);
    })
    .catch((err) => {
      next(err);
    });
};

const spesificPendonorPMI = (req, res, next) => {
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

const deleteEvent = async (req, res) => {
  try {
    let event = await db.eventPMI.findOne({
      where: { id: req.params.id, id_rs: req.user.id },
    });

    if (!event) return res.rest.notFound("Event tidak ditemukan");

    if (event.image != null) {
      await unlinkAsync(`uploads/${event.image}`);
    }

    event
      .destroy()
      .then((result) => {
        res.rest.success("Event berhasil dibatalkan!");
      })
      .catch((err) => {
        res.rest.badRequest(err);
      });
  } catch (error) {
    next(error);
  }
};

const findOneByEmailPMI = async (email) => {
  return await db.PMI.findOne({ where: { email: email } });
};

const selesaiDonorPMI = async (req, res, next) => {
  try {
    let donor = await db.donorDarahPMI.findOne({
      where: { id: req.params.id },
    });

    if (!donor) return res.rest.notFound("ID tidak ditemukan");

    let event = await db.eventPMI.findOne({ where: { id: donor.id_event } });

    if (!event) return res.rest.notFound("Event tidak ditemukan");

    if (event.jadwal > new Date())
      return res.rest.notAcceptable("Event belum dilaksanakan!");

    let userDonor = await db.user.findOne({ where: { id: donor.id_user } });

    if (!userDonor) return res.rest.notFound("ID tidak ditemukan");

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

const batalDonorPMI = async (req, res, next) => {
  try {
    let donor = await db.donorDarahPMI.findOne({
      where: { id: req.params.id, id_pmi: req.user.id },
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

module.exports = {
  loginPMI,
  buatEvent,
  lihatPendonorPMI,
  deleteEvent,
  findOneByEmailPMI,
  selesaiDonorPMI,
  spesificPendonorPMI,
  batalDonorPMI,
};
