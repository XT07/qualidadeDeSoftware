const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const routUser = require("./userRouts/routControl.js");
const connection = require("./db/connection.js");
const code = require("./config/codeSend.js");
const midleware = require("./midleware/midleware.js");
const methodOverride = require('method-override');


connection
    .authenticate()
    .then(() => {
        console.log("Conectado com o db");
    })
    .catch(err => {
        console.log(`Erro ao conectar com o db | ${err}`);
    });

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
app.use(methodOverride('_method'));

app.use("/", routUser);
app.use("/", code);

///aqui colocaremos as rotas sem relação entre si no sentido de que não tem uma certa "administração" em cima delas
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/home", midleware, (req, res) => {
    res.render("home");
})

app.get('/termos', (req, res) => {
    res.render('termos');
});
  

app.listen(3030, () => {
    console.log("server on");
})