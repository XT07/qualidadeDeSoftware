const express = require("express");
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const router = express.Router();

const codes = new Map();

// Configuração do transporte do Nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'seuemail@gmail.com', // Substitua pelo seu email
        pass: 'suasenha' // garanta que tem gmail tem liberação para acesso de terceiros 
    }
});

// Rota para enviar o código por e-mail
router.post('/sendcode', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email é obrigatório' });
    
    const code = crypto.randomInt(100000, 999999).toString();
    codes.set(email, code);
    
    try {
        await transporter.sendMail({
            from: 'seuemail@gmail.com',
            to: email,
            subject: 'Seu Código de Autenticação da uabadabdabdubdub Interpress',
            text: `Seu código de autenticação é: ${code}`
        });
        res.json({ message: 'Código enviado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao enviar email', details: error });
    }
});

// Rota para verificar o código
router.post('/verifycode', (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ error: 'Email e código são obrigatórios' });
    
    if (codes.get(email) === code) {
        codes.delete(email); // Remover código após validação bem-sucedida
        res.json({ message: 'Código válido!' });
    } else {
        res.status(400).json({ error: 'Código inválido' });
    }
});

module.exports = router;