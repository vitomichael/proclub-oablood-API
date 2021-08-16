"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class eventPMI extends Model {
    static associate(models) {
      eventPMI.hasOne(models.donorDarahPMI, { foreignKey: "id_event" });
    }
  }
  eventPMI.init(
    {
      id_pmi: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      lokasi: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      jadwal: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      start: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      end: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
      modelName: "eventPMI",
    }
  );
  return eventPMI;
};
