const connection = require("../db/connection");
const sequelize = require("sequelize");

const User = connection.define("Users", {
    name: {
        type: sequelize.STRING,
        allowNull: false
    },
    email: {
        type: sequelize.STRING,
        allowNull: false
    },
    recuperationEmail: {
        type: sequelize.STRING,
        allowNull: false
    },
    password: {
        type: sequelize.STRING,
        allowNull: false
    },
    celphone: {
        type: sequelize.NUMBER,
        allowNull: false
    }
})

URLSearchParams.sync({ force: false }).then(() => {
    console.log("Tabela sincronizada");
}).catch(err => {
    console.log(`Erro ao sincronizar a tabela | ${err}`);
});