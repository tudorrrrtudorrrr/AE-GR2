const express = require('express');
const { verifyToken } = require('../utils/token.js');
const { ShoppingCart, ShoppingCartItem, Product } = require('../database/models');

const router = express.Router();

// Middleware to get or create a cart for the logged-in user
const getOrCreateCart = async (req, res, next) => {
  try {
    const [cart] = await ShoppingCart.findOrCreate({
      where: { userId: req.userId },
      defaults: { userId: req.userId },
    });
    req.cart = cart;
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error accessing cart', data: error.message });
  }
};

// All routes in this file will be protected and have access to the user's cart
router.use(verifyToken, getOrCreateCart);

/**
 * @route   GET /cart
 * @desc    Get the user's shopping cart with all its items and product details
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    const cartWithItems = await ShoppingCart.findByPk(req.cart.id, {
      include: [{
        model: Product,
        through: {
          attributes: ['quantity'] // Include quantity from the join table
        }
      }]
    });

    if (!cartWithItems) {
      // This case should ideally not be hit due to getOrCreateCart middleware
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    res.status(200).json({ success: true, message: 'Cart retrieved successfully', data: cartWithItems });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving cart', data: error.message });
  }
});

/**
 * @route   POST /cart/items
 * @desc    Add an item to the shopping cart or update its quantity if it already exists
 * @access  Private
 */
router.post('/items', async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({ success: false, message: 'Product ID and a valid quantity are required.' });
  }

  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Check if item is already in the cart
    let cartItem = await ShoppingCartItem.findOne({
      where: {
        shoppingCartId: req.cart.id,
        productId: productId,
      },
    });

    if (cartItem) {
      // If item exists, update quantity
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      // If item does not exist, create it
      cartItem = await ShoppingCartItem.create({
        shoppingCartId: req.cart.id,
        productId: productId,
        quantity: quantity,
      });
    }

    res.status(200).json({ success: true, message: 'Item added to cart', data: cartItem });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding item to cart', data: error.message });
  }
});

/**
 * @route   PUT /cart/items/:productId
 * @desc    Update the quantity of a specific item in the cart
 * @access  Private
 */
router.put('/items/:productId', async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
        return res.status(400).json({ success: false, message: 'A valid quantity is required.' });
    }

    try {
        const [updatedCount] = await ShoppingCartItem.update(
            { quantity },
            { where: { shoppingCartId: req.cart.id, productId: productId } }
        );

        if (updatedCount === 0) {
            return res.status(404).json({ success: false, message: 'Item not found in cart.' });
        }

        res.status(200).json({ success: true, message: 'Cart item updated successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating cart item', data: error.message });
    }
});

/**
 * @route   DELETE /cart/items/:productId
 * @desc    Remove a specific item from the cart
 * @access  Private
 */
router.delete('/items/:productId', async (req, res) => {
    const { productId } = req.params;

    try {
        const deletedCount = await ShoppingCartItem.destroy({
            where: { shoppingCartId: req.cart.id, productId: productId }
        });

        if (deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'Item not found in cart.' });
        }

        res.status(200).json({ success: true, message: 'Item removed from cart.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error removing item from cart', data: error.message });
    }
});

module.exports = router;
