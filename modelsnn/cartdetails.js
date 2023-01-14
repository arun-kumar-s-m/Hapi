const sequelize = require('./../sequelize-init');
const DataTypes =  require('sequelize');

const CartDetails = sequelize.define('CartDetails',{
  CART_ITEM_ID: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  }
},{
  timestamps: true,
  createdAt: 'ADDED_TIME',
  updatedAt: false
}); 
module.exports = CartDetails;