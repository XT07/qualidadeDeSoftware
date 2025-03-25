const express = require("express");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const router = express.Router();
const users = require("../modules/Users");

const codes = new Map();

// Configuração do transporte do Nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'emailrecoveryquadsoft@gmail.com', // Substitua pelo seu email
        pass: 'Sen@caula' // garanta que tem gmail tem liberação para acesso de terceiros 
    }
});

// Rota para enviar o código por e-mail
router.post('/sendcode', async (req, res) => {
    let email = req.body.email;
    if (!email) return res.status(400).json({ error: 'Email é obrigatório' });
    
    const code = crypto.randomInt(100000, 999999).toString();
    codes.set(email, code);
    
    try {
        await transporter.sendMail({
            from: 'emailrecoveryquadsoft@gmail.com',
            to: email,
            subject: 'Seu Código de Autenticação da uabadabdabdubdub Interpress',
            text: `Seu código de autenticação é: ${code}`
        });
        res.render("/recovery");
    } catch (error) {
        res.status(500).json({ error: 'Erro ao enviar email', details: error });
    }
});

// Rota para verificar o código
router.post('/verifycode', (req, res) => {
    let email = req.body.email;
    let code = req.body.code;
    if (!email || !code) return res.status(400).json({ error: 'Email e código são obrigatórios' });
    
    if (codes.get(email) === code) {
        codes.delete(email); // Remover código após validação bem-sucedida
        users.findOne({ where: { id:req.session.user.id } }).then(user => {
            res.render("/perfil", {
                user: user
            });
        })
    } else {
        res.status(400).json({ error: 'Código inválido' });
    }
});

module.exports = router;