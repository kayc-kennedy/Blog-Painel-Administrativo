const express = require("express");
const session = require('express-session');
const app = express();

const bodyParser = require("body-parser");
const connection = require('./database/database');

const CategoriesController = require('./categories/CategoriesController');
const ArticlesController = require('./articles/ArticlesController');
const usersController = require('./users/usersController');

const Article = require('./articles/Article');
const Category = require('./categories/Category');
const User = require('./users/user');


// Viwe engine
app.set('view engine', 'ejs'); 

// sessions 
app.use(session({
    secret: "seila",
    cookie: {maxAge: 30000000000000}
}));


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

//Acesso as rotas dos controllers
app.use('/', CategoriesController);

app.use('/', ArticlesController);

app.use('/', usersController);




app.get('/', (req, res)=>{ // Rota que alimenta a Home (navbar)

    Article.findAll(
        {order: [['id', 'desc']],
        limit: 4
        
    }).then(articles => {

        Category.findAll().then(categories => {
            res.render('index', {articles: articles, categories: categories});
        
        });
    });
});

app.get('/:slug', (req, res) =>{
    var slug = req.params.slug;

    Article.findOne({
        where: {
            slug: slug
        }
    }).then( article =>{
        if(article != undefined){
            
           Category.findAll().then(categories => {
            res.render('article', {article: article, categories: categories});
        
        });

        }else{
            res.redirect('/');
        }
    }).catch(err =>{
        res.redirect('/');
    });

});

app.get('/category/:slug', (req, res) =>{
    let slug = req.params.slug;

    Category.findOne({
        where:{
            slug: slug
        },
        include: [{model: Article}]
    
    }).then(category =>{
        if(category != undefined){
            Category.findAll().then(categories =>{
                res.render('index', {articles: category.articles, categories:categories});
            });
        }else{
            res.redirect('/');
        }
    }).catch(err =>{
        res.redirect('/')
    });
});

// Definindo a Porta de acesso
app.listen(8000, () => {
    console.log("Server is running");
});
