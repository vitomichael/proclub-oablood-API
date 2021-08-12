"use strict";
const { Model } = require("sequelize");
const { password } = require("../config/config");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {
      user.hasOne(models.donorDarahPMI, { foreignKey: "id_user" });
      user.hasOne(models.donorDarahRS, { foreignKey: "id_user" });
      user.hasOne(models.komplain, { foreignKey: "id_user" });
    }
  }
  user.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      jenis_kelamin: {
        type: DataTypes.ENUM("L", "P"),
        allowNull: true,
      },
      tempat_lahir: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tanggal_lahir: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      golongan_darah: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      rhesus: {
        type: DataTypes.ENUM("+", "-"),
        allowNull: true,
      },
      alamat: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      no_telp: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      riwayat_donor: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: {
            args: [["user", "premium"]],
          },
        },
      },
      point: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
<<<<<<< HEAD
=======
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
>>>>>>> vito_dev
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return user;
};
