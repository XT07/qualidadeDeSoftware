const connection = require("../db/connection");
const sequelize = require("sequelize");

const User = connection.define("Users", {
    name: {
        type: sequelize.STRING,
        allowNull: false
    },
    email: {
        type: sequelize.STRING,
        allowNull: false,
        unique: true
    },
    recovery_email: {
        type: sequelize.STRING,
        allowNull: false
    },
    password: {
        type: sequelize.STRING,
        allowNull: false
    },
    phone: {
        type: sequelize.STRING,
        allowNull: false
    }
});

User.sync({ force: false })
    .then(() => {
        console.log("Tabela Users sincronizada");
    })
    .catch(err => {
        console.log(`Erro ao sincronizar a tabela | ${err}`);
    });

module.exports = User;