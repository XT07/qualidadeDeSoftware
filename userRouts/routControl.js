const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

//rota da conta do usuário
router.get("/user", (req, res) => {
    let id = req.session.user.id;

    users.findOne({ where: {id:id} }).then(user => {
        res.sendStatus(200);
        res.send("Página em desenvolvimento");
    })
});

//rota da página de cadastro
router.get("/registerUser", (req, res) => {
    res.render("cadastro");
});

//rota q faz a consulta no DB das credenciais do login
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
            res.redirect("/user");
        }else{
            res.sendStatus(401);
            console.log(`Senha não encontrado no nosso sistema por favor tente novamente`);
        }
        
    }).catch(err => {
        res.sendStatus(400);
        console.log(`CPF não encontrado no nosso sistema por favor tente novamente || ERR ${err}`);
    });

});

//rota que cria um novo usuário
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
        res.sendStatus(200);
        res.redirect("/user");
    }).catch(err => {
        res.sendStatus(400);
        console.log(`Não foi possivel criar o usuário || ERR ${err}`);
    })
});

//rota que atualiza parcialmente o usuário
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
        console.log(`Erro ao tentar atualizar p usuário || ERR ${err}`);
    })
});

//rota que deleta o usuário
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