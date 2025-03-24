const sequelize = require("sequelize");

const connection = new sequelize("qualidadeSoft", "root", "", {
    host: "localhost",
    dialect: "mysql",
    timezone: "-03:00"
});

module.exports = connection;