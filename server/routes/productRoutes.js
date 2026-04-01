import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { brand, category, minPrice, maxPrice } = req.query;
    let query = {};

    if (brand) query.brand = brand;
    if (category) query.category = category;
    
    // Price filtering might be tricky with ₹ symbol in strings
    // In production, we'd store numerals, but for the migration, we'll keep it simple
    
    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Seed data
router.post('/seed', async (req, res) => {
  try {
    // Delete existing products for full re-seed (optional)
    // await Product.deleteMany({});
    const products = await Product.insertMany(req.body);
    res.status(201).json(products);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
