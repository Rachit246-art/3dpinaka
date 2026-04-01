import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: String, required: true },
  oldPrice: { type: String },
  category: { type: String, required: true },
  image: { type: String, required: true },
  stars: { type: String, default: '★★★★★ (5.0)' },
  badge: { type: String },
  badgeStyle: { type: Object },
  inStock: { type: Boolean, default: true },
  brand: { type: String, required: true },
  specs: [{ label: String, value: String }],
  description: { type: String }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
