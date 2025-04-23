"use strict";
const { Model, Op, Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../../config/database");
const APPError = require("../../utils/appError");
const project = require("./project");

const user = sequelize.define(
  "user",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    userType: {
      type: DataTypes.ENUM("0", "1", "2"),
      allowNull: false,
      validate: {
        notNull: {
          msg: "userType cannot be null",
        },
        notEmpty: {
          msg: "userType cannot be empty",
        },
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "name cannot be null",
        },
        notEmpty: {
          msg: "name cannot be empty",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "email cannot be null",
        },
        notEmpty: {
          msg: "email cannot be empty",
        },
        isEmail: {
          msg: "Invalid email id ",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "password cannot be null",
        },
        notEmpty: {
          msg: "password cannot be empty",
        },
      },
    },
    confirmPassword: {
      type: DataTypes.VIRTUAL,
      set(value) {
        if (this.password.length < 7) {
          throw new APPError("Password length must le grater then 7");
        }
        if (value === this.password) {
          const hashPassword = bcrypt.hashSync(value, 10);
          this.setDataValue("password", hashPassword);
        } else {
          throw new APPError(
            "Password and ConfirmPassword should be Same",
            400
          );
        }
      },
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  },
  {
    paranoid: true, // is will when we have deleteAt
    freezeTableName: true,
    deletedAt: "deleteAt",
    modelName: "user",
  }
);

//Associations
user.hasMany(project, { foreignKey: "createdBy" });
project.belongsTo(user, {
  foreignKey: "createdBy",
});

module.exports = user;
