// backend/models/productModel.js
import mongoose from 'mongoose';

// Define the schema for a single product variant
const variantSchema = new mongoose.Schema({
    size: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        default: 0,
    },
});

// Define the main product schema
const productSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    // The image field is now an array of strings to store multiple URLs
    image: {
        type: [String],
        default: [], // Default to an empty array
    },
    // The variants field is an array of variantSchema objects
    variants: {
        type: [variantSchema],
        required: true,
    },
    bestseller: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

// Create the Product model from the schema
const productModel = mongoose.model('product', productSchema);

export default productModel;
