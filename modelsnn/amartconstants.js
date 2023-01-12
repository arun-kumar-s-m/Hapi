const sequelize = require('./../sequelize-init');
const DataTypes =  require('sequelize');

const AmartConstants = sequelize.define('AmartConstants',{
  CONSTANT_ID: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  VALUE: {
    type: DataTypes.STRING,
    allowNull: false
  },
  TYPE : {
    type : DataTypes.SMALLINT,
    allowNull : false    
  }
},{
  timestamps: true,
  createdAt: false,
  updatedAt: false
}); 
module.exports = AmartConstants;

// module.exports = (sequelize,DataTypes) => {
//     const AmartConstants = sequelize.define('AmartConstants',{
//         CONSTANT_ID: {
//           allowNull: false,
//           autoIncrement: true,
//           primaryKey: true,
//           type: DataTypes.INTEGER
//         },
//         VALUE: {
//           type: DataTypes.STRING,
//           allowNull: false
//         },
//         TYPE : {
//           type : DataTypes.SMALLINT,
//           allowNull : false    
//         }
//       },{
//         timestamps: true,
//         createdAt: false,
//         updatedAt: false
//      }); 
// }