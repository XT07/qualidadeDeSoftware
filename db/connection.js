const sequelize = require("sequelize");

const connection = new sequelize("coloque-aqui-o-nome-do-db", "root", "senha-se-tiver", {
    host: "localhost",
    dialect: "mysql",
    timezone: "-03:00"
});

module.exports = connection;