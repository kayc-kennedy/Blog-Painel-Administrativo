const sequelize = require('sequelize');
const connection = require('../database/database');
const Category = require('../categories/Category'); 

// Crindo tabela de artigos
const article = connection.define('article',{
    title:{
        type: sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: sequelize.STRING,
        allowNull: false
    },
    body: {
        type: sequelize.TEXT,
        allowNull: false
    }
})

// Estabelcendo relação etre categoria e artigo
// Uma categoria tem MUITOS artigos
// Relacionamento 1 para n
Category.hasMany(article);

// Estabelecendo relação entre artigo e categoria.
// Um artigo PERTENCE a UMA categoria 
// Relacionamento 1 para 1
article.belongsTo(Category);

//article.sync({force: false});

module.exports = article;