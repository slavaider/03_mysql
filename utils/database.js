const Sequelize = require('sequelize');
const sequelize = new Sequelize('node-todo', 'root', '12345678admin', {
    dialect: 'mysql',
    host: 'localhost'
});
module.exports = sequelize
