const sequelize = require('./../sequelize-init');
const DataTypes =  require('sequelize');

const ProductDetails = sequelize.define('ProductDetails',{
  PRODUCT_ID: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  ADDITONAL_INFO: {
    type: DataTypes.JSON,
    allowNull: false
  },
  AVAILABLE_QUANTITY: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  IS_ACTIVE: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    default : true
  },
  ORIGINAL_PRICE: {
    type: DataTypes.REAL,
    allowNull :false
  },
  DISCOUNTED_PRICE: {
    type: DataTypes.REAL,
    allowNull :false
  },
  // CREATED_BY: {
  //   type: DataTypes.INTEGER,
  //   allowNull :false,
  //   references : {
  //     model : 'UserDetails',
  //     key : 'USER_ID'
  //   }
  // },
  // BASE_ITEM : {
  //   type: DataTypes.INTEGER,
  //   allowNull :false,
  //   references : {
  //     model : 'BaseItems',
  //     key : 'BASE_ITEM_ID'
  //   }
  // },
  // CATEGORY_ID : {
  //   type: DataTypes.INTEGER,
  //   allowNull :false,
  //   references : {
  //     model : 'AmartConstants',
  //     key : 'CONSTANT_ID'
  //   }
  // },
  // SUB_CATEGORY_ID : {
  //   type: DataTypes.INTEGER,
  //   allowNull :false,
  //   references : {
  //     model : 'SubCategoryDetails',
  //     key : 'SUB_CATEGORY_ID'
  //   }
  // },
},{
  timestamps: true,
  createdAt: 'CREATED_TIME',
  updatedAt: 'MODIFIED_TIME'
}); 
module.exports = ProductDetails;

// module.exports = (sequelize,DataTypes) => {
//     const ProductDetails = sequelize.define('ProductDetails',{
//         PRODUCT_ID: {
//           allowNull: false,
//           autoIncrement: true,
//           primaryKey: true,
//           type: DataTypes.INTEGER
//         },
//         ADDITONAL_INFO: {
//           type: DataTypes.JSON,
//           allowNull: false
//         },
//         AVAILABLE_QUANTITY: {
//           type: DataTypes.SMALLINT,
//           allowNull: false
//         },
//         IS_ACTIVE: {
//           type: DataTypes.BOOLEAN,
//           allowNull: false,
//           default : true
//         },
//         ORIGINAL_PRICE: {
//           type: DataTypes.REAL,
//           allowNull :false
//         },
//         DISCOUNTED_PRICE: {
//           type: DataTypes.REAL,
//           allowNull :false
//         },
//         // CREATED_BY: {
//         //   type: DataTypes.INTEGER,
//         //   allowNull :false,
//         //   references : {
//         //     model : 'UserDetails',
//         //     key : 'USER_ID'
//         //   }
//         // },
//         // BASE_ITEM : {
//         //   type: DataTypes.INTEGER,
//         //   allowNull :false,
//         //   references : {
//         //     model : 'BaseItems',
//         //     key : 'BASE_ITEM_ID'
//         //   }
//         // },
//         // CATEGORY_ID : {
//         //   type: DataTypes.INTEGER,
//         //   allowNull :false,
//         //   references : {
//         //     model : 'AmartConstants',
//         //     key : 'CONSTANT_ID'
//         //   }
//         // },
//         // SUB_CATEGORY_ID : {
//         //   type: DataTypes.INTEGER,
//         //   allowNull :false,
//         //   references : {
//         //     model : 'SubCategoryDetails',
//         //     key : 'SUB_CATEGORY_ID'
//         //   }
//         // },
//       },{
//         timestamps: true,
//         createdAt: 'CREATED_TIME',
//         updatedAt: 'MODIFIED_TIME'
//      }); 
// }