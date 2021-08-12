"use strict";
const { Model } = require("sequelize");
const { password } = require("../config/config");
module.exports = (sequelize, DataTypes) => {
  class admin extends Model {
    static associate(models) {
      admin.hasMany(models.artikel, { foreignKey: "id_admin" });
    }
  }
  admin.init(
    {
      name: {
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
            args: ["admin"],
          },
        },
      },
    },
    {
      sequelize,
      modelName: "admin",
    }
  );
  return admin;
};
