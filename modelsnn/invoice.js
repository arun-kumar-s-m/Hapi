const sequelize = require('./../sequelize-init');
const DataTypes =  require('sequelize');


const Invoice = sequelize.define('Invoices',{
  INVOICE_ID: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  TOTAL_ITEMS_BROUGHT: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  TOTAL_AMOUNT: {
    type: DataTypes.REAL,
    allowNull: false
  },
  PAYMENT_SOURCE: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  // BROUGHT_BY: {
  //   type: DataTypes.INTEGER,
  //   allowNull :false,
  //   references : {
  //     model : 'UserDetails',
  //     key : 'USER_ID'
  //   }
  // },
  // DELIVERY_ADDRESS: {
  //   type: DataTypes.INTEGER,
  //   allowNull :false,
  //   references : {
  //     model : 'Addresses',
  //     key : 'ADDRESS_ID'
  //   }
  // },
  STATUS : {
    type: DataTypes.SMALLINT,
    allowNull :false,
    default : 0
  },
},{
  timestamps: true,
  createdAt: 'ORDERED_TIME',
  updatedAt: false
}); 

module.exports = Invoice;
// module.exports = (sequelize,DataTypes) => {
//     const Invoice = sequelize.define('Invoices',{
//         INVOICE_ID: {
//           allowNull: false,
//           autoIncrement: true,
//           primaryKey: true,
//           type: DataTypes.INTEGER
//         },
//         TOTAL_ITEMS_BROUGHT: {
//           type: DataTypes.SMALLINT,
//           allowNull: false
//         },
//         TOTAL_AMOUNT: {
//           type: DataTypes.REAL,
//           allowNull: false
//         },
//         PAYMENT_SOURCE: {
//           type: DataTypes.SMALLINT,
//           allowNull: false
//         },
//         // BROUGHT_BY: {
//         //   type: DataTypes.INTEGER,
//         //   allowNull :false,
//         //   references : {
//         //     model : 'UserDetails',
//         //     key : 'USER_ID'
//         //   }
//         // },
//         // DELIVERY_ADDRESS: {
//         //   type: DataTypes.INTEGER,
//         //   allowNull :false,
//         //   references : {
//         //     model : 'Addresses',
//         //     key : 'ADDRESS_ID'
//         //   }
//         // },
//         STATUS : {
//           type: DataTypes.SMALLINT,
//           allowNull :false,
//           default : 0
//         },
//       },{
//         timestamps: true,
//         createdAt: 'ORDERED_TIME',
//         updatedAt: false
//      }); 
// }