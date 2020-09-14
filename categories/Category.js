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

//usuario.sync({force: true});

module.exports = Category;