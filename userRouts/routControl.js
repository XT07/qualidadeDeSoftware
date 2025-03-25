const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const users = require("../modules/Users");

router.get("/user", (req, res) => {
    let id = req.session.user.id;

    users.findOne({ where: {id:id} }).then(user => {
        res.sendStatus(200);
        res.render("perfil", {
            user: user
        });
    })
});

router.get("/recovery", (req, res) => {
    res.render("senha");
})

router.get("/registerUser", (req, res) => {
    res.render("cadastro");
});

router.post("/loginUser", (req, res) => {
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
                birth_date: user.birth_date,
                phone: user.phone,
                recovery_email: user.recovery_email
            }

            res.sendStatus(200);
            res.redirect("/home");
        }else{
            res.sendStatus(401);
            console.log(`Senha não encontrado no nosso sistema por favor tente novamente`);
        }
        
    }).catch(err => {
        res.sendStatus(400);
        console.log(`CPF não encontrado no nosso sistema por favor tente novamente || ERR ${err}`);
    });

});

router.post("/user", (req, res) => {
    let cpf = parseInt(req.body.cpf);
    let { name, password, email, birth_date, phone, recovery_email } = req.body;

    users.create({
        name: name,
        email: email,
        cpf: cpf,
        pass: password,
        birth_date: birth_date,
        phone: phone,
        recovery_email: recovery_email
    }).then(() => {
        res.redirect("/home");
        res.sendStatus(200);
    }).catch(err => {
        console.log(`Não foi possivel criar o usuário || ERR ${err}`);
        res.sendStatus(400);
    })
});

router.patch("/user", (req, res) => {
    let id = req.session.id;
    let cpf = parseInt(req.body.cpf);
    let { name, password, email, birth_date, phone, recovery_email } = req.body;

    let subData = {
        name: name,
        password: password,
        email: email,
        birth_date: birth_date,
        cpf: cpf,
        phone: phone,
        recovery_email: recovery_email
    }

    users.update(subData, { where: { id:id } }).then(() => {
        res.sendStatus(200);
        res.redirect("/user");
    }).catch(err => {
        res.sendStatus(400);
        console.log(`Erro ao tentar atualizar o usuário || ERR ${err}`);
    })
});

router.delete("/user", async (req, res) => {
    let id = parseInt(req.body.id);
    let verific = await users.findOne({ where: {id:id} });

    if(verific){
        users.destroy({ where: {id:id} }).then(user => {
            res.statusCode(200);
            res.redirect("/");
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