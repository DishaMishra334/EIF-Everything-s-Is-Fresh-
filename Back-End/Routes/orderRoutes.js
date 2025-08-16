// backend/Routes/orderRoutes.js

import express from 'express';
// ⭐ NEW: Import createRazorpayOrder
import { placeOrder, listOrders, updateStatus, createPaymentIntent, createRazorpayOrder } from '../controllers/OrderController.js'; 
import authMiddleware from '../middleware/auth.js'; 
import adminAuth from '../middleware/adminAuth.js'; 

const orderRouter = express.Router();

orderRouter.post('/place', authMiddleware, placeOrder);
orderRouter.get('/list', adminAuth, listOrders); 
orderRouter.post('/updateStatus', adminAuth, updateStatus);
orderRouter.post('/create-payment-intent', authMiddleware, createPaymentIntent);

// ⭐ NEW: Route to create a Razorpay Order
orderRouter.post('/create-razorpay-order', authMiddleware, createRazorpayOrder);

export default orderRouter;
