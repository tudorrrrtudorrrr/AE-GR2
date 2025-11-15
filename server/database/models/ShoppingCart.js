const { DataTypes } = require('sequelize');
const { sequelize } = require('../server');
const User = require('./User');

const ShoppingCart = sequelize.define('ShoppingCart', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true, // Each user has only one cart
    references: {
      model: User,
      key: 'id',
    },
  },
}, {
  tableName: 'shopping_carts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = ShoppingCart;
