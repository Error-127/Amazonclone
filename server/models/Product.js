import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: Number, // Ensure this is present
  title: String,
  description: String,
  price: Number,
  discountPercentage: Number,
  rating: Number,
  stock: Number,
  brand: String,
  category: String,
  thumbnail: String,
  image: String,
  images: [String]
}, { collection: 'products' }); // Ensure the collection name is exact

export default mongoose.model('Product', productSchema);