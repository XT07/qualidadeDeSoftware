const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");

//nesse espaço faça a autenticação do DB

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({
    secret: "pensandoEmAlgo",//secret server para proteger a session e não ficar visivel para o publico
    cookie:{
        maxAge: 2592000000//define o tempo q as informações do usuario ficam salvas no sistema (oq não estiver no DB)
    }
}))

///aqui colocaremos as rotas sem relação entre si no sentido de que não tem uma certa "administração" em cima delas
app.get("/", (req, res) => {
    res.render("index");
})

app.listen(3030, () => {
    console.log("server on");
})