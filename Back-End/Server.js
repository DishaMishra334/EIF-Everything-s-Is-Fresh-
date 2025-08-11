// backend/server.js

import express from 'express';
import cors from 'cors';
import 'dotenv/config'; // This loads environment variables from a .env file
import connectDB from './config/Mongodb.js';
import userRoutes from './Routes/userRoutes.js';
import productRoutes from './Routes/productRoutes.js';
import orderRoutes from './Routes/orderRoutes.js';
import cartRoutes from './Routes/cartRoutes.js';
import { v2 as cloudinary } from 'cloudinary'; // ⭐ IMPORTANT: Import Cloudinary here

// app config
const app = express();
const port = process.env.PORT || 4000;

// Database Connection
connectDB();

// Middlewares
app.use(express.json());
app.use(cors());

// ⭐ Cloudinary Configuration - THIS IS THE MISSING PIECE!
// It must be placed here to configure Cloudinary before routes use it.
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME, // Make sure this matches your .env variable name
    api_secret: process.env.CLOUDINARY_SECRET_KEY // Make sure this matches your .env variable name
});

// API Endpoints
app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes); // This route uses Cloudinary for image uploads
app.use('/api/order', orderRoutes);
app.use('/api/cart', cartRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.send("API Working");
});

// Start the server
app.listen(port, () => console.log('server started on PORT :' + port));


