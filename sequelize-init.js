const {Sequelize,DataTypes } = require('sequelize');

const sequelize = new Sequelize('postgresql_learn', 'arunkumarsm', '', {
    host: 'localhost',
    dialect: 'postgres'/* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
});

module.exports = sequelize;