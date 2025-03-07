const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

router.get("/user", (req, res) => {
    //em andamento
});

router.get("/loginUser", async (req, res) => {
    let cpf = req.body.cpf;
    let pass = req.body.password;

    await users.findOne({ where: { cpf:cpf } }).then(user => {
        bcrypt.compare(pass, user.password).then(pass => {

        }).catch(err => {
            res.sendStatus(400);
            alert(`CPF ou senha não encontrado no nosso sistema por favor tente novamente`);
            console.log(`CPF ou senha não encontrado no nosso sistema por favor tente novamente || ERR ${err}`);
        })
    });

});

router.post("/user", (req, res) => {
    //em andamento
});

router.put("/user", (req, res) => {
    //em andamento
});

router.delete("/user", (req, res) => {
    users.destroy({ where: {id:id} });
});

module.exports = router;