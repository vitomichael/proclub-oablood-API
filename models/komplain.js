"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class komplain extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      komplain.belongsTo(models.user, { foreignKey: "id_user" });
    }
  }
  komplain.init(
    {
      id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pesan: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "komplain",
    }
  );
  return komplain;
};
