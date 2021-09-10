const db = require("../models");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const { unlinkAsync } = require("../helpers/deleteFile");

const genToken = async (id, role) => {
  const token = jwt.sign({ id, role }, process.env.TOKEN_SECRET);
  await db.Token.create({ token });
  return token;
};

const buatAkunRS = async (req, res, next) => {
  try {
    let rs = await db.rumahsakit.findOne({ where: { email: req.body.email } });

    if (rs)
      return res.status(409).json({
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
  }
};

const buatAkunPMI = async (req, res, next) => {
  try {
    let pmi = await db.PMI.findOne({ where: { email: req.body.email } });

    if (pmi)
      return res.status(409).json({
        message: "Email already exist!",
      });

    req.body.password = req.body.password
      ? md5(req.body.password)
      : req.body.password;
    req.body.role = "PMI";

    db.PMI.create(req.body)
      .then((result) => {
        res.rest.created("Akun telah dibuat!");
      })
      .catch((err) => {
        res.rest.badRequest(err);
      });
  } catch (error) {
    next(error);
  }
};

const login = (req, res, next) => {
  db.admin
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

const membuatArtikel = async (req, res, next) => {
  try {
    req.body.id_admin = req.user.id;
    req.body.image = req.files ? req.files.image[0].filename : "";

    db.artikel
      .create(req.body)
      .then((result) => {
        res.rest.created("Artikel berhasil dibuat!");
      })
      .catch(async (error) => {
        if (req.image != "") await unlinkAsync(req.files.image[0].path);
        res.rest.badRequest(error);
      });
  } catch (error) {
    res.rest.badRequest(error);
  }
};

const deleteArtikel = async (req, res, next) => {
  try {
    const id = req.params.id;

    let postArtikel = await db.artikel.findOne({
      where: {
        id: id,
      },
    });
    if (postArtikel) {
      if (postArtikel.image != null || postArtikel.image != "") {
        await unlinkAsync(`uploads/${postArtikel.image}`);
      }
      await postArtikel
        .destroy()
        .then((result) => {
          if (result) {
            res.rest.success("Artikel berhasil dihapus!");
          } else {
            res.rest.notFound("Artikel tidak ditemukan!");
          }
        })
        .catch((error) => {
          res.rest.badRequest(error);
        });
    } else {
      return res.rest.notFound("Artikel tidak ditemukan!");
    }
  } catch (error) {
    next(error);
  }
};

const premiumUser = async (req, res, next) => {
  let premium = await db.user.findOne({ where: { email: req.body.email } });

  if (!premium) return res.rest.badRequest("User tidak ditemukan!");

  const premiumship = {
    role: "premium",
  };

  premium
    .update(premiumship)
    .then((result) => {
      res.rest.success("Premium user telah ditambahkan!");
    })
    .catch((err) => {
      res.rest.badRequest(err);
    });
};

const findOneByEmailAdmin = async (email) => {
  return await db.admin.findOne({ where: { email: email } });
};

const membuatReward = async (req, res, next) => {
  try {
    req.body.image = req.files ? req.files.image[0].filename : "";
    db.reward
      .create(req.body)
      .then((result) => {
        res.rest.success("Reward berhasil ditambahkan");
      })
      .catch(async (err) => {
        if (req.image != "") await unlinkAsync(req.files.image[0].path);
        res.rest.badRequest(err);
      });
  } catch (error) {
    res.rest.badRequest(error);
  }
};

const deleteReward = async (req, res, next) => {
  try {
    const id = req.params.id;

    let postReward = await db.reward.findOne({
      where: {
        id: id,
      },
    });
    if (postReward) {
      if (postReward.image != null || postReward.image != "") {
        await unlinkAsync(`uploads/${postReward.image}`);
      }
      await postReward
        .destroy()
        .then((result) => {
          if (result) {
            res.rest.success("Reward berhasil dihapus!");
          } else {
            res.rest.notFound("Reward tidak ditemukan!");
          }
        })
        .catch((error) => {
          res.rest.badRequest(error);
        });
    } else {
      return res.rest.notFound("Reward tidak ditemukan!");
    }
  } catch (error) {
    next(error);
  }
};

const lihatKomplain = (req, res, next) => {
  db.komplain
    .findAll()
    .then((result) => {
      res.rest.success(result);
    })
    .catch((error) => {
      next(error);
    });
};

const specificKomplain = async (req, res, next) => {
  try {
    const dataKomplain = await db.komplain.findOne({
      where: { id: req.params.id },
    });

    if (!dataKomplain)
      return res.rest.badRequest(
        `Komplain dengan ID ${req.params.id} tidak ditemukan`
      );

    res.rest.success({ komplain: dataKomplain });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    let token = await db.Token.findOne({
      where: {
        id: req.user.tokenId,
      },
    });
    if (!token) return res.rest.badRequest("Gagal Logout");
    await token.destroy();
    return res.rest.success("Logout berhasil");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  buatAkunRS,
  buatAkunPMI,
  login,
  membuatArtikel,
  deleteArtikel,
  premiumUser,
  findOneByEmailAdmin,
  membuatReward,
  lihatKomplain,
  specificKomplain,
  deleteReward,
  logout,
};
