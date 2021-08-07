"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PMI extends Model {
    static associate(models) {
      PMI.hasOne(models.donorDarahPMI, { foreignKey: "id_pmi" });
      PMI.hasMany(models.eventPMI, { foreignKey: "id_pmi" });
    }
  }
  PMI.init(
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
            args: ["PMI"],
          },
        },
      },
    },
    {
      sequelize,
      modelName: "PMI",
    }
  );
  return PMI;
};
