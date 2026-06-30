// server/routes/adminRoutes.js
import express from 'express';
import axios from 'axios';
import Product from '../models/Product.js';

const router = express.Router();

// 🛒 POST /admin/seed - Completely seeds 100 products matching all API fields
router.post('/seed', async (req, res) => {
  try {
    // 1. Wipe collection clean
    await Product.deleteMany({});

    // 2. Fetch data directly from the external resource
    const response = await axios.get('https://dummyjson.com/products?limit=100');
    const externalProducts = response.data.products;

    // 3. Map all incoming fields down cleanly
    const formattedProducts = externalProducts.map(product => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: Math.round(product.price * 83), // Converts baseline USD value to approximate Indian Rupees (₹)
      discountPercentage: product.discountPercentage,
      rating: product.rating,
      stock: product.stock,
      brand: product.brand || "Generic",
      category: product.category,
      thumbnail: product.thumbnail,
      image: product.thumbnail, // Doubled mapping variant to prevent breaks on legacy frontend queries
      images: product.images     // Saves the complete secondary images string array elements
    }));

    // 4. Batch commit the structured documents to your database cluster
    await Product.insertMany(formattedProducts);

    // 5. Send confirmation payload matching explicit requirements
    res.status(201).json({
      message: "100 products inserted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An internal seeder exception handler flag occurred.",
      error: error.message
    });
  }
});

export default router;