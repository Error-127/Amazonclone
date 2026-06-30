// server/models/cart.js
import mongoose from 'mongoose';

// Define the schema structure for individual item objects inside the array
const CartItemSchema = new mongoose.Schema({
  productId: { 
    type: String, 
    required: true 
  },
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  image: { 
    type: String, 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true, 
    default: 1, 
    min: [1, 'Quantity cannot be less than 1'] 
  }
}, { _id: false }); // Stops Mongoose from cluttering your items with random sub-IDs

// Define the master Cart document structure
const CartSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true // One unique user account gets exactly one cart document
  },
  items: [CartItemSchema] // Embeds your product item matrix layout array
}, { 
  timestamps: true // Automatically tracks createdAt and updatedAt operations
});

// ⚡ ES MODULE EXPORT: Replaces module.exports to match your index.js architecture!
export default mongoose.model('Cart', CartSchema);