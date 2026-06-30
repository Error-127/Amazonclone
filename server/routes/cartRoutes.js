const express = require('express');
const router = express.Router();
const Cart = require('../models/cart'); // Double check if your file is named 'cart.js' or 'Cart.js'

// IMPORTANT: Import your middleware to decode the JWT token.
// If you use a separate file, make sure to require it correctly. 
// If you don't have a separate middleware file, use this inline verification:
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: "Access Denied: Missing Authorization Header" });
    }

    const token = authHeader.split(' ')[1]; // Extract the token value behind 'Bearer'
    if (!token) {
      return res.status(401).json({ message: "Access Denied: Invalid Token Format" });
    }

    // Replace 'your_jwt_secret_key' with the exact secret string or env variable your login route uses!
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    req.user = verified; 
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or Expired Token" });
  }
};

// POST ROUTE FOR ADDING TO CART
router.post('/add', verifyToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Safety checks: Fallback to catch all common user ID names inside your JWT payload structure
    const userId = req.user._id || req.user.id || req.user.userId;

    if (!userId) {
      return res.status(400).json({ message: "User context validation failed: ID missing from token properties" });
    }

    // 1. Look up existing database cart structure for this user
    let cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      // 2. Create a clean container if first-time generation setup
      cart = new Cart({
        userId: userId,
        items: [{ productId, quantity: Number(quantity) }]
      });
    } else {
      // 3. Look to see if the product item matching index array already exists
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId.toString());

      if (itemIndex > -1) {
        // Increment quantity value safely
        cart.items[itemIndex].quantity += Number(quantity);
      } else {
        // Drop product item setup clean into items array tracker
        cart.items.push({ productId, quantity: Number(quantity) });
      }
    }

    // Save and send response data structure back to frontend layout context
    const savedCart = await cart.save();
    return res.status(200).json(savedCart);

  } catch (error) {
    console.error("Backend Error on Add to Cart:", error);
    // Prevents breaking the server connection loop process
    return res.status(500).json({ message: "Internal Server Processing Error", error: error.message });
  }
});

module.exports = router;