const { DataTypes } = require('sequelize');
const { sequelize } = require('../server');

const ShoppingCartItem = sequelize.define('ShoppingCartItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1,
    },
  },
}, {
  tableName: 'shopping_cart_items',
  timestamps: false, 
});

module.exports = ShoppingCartItem;
