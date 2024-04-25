// connects to the database
const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

// object(if no table create one) -> table -> express-router -> so without creating the table we get the table
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define(
    "users",
    {
      userid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: DataTypes.STRING,
      hashedPassword: DataTypes.STRING,
      gender: DataTypes.STRING,
      mobile: DataTypes.STRING,
      email: DataTypes.STRING,
      pic: DataTypes.STRING,
      profiletext: DataTypes.STRING,
    },
    {
      tableName: "users",
      timestamps: false, // no created at & no updated at in the table
    }
  );
  return users;
};