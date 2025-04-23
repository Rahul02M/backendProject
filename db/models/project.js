const sequelize = require("../../config/database");
const { Model, DataTypes } = require("sequelize");

module.exports = sequelize.define(
  "project",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "title cannot be null",
        },
        notEmpty: {
          msg: "title cannot be empty",
        },
      },
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      validate: {
        isIn: {
          args: [[true, false]],
          msg: "isFeatured value must be true or false",
        },
      },
    },
    productImage: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const value = this.getDataValue("productImage");
        return value ? JSON.parse(value) : [];
      },
      set(value) {
        this.setDataValue("productImage", JSON.stringify(value));
      },
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        notNull: {
          msg: "price cannot be null",
        },
        isDecimal: {
          msg: "price value must be in decimal",
        },
      },
    },
    shortDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "shortDescription cannot be null",
        },
        notEmpty: {
          msg: "shortDescription cannot be empty",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "shortDescription cannot be null",
        },
        notEmpty: {
          msg: "shortDescription cannot be empty",
        },
      },
    },
    productUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "productUrl cannot be null",
        },
        notEmpty: {
          msg: "productUrl cannot be empty",
        },
        isUrl: {
          msg: "Invalid productUrl string",
        },
      },
    },
    category: {
      type: DataTypes.TEXT,
      get() {
        const value = this.getDataValue("category");
        return value ? JSON.parse(value) : [];
      },
      set(value) {
        this.setDataValue("category", JSON.stringify(value));
      },
    },
    tags: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const value = this.getDataValue("tags");
        return value ? JSON.parse(value) : [];
      },
      set(value) {
        this.setDataValue("tags", JSON.stringify(value));
      },
      validate: {
        notNull: {
          msg: "tags cannot be Null",
        },
      },
    },
    createdBy: {
      type: DataTypes.INTEGER,
      references: {
        model: "user",
        key: "id",
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
    paranoid: false,
    freezeTableName: true,
    modelName: "project",
  }
);
