"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class eventPMI extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
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
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "eventPMI",
    }
  );
  return eventPMI;
};
