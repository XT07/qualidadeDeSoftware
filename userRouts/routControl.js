const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

router.get("/user", (req, res) => {
    //em andamento
});

router.get("/loginUser", (req, res) => {
    let cpf = parseInt(req.body.cpf);
    let pass = req.body.password;

    users.findOne({ where: { cpf:cpf } }).then(user => {

        let verific = bcrypt.compare(pass, user.password);
        
        if(verific){
            req.session.user = {
                id: user.id,
                name: user.name,
                email: user.email,
                cpf: user.cpf,
                pass: pass,
                dtNsc: user.dtNsc
            }

            res.sendStatus(200);
            //res.redirect("");
        }else{
            res.sendStatus(400);
            console.log(`Senha não encontrado no nosso sistema por favor tente novamente`);
        }
        
    }).catch(err => {
        res.sendStatus(400);
        console.log(`CPF não encontrado no nosso sistema por favor tente novamente || ERR ${err}`);
    });

});

router.post("/user", (req, res) => {
    let cpf = parseInt(req.body.cpf);
    let { name, password, email, dtNsc } = req.body;

    users.create({
        name: name,
        email: email,
        cpf: cpf,
        pass: password,
        dtNsc: dtNsc
    }).then(() => {
        res.sendStatus(200);
        //res.redirect("");
    }).catch(err => {
        res.sendStatus(400);
        console.log(`Não foi possivel criar o usuário || ERR ${err}`);
    })
});

router.patch("/user", (req, res) => {
    let id = req.session.id;
    let cpf = parseInt(req.body.cpf);
    let { name, password, email, dtNsc } = req.body;

    let subData = {
        name: name,
        password: password,
        email: email,
        dtNsc: dtNsc,
        cpf: cpf
    }

    users.update(subData, { where: { id:id } }).then(() => {
        res.sendStatus(200);
        //res.redirect("");
    }).catch(err => {
        res.sendStatus(400);
        console.log(`Erro ao tentar atualizar p usuário || ERR ${err}`);
    })
});

router.delete("/user", async (req, res) => {
    let id = parseInt(req.body.id);
    let verific = await users.findOne({ where: {id:id} });

    if(verific){
        users.destroy({ where: {id:id} }).then(user => {
            res.statusCode(200);
            //res.redirect("");
        }).catch(err => {
            res.sendStatus(400);
            console.log(`ID não encontrado no nosso banco de dados | ${err}`);
        })
    }else{
        res.sendStatus(400);
        console.log(`ID não encontrado no nosso banco de dados`);
    }
});

module.exports = router;