const sequelize = require('sequelize');
const connection = require('../database/database');

// Criando tabela de categorias 
const User = connection.define('users', {
    email: {
        type: sequelize.STRING,
        allowNull: false
    },
    password:{
        type: sequelize.STRING,
        allowNull: false
    }
})

//User.sync({force: false});

module.exports = User;