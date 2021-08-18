const db = require("../models");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const { unlinkAsync } = require("../helpers/deleteFile");

const generateToken = async (id, role) => {
  const token = jwt.sign({ id, role }, process.env.TOKEN_SECRET);
  await db.Token.create({ token });
  return token;
};

const createUser = async (req, res, next) => {
  try {
    let users = await db.user.findOne({ where: { email: req.body.email } });

    if (users)
      return res.status(409).json({
        message: "Email already exist!",
      });

    req.body.password = req.body.password
      ? md5(req.body.password)
      : req.body.password;

    req.body.role = "user";

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

const uploadPicture = async (req, res, next) => {
  try {
    let user = await db.user.findOne({ where: { id: req.user.id } });

    if (!user) return res.rest.notFound("User tidak ditemukan!");

    req.body.image = req.files ? req.files.image[0].filename : "";

    user
      .update(req.body)
      .then((result) => {
        res.rest.success("Profile Picture telah diupload!");
      })
      .catch(async (err) => {
        if (req.image != "") await unlinkAsync(req.files.image[0].path);
        res.rest.badRequest(err);
      });
  } catch (error) {
    next(error);
  }
};

const loginUser = (req, res, next) => {
  let { email, password } = req.body;
  db.user
    .findOne({
      where: {
        email: email,
        password: md5(password),
      },
    })
    .then(async (result) => {
      if (result) {
        res.rest.success({
          token: await generateToken(result.id, result.role),
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
    const dataProfile = await db.user.findOne({ where: { id: req.user.id } });

    if (!dataProfile)
      return res.rest.unauthorized(
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

const lihatArtikel = (req, res, next) => {
  db.artikel
    .findAll()
    .then((result) => {
      res.rest.success(result);
    })
    .catch((error) => {
      next(error);
    });
};

const specificArtikel = async (req, res, next) => {
  try {
    const dataRequest = await db.artikel.findOne({
      where: { id: req.params.id },
    });

    if (!dataRequest)
      return res.rest.badRequest(
        `Artikel dengan ID ${req.params.id} tidak ditemukan`
      );

    res.rest.success({ request: dataRequest });
  } catch (error) {
    next(error);
  }
};

const donorDarahRS = async (req, res, next) => {
  try {
    const id_user = req.user.id;
    const role_user = req.user.role;

    let { id_rs, id_request } = req.body;
    let donor = await db.requestdarah.findOne({ where: { id: id_request } });

    if (!donor) return res.rest.badRequest("Donor Darah tidak ditemukan");

    let donorDarah = await db.donorDarahRS.findAll({
      limit: 1,
      order: [["id", "DESC"]],
    });

    const checkUser = await db.donorDarahRS.findOne({
      where: { id_user, id_request },
    });

    if (checkUser) return res.rest.badRequest("Reservasi gagal");

    let user = await db.user.findOne({ where: { id: id_user } });

    if (
      !user.jenis_kelamin ||
      !user.tempat_lahir ||
      !user.tanggal_lahir ||
      !user.golongan_darah ||
      !user.rhesus ||
      !user.alamat ||
      !user.no_telp
    )
      return res.rest.badRequest("Mohon lengkapi profil anda terlebih dahulu.");
      
    if (new Date() < user.donor_kembali) 
      return res.rest.notAcceptable("Belum waktunya untuk donor kembali!");

    if (user.golongan_darah !== donor.golongan_darah || user.rhesus !== donor.rhesus) {
      return res.rest.notAcceptable("Golongan Darah atau Rhesus tidak sesuai dengan request!");
    }

    const dataDonor = (role_user, dataDonor) => {
      if (role_user === "premium") {
        return (dataDonor = {
          id_user,
          id_rs,
          id_request,
          jadwal_donor: req.body.jadwal_donor,
          no_antrian: 0,
        });
      }

      if (role_user === "user") {
        return (dataDonor = {
          id_user,
          id_rs,
          id_request,
          jadwal_donor: req.body.jadwal_donor,
          no_antrian: !donorDarah.length ? 1 : donorDarah[0].id + 1,
        });
      }
    };

    await db.donorDarahRS.create(dataDonor(role_user));

    return res.rest.success("Reservasi berhasil");
  } catch (error) {
    next(error);
  }
};

const donorDarahPMI = async (req, res, next) => {
  try {
    const id_user = req.user.id;
    const role_user = req.user.role;

    let { id_pmi, id_event } = req.body;
    let donor = await db.eventPMI.findOne({ where: { id: id_event } });

    if (!donor) return res.rest.badRequest("Event tidak ditemukan");

    let donorDarah = await db.donorDarahPMI.findAll({
      limit: 1,
      order: [["id", "DESC"]],
    });

    const checkUser = await db.donorDarahPMI.findOne({
      where: { id_user, id_event },
    });

    if (checkUser) return res.rest.badRequest("Reservasi gagal");

    let user = await db.user.findOne({ where: { id: id_user } });

    if (
      !user.jenis_kelamin ||
      !user.tempat_lahir ||
      !user.tanggal_lahir ||
      !user.golongan_darah ||
      !user.rhesus ||
      !user.alamat ||
      !user.no_telp
    )
      return res.rest.badRequest("Mohon lengkapi profil anda terlebih dahulu.");

    if (new Date() < user.donor_kembali) 
      return res.rest.notAcceptable("Belum waktunya untuk donor kembali!");

    const dataDonor = (role_user, dataDonor) => {
      if (role_user === "premium") {
        return (dataDonor = {
          id_user,
          id_pmi,
          id_event,
          no_antrian: 0,
        });
      }

      if (role_user === "user") {
        return (dataDonor = {
          id_user,
          id_pmi,
          id_event,
          no_antrian: !donorDarah.length ? 1 : donorDarah[0].id + 1,
        });
      }
    };

    await db.donorDarahPMI.create(dataDonor(role_user));

    return res.rest.success("Reservasi berhasil");
  } catch (error) {
    next(error);
  }
};

const findOneByEmail = async (email) => {
  return await db.user.findOne({ where: { email: email } });
};

const lihatReward = (req, res, next) => {
  db.reward
    .findAll()
    .then((result) => {
      res.rest.success(result);
    })
    .catch((error) => {
      next(error);
    });
};

const specificReward = async (req, res, next) => {
  try {
    const dataReward = await db.reward.findOne({
      where: { id: req.params.id },
    });

    if (!dataReward)
      return res.rest.badRequest(
        `Reward dengan ID ${req.params.id} tidak ditemukan`
      );

    res.rest.success({ reward: dataReward });
  } catch (error) {
    next(error);
  }
};

const tukarPoint = async (req, res, next) => {
  try {
    const id_user = req.user.id;
    let { id_reward } = req.body;

    let reward = await db.reward.findOne({ where: { id: id_reward } });
    if (!reward) return res.rest.badRequest("Reward tidak ditemukan");

    let user = await db.user.findOne({ where: { id: id_user } });
    if (!user) return res.rest.badRequest("user tidak ditemukan");

    if (user.point < reward.point)
      return res.rest.badRequest("Point anda tidak cukup");
    if (reward.jumlah == 0)
      return res.rest.badRequest("Maaf, penukaran point anda tidak berhasil");

    if (user.point >= reward.point) {
      await user.update({
        point: user.point - reward.point,
      });
      await reward.update({
        jumlah: reward.jumlah - 1,
      });
      return res.rest.success("Penukaran point berhasil");
    }
  } catch (error) {
    next(error);
  }
};

const checkCredentials = async (req, res, next) => {
  try {
    let credentials = await db.user.findOne({
      where: { email: req.body.email, no_telp: req.body.no_telp },
    });

    if (!credentials)
      return res.rest.notFound("Email dan No. Telepon tidak ditemukan");

    return res.rest.success("Email dan No. Telepon ditemukan!");
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    let credentials = await db.user.findOne({
      where: { email: req.body.email, no_telp: req.body.no_telp },
    });

    if (!credentials)
      return res.rest.notFound("Email dan No. Telepon tidak ditemukan");

    req.body.password = req.body.password
      ? md5(req.body.password)
      : req.body.password;

    credentials
      .update({
        password: req.body.password,
      })
      .then((result) => {
        res.rest.success("Password telah diperbaharui!");
      })
      .catch((err) => {
        res.rest.badRequest(err);
      });
  } catch (error) {
    next(error);
  }
};

const deletePicture = async (req, res, next) => {
  try {
    let user = await db.user.findOne({ where: { id: req.user.id } });

    if (!user) return res.rest.notFound("User tidak ditemukan");

    if (user.image === null) return res.rest.badRequest("Image tidak ada");

    await unlinkAsync(`uploads/${user.image}`);
    await user.update({
      image: null,
    });
    return res.rest.success("Profile Picture telah dihapus!");
  } catch (error) {
    next(error);
  }
};

const membuatKomplain = async (req, res, next) => {
  try {
    const id_user = req.user.id;

    let user = await db.user.findOne({ where: { id: id_user } });
    if (!user) return res.rest.badRequest("user tidak ditemukan");

    db.komplain.create(req.body).then((result) => {
      res.rest.created("Pesan Berhasil dikirim!");
    });
  } catch (error) {
    res.rest.badRequest(error);
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
  lihatArtikel,
  specificArtikel,
  donorDarahRS,
  donorDarahPMI,
  findOneByEmail,
  lihatReward,
  specificReward,
  tukarPoint,
  uploadPicture,
  forgotPassword,
  deletePicture,
  membuatKomplain,
  checkCredentials,
};
