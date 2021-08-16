"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class requestdarah extends Model {
    static associate(models) {
      requestdarah.belongsTo(models.rumahsakit, { foreignKey: "id_rs" });
      requestdarah.hasOne(models.donorDarahRS, { foreignKey: "id_request" });
    }
  }
  requestdarah.init(
    {
      id_rs: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      golongan_darah: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rhesus: {
        type: DataTypes.ENUM("+", "-"),
        allowNull: false,
      },
      keterangan: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      terpenuhi: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      kebutuhan: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      linkGmaps: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "requestdarah",
    }
  );
  return requestdarah;
};
