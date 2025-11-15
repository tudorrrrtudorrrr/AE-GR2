const User = require('./User');
const Product = require('./Product');
const ShoppingCart = require('./ShoppingCart');
const ShoppingCartItem = require('./ShoppingCartItem');

//Associations

// User <-> ShoppingCart (One-to-One)
User.hasOne(ShoppingCart, { foreignKey: 'userId' });
ShoppingCart.belongsTo(User, { foreignKey: 'userId' });

// ShoppingCart <-> Product (Many-to-Many through ShoppingCartItem)
ShoppingCart.belongsToMany(Product, { through: ShoppingCartItem, foreignKey: 'shoppingCartId' });
Product.belongsToMany(ShoppingCart, { through: ShoppingCartItem, foreignKey: 'productId' });

// Direct associations for easier querying if needed
ShoppingCart.hasMany(ShoppingCartItem, { foreignKey: 'shoppingCartId' });
ShoppingCartItem.belongsTo(ShoppingCart, { foreignKey: 'shoppingCartId' });
Product.hasMany(ShoppingCartItem, { foreignKey: 'productId' });
ShoppingCartItem.belongsTo(Product, { foreignKey: 'productId' });

module.exports = { User, Product, ShoppingCart, ShoppingCartItem };