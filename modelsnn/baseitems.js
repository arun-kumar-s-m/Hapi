const sequelize = require('./../sequelize-init');
const DataTypes =  require('sequelize');

const BaseItems = sequelize.define('BaseItems',{
  BASE_ITEM_ID: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  ITEM_NAME: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  ITEM_INFO: {
    type: DataTypes.JSON,
    allowNull: false
  },
  // CREATED_BY: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  //   references : {
  //     model : 'UserDetails',
  //     key : 'USER_ID'
  //   }
  // }
},{
  timestamps: true,
  createdAt: 'CREATED_TIME',
  updatedAt: false
}); 
module.exports = BaseItems;
// module.exports = (sequelize,DataTypes) => {
//     const BaseItems = sequelize.define('BaseItems',{
//         BASE_ITEM_ID: {
//           allowNull: false,
//           autoIncrement: true,
//           primaryKey: true,
//           type: DataTypes.INTEGER
//         },
//         ITEM_NAME: {
//           type: DataTypes.STRING(50),
//           allowNull: false
//         },
//         ITEM_INFO: {
//           type: DataTypes.JSON,
//           allowNull: false
//         },
//         // CREATED_BY: {
//         //   type: DataTypes.INTEGER,
//         //   allowNull: false,
//         //   references : {
//         //     model : 'UserDetails',
//         //     key : 'USER_ID'
//         //   }
//         // }
//       },{
//         timestamps: true,
//         createdAt: 'CREATED_TIME',
//         updatedAt: false
//      }); 
// }