"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class rumahsakit extends Model {
    static associate(models) {
      rumahsakit.hasOne(models.donorDarahRS, { foreignKey: "id_rs" });
      rumahsakit.hasMany(models.requestdarah, { foreignKey: "id_rs" });
    }
  }
  rumahsakit.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
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
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: {
            args: ["rs"],
          },
        },
      },
    },
    {
      sequelize,
      modelName: "rumahsakit",
    }
  );
  return rumahsakit;
};
