"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class reward extends Model {
    static associate(models) {}
  }
  reward.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      point: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "reward",
    }
  );
  return reward;
};
