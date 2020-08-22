const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const connection = require('./database/database');

// Viwe engine
app.set('view engine', 'ejs'); 

// Statics -- Arquivos estaticos (Sempre usar o nome de pasta = "public")
app.use(express.static('public'))

// Body Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// Database - Conexão com o banco
connection
    .authenticate()
    .then(() => {
        console.log("Conexão realizada com sucesso");
    })
    .catch((error) =>{
        console.log(error);
    });


app.get('/', (req, res)=>{
    res.render('index');
});

// Definindo a Porta de acesso
app.listen(8000, () => {
    console.log("Server is running");
});
