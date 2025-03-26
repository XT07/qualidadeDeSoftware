const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const users = require("../modules/Users");
const midleware = require("../midleware/midleware");

const salt = bcrypt.genSaltSync(10);

router.get("/profyle", midleware, (req, res) => {
    users.findOne({ where: {id: req.session.user.id} }).then(user => {
        res.render("perfil", {
            user: user
        });
    });
});

router.get("/recovery", (req, res) => {
    res.render("senha");
});

router.get("/registerUser", (req, res) => {
    res.render("cadastro");
});

router.post("/loginUser", (req, res) => {
    let cpf = parseInt(req.body.cpf);
    let pass = req.body.password;

    users.findOne({ where: { cpf:cpf } }).then(user => {
        let verific = bcrypt.compareSync(pass, user.password);

        if(verific){
            req.session.user = {
                id: user.id,
                name: user.name,
                email: user.email,
                cpf: user.cpf,
                pass: user.password,
                birth_date: user.birth_date,
                phone: user.phone,
                recovery_email: user.recovery_email
            }
            res.redirect("/home");
        }else{
            res.redirect("/");
            console.log(`Senha não encontrado no nosso sistema por favor tente novamente`);
        }
        
    }).catch(err => {
        res.sendStatus(400);
        console.log(`CPF não encontrado no nosso sistema por favor tente novamente || ERR ${err}`);
    });

});

router.post("/user", async (req, res) => {
    let cpf = parseInt(req.body.cpf);
    let { name, password, email, birth_date, phone, recovery_email } = req.body;
    let hash = await bcrypt.hashSync(password, salt);

    users.create({
        name: name,
        email: email,
        cpf: cpf,
        password: hash,
        birth_date: birth_date,
        phone: phone,
        recovery_email: recovery_email
    }).then(() => {
        res.redirect("/");
    }).catch(err => {
        console.log(`Não foi possivel criar o usuário || ERR ${err}`);
        res.sendStatus(400);
    })
});

router.post("/userupt", midleware, (req, res) => {
    let cpf = parseInt(req.body.cpf);
    let { name, email, birth_date, phone, recovery_email } = req.body;

    users.update({
        name: name,
        email: email,
        birth_date: birth_date,
        cpf: cpf,
        phone: phone,
        recovery_email: recovery_email
    }, { where: { id:req.session.user.id } }).then(() => {
        res.redirect("/home");
    }).catch(err => {
        res.sendStatus(400);
        console.log(`Erro ao tentar atualizar o usuário || ERR ${err}`);
    })
});

router.delete("/user", midleware, async (req, res) => {
    let verific = await users.findOne({ where: {id:req.session.id} });

    if(verific){
        users.destroy({ where: {id:req.session.id} }).then(() => {
            res.redirect("/");
        }).catch(err => {
            res.sendStatus(400);
            console.log(`ID não encontrado no nosso banco de dados | ${err}`);
        });
    }else{
        res.sendStatus(400);
        console.log(`ID não encontrado no nosso banco de dados`);
    }
});

module.exports = router;