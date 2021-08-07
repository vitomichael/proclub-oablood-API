"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class artikel extends Model {
    static associate(models) {
      artikel.belongsTo(models.admin, {
        foreignKey: "id_admin",
        onDelete: "CASCADE",
      });
    }
  }
  artikel.init(
    {
      id_admin: DataTypes.INTEGER,
      judul: DataTypes.STRING,
      link: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "artikel",
    }
  );
  return artikel;
};
