const {Sequelize , DataTypes} = require('sequelize');
const sequelize = new Sequelize('postgres://arunkumarsm:@localhost.com:5432/postgresql_learn',{
    logging: (...msg) => console.log(msg)
});

console.log('123123123');

sequelize.authenticate().then((result) => {
    console.log('Connection has been established successfully. POSTGRESQL Sequelise',result);
}).catch(error => {
    console.error('Unable to connect to the database :', error);
});
