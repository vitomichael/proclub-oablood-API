"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class reward extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  reward.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      jumlah: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      point: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "reward",
    }
  );
  return reward;
};
