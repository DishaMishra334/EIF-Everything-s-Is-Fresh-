// backend/Routes/cartRoutes.js

import express from 'express';
import { getCart, addToCart, removeFromCart } from '../controllers/cartController.js';
import authMiddleware from '../middleware/auth.js';

const cartRouter = express.Router();

// Route to get the user's cart data
cartRouter.post('/get', authMiddleware, getCart);

// Route to add items to the cart
cartRouter.post('/add', authMiddleware, addToCart); // This route is what we're looking for

// Route to remove items from the cart
cartRouter.post('/remove', authMiddleware, removeFromCart);

export default cartRouter;
  