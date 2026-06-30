import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']); 

import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import Product from './models/Product.js';
import User from './models/User.js';
import Cart from './models/cart.js'; 
import adminRoutes from './routes/adminRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_amazon_key_123";

// --- Middleware ---
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: "Access denied." });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token." });
  }
};

app.use('/admin', adminRoutes);

// --- Auth Routes ---
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered!" });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: "Login successful!", token });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

// --- Product Routes ---
app.get('/products', async (req, res) => {
  try {
    const allProducts = await Product.find({});
    res.status(200).json(allProducts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let product = null;

    if (/^\d+$/.test(id)) {
      product = await Product.findOne({ id: Number(id) });
    }
    if (!product && mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    }
    
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// --- Cart Routes ---
app.get('/cart', verifyToken, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    res.status(200).json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ message: "Error reading cart", error: error.message });
  }
});

// FIXED: Now fetches product details from the database automatically using the productId
app.post('/cart/add', verifyToken, async (req, res) => {
  const { productId, quantity } = req.body;
  
  try {
    if (!productId) {
      return res.status(400).json({ message: "Product ID is missing from payload" });
    }

    // 1. Find product details securely in database
    let product = null;
    if (/^\d+$/.test(productId)) {
      product = await Product.findOne({ id: Number(productId) });
    }
    if (!product && mongoose.Types.ObjectId.isValid(productId)) {
      product = await Product.findById(productId);
    }

    if (!product) {
      return res.status(404).json({ message: "Cannot add to cart. Product not found." });
    }

    // 2. Fetch or create cart instance
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] });
    }

    // 3. Check if entry already exists in current user tracking array
    const itemIndex = cart.items.findIndex(item => String(item.productId) === String(productId));

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += (Number(quantity) || 1);
    } else {
      // Uses the structural database attributes looked up on the backend directly
      cart.items.push({ 
        productId: String(productId), 
        title: product.title, 
        price: product.price, 
        image: product.image || product.thumbnail, 
        quantity: Number(quantity) || 1 
      });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Cart insertion crash details:", error);
    res.status(500).json({ message: "Error adding to cart", error: error.message });
  }
});

app.put('/cart/update', verifyToken, async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    const item = cart.items.find(i => String(i.productId) === String(productId));
    if (item) {
      item.quantity = quantity;
      await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete('/cart/remove/:productId', verifyToken, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    cart.items = cart.items.filter(i => String(i.productId) !== String(req.params.productId));
    await cart.save();
    res.status(200).json(cart);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas! 🎉");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.error("Database connection failed ❌:", error));