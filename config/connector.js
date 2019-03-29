var Sequelize = require('sequelize');
const sequelize = new Sequelize('SQL_quartzreg', 'postgres', 'root', {
    host: '127.0.0.1',
    dialect: 'postgres',
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }, 
    define:{
        freezeTableName: true
    }
});

sequelize.authenticate().then(() =>{
    console.log('Connection has been established successfully.');
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});

module.exports = sequelize;