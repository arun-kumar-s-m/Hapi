const sequelize = require('./../sequelize-init');
const DataTypes =  require('sequelize');

const Address = sequelize.define('Addresses',{
  ADDRESS_ID: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  FLAT_NO: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  FLAT_NAME: {
    type: DataTypes.STRING(30)
  },
  STREET: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  CITY: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  STATE: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  PINCODE: {
    type: DataTypes.STRING(6),
    allowNull: false
  },
  // USER_ID : {
  //   type: DataTypes.INTEGER,
  //   allowNull :false,
  //   references : {
  //     model : 'UserDetails',
  //     key : 'USER_ID'
  //   }
  // },
  ADDRESS_TYPE: {
    type: DataTypes.SMALLINT,
    default : 1
  }
},{
  timestamps: true,
  createdAt: 'CREATED_TIME',
  updatedAt: 'MODIFIED_TIME'
}); 

module.exports = Address;

// module.exports = (sequelize,DataTypes) => {
//     const Address = sequelize.define('Addresses',{
//         ADDRESS_ID: {
//           allowNull: false,
//           autoIncrement: true,
//           primaryKey: true,
//           type: DataTypes.INTEGER
//         },
//         FLAT_NO: {
//           type: DataTypes.STRING(5),
//           allowNull: false
//         },
//         FLAT_NAME: {
//           type: DataTypes.STRING(30)
//         },
//         STREET: {
//           type: DataTypes.STRING(20),
//           allowNull: false
//         },
//         CITY: {
//           type: DataTypes.STRING(20),
//           allowNull: false
//         },
//         STATE: {
//           type: DataTypes.STRING(20),
//           allowNull: false
//         },
//         PINCODE: {
//           type: DataTypes.STRING(6),
//           allowNull: false
//         },
//         // USER_ID : {
//         //   type: DataTypes.INTEGER,
//         //   allowNull :false,
//         //   references : {
//         //     model : 'UserDetails',
//         //     key : 'USER_ID'
//         //   }
//         // },
//         ADDRESS_TYPE: {
//           type: DataTypes.SMALLINT,
//           default : 1
//         }
//       },{
//         timestamps: true,
//         createdAt: 'CREATED_TIME',
//         updatedAt: 'MODIFIED_TIME'
//      }); 
// }