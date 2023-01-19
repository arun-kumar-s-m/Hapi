const {Sequelize,DataTypes } = require('sequelize');
const logger =  require('./logger.js');
const server = require('./serverWithDB');

const sequelize = new Sequelize('postgresql_learn', 'arunkumarsm', '', {
    host: 'localhost',
    dialect: 'postgres',
    benchmark : true,
    logging : function (str,timingMs) {
        logger.info({'message' : `LOGGING QUERY :::::::: ${str} TIME TAKEN :::: ${timingMs} ms`});
    }
});

module.exports = sequelize;