const sequelize = require('./../sequelize-init');
const DataTypes =  require('sequelize');

const User = sequelize.define('UserDetails',{
    USER_ID : {
        type : DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    FIRST_NAME : {
        type : DataTypes.STRING(30),
        allowNull: false
    },
    LAST_NAME : {
        type : DataTypes.STRING(30),
    },
    USERNAME : {
        type : DataTypes.STRING(50),
        allowNull: false,
        unique : true
    },
    PASSWORD : {
        type : DataTypes.STRING(50),
        allowNull: false
    },
    EMAIL : {
        type : DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    PHONE : {
        type : DataTypes.STRING(10),
        allowNull: false,
        unique: true
    },
    IS_ADMIN : {
        type : DataTypes.BOOLEAN,
        defaultValue: false 
    },
    STATUS : {
        type : DataTypes.INTEGER,
        defaultValue : 0
    }
 },{
    timestamps: true,
    createdAt: 'CREATED_TIME',
    updatedAt: false
 }); 

 module.exports = User;

// module.exports = (sequelize,DataTypes) => {
//     const User = sequelize.define('UserDetails',{
//         USER_ID : {
//             type : DataTypes.INTEGER,
//             autoIncrement: true,
//             primaryKey: true
//         },
//         FIRST_NAME : {
//             type : DataTypes.STRING(30),
//             allowNull: false
//         },
//         LAST_NAME : {
//             type : DataTypes.STRING(30),
//         },
//         USERNAME : {
//             type : DataTypes.STRING(50),
//             allowNull: false
//         },
//         PASSWORD : {
//             type : DataTypes.STRING(50),
//             allowNull: false
//         },
//         EMAIL : {
//             type : DataTypes.STRING(50),
//             allowNull: false,
//             unique: true
//         },
//         PHONE : {
//             type : DataTypes.STRING(10),
//             allowNull: false,
//             unique: true
//         },
//         IS_ADMIN : {
//             type : DataTypes.BOOLEAN,
//             defaultValue: false 
//         },
//         STATUS : {
//             type : DataTypes.INTEGER,
//             defaultValue : 0
//         }
//      },{
//         timestamps: true,
//         createdAt: 'CREATED_TIME',
//         updatedAt: false
//      }); 
//      return User;
// }