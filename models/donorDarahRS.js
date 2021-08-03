"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class donorDarahRS extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      donorDarahRS.belongsTo(models.user, { foreignKey: "id_user" });
      donorDarahRS.belongsTo(models.rumahsakit, { foreignKey: "id_rs" });
      donorDarahRS.belongsTo(models.requestdarah, { foreignKey: "id_request" });
    }
  }
  donorDarahRS.init(
    {
      id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_rs: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_request: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      jadwal_donor: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      no_antrian: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "donorDarahRS",
    }
  );
  return donorDarahRS;
};
