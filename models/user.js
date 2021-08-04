"use strict";
const { Model } = require("sequelize");
const { password } = require("../config/config");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      user.hasOne(models.donorDarahPMI, { foreignKey: "id_user" });
      user.hasOne(models.donorDarahRS, { foreignKey: "id_user" });
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
        allowNull: false,
      },
      tempat_lahir: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tanggal_lahir: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      golongan_darah: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rhesus: {
        type: DataTypes.ENUM("+", "-"),
        allowNull: true,
      },
      alamat: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      no_telp: {
        type: DataTypes.STRING,
        allowNull: false,
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
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return user;
};
