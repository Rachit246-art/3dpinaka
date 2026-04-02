import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// GET /api/orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/orders
router.post('/', async (req, res) => {
  try {
    const count = await Order.countDocuments();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ORD-${randomSuffix}`;

    const newOrder = new Order({
      ...req.body,
      orderId
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/orders/:id
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    let order;
    if (req.params.id.startsWith('ORD-')) {
        order = await Order.findOneAndUpdate({ orderId: req.params.id }, { status }, { new: true, runValidators: true });
    } else {
        order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    }

    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/orders/:id
router.delete('/:id', async (req, res) => {
  try {
    let order;
    if (req.params.id.startsWith('ORD-')) {
        order = await Order.findOneAndDelete({ orderId: req.params.id });
    } else {
        order = await Order.findByIdAndDelete(req.params.id);
    }
    
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
