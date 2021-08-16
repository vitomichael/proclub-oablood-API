"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class donorDarahPMI extends Model {
    static associate(models) {
      donorDarahPMI.belongsTo(models.user, { foreignKey: "id_user" });
      donorDarahPMI.belongsTo(models.PMI, { foreignKey: "id_pmi" });
      donorDarahPMI.belongsTo(models.eventPMI, { foreignKey: "id_event" });
    }
  }
  donorDarahPMI.init(
    {
      id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_pmi: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_event: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      no_antrian: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      selesai: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "donorDarahPMI",
    }
  );
  return donorDarahPMI;
};
