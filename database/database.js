const sequelize = require("sequelize");

// Conexão com o banco
const connection = new sequelize('guiapress', 'root', '123brochine',{
    host:'localhost',
    dialect:'mysql'
});

module.exports = connection;