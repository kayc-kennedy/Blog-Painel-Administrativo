const sequelize = require('sequelize');
const connection = require('../database/database');

// Criando tabela de categorias 
const Category = connection.define('categories', {
    title: {
        type: sequelize.STRING,
        allowNull: false
    },
    slug:{
        type: sequelize.STRING,
        allowNull: false
    }
})

//Category.sync({force: false});

module.exports = Category;