const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "emi128", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
