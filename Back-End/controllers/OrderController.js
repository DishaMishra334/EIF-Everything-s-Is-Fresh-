// backend/controllers/orderController.js

import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from '../models/productModel.js';
import Stripe from 'stripe';
import Razorpay from 'razorpay'; // ⭐ NEW: Import Razorpay

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ⭐ NEW: Initialize Razorpay with your Key ID and Key Secret



// Place an order for a user
const placeOrder = async (req, res) => {
    try {
        const userId = req.userId;
        const { items, amount, address, paymentMethod, paymentStatus } = req.body;
        
        console.log("Placing order for userId:", userId);
        console.log("Order body received:", req.body);

        if (!userId) {
            return res.json({ success: false, message: "User not authenticated. No userId found in request." });
        }
        
        if (!items || items.length === 0) { 
            console.error("Attempted to place an order with an empty cart. Items received:", items);
            return res.json({ success: false, message: "Cannot place an order with no items." });
        }
        
        console.log("Items to be saved:", items);

        const newOrder = new orderModel({
            userId: userId, 
            items,
            amount,
            address,
            paymentMethod,
            paymentStatus: paymentStatus || "Pending",
        });

        try {
            const savedOrder = await newOrder.save();
            console.log("Order successfully saved to database:", savedOrder);

            const user = await userModel.findById(userId);
            if (user) {
                user.cartData = {};
                await user.save();
            }

            res.json({ success: true, message: "Order Placed Successfully" });
        } catch (saveError) {
            console.error("Error saving new order to the database:", saveError);
            console.error("Mongoose validation errors:", saveError.errors);
            res.json({ success: false, message: "Error saving order to database: " + saveError.message });
        }
    } catch (error) {
        console.error("Error in placeOrder function:", error);
        res.json({ success: false, message: "Error in placeOrder function: " + error.message });
    }
};

// Function to create a Stripe Payment Intent (existing)
const createPaymentIntent = async (req, res) => {
    const { amount, currency } = req.body;
    console.log(`Creating Stripe Payment Intent for amount: ${amount} ${currency}`);

    if (!amount || !currency) {
        return res.status(400).json({ success: false, message: "Amount and currency are required." });
    }

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // Amount in cents
            currency: currency,
            metadata: { integration_check: 'accept_a_payment' },
        });
        console.log("Stripe Payment Intent created:", paymentIntent.id);
        res.json({ success: true, clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Error creating Stripe Payment Intent:", error.message);
        res.status(500).json({ success: false, message: "Failed to create Stripe payment intent: " + error.message });
    }
};

// ⭐ NEW: Function to create a Razorpay Order
const createRazorpayOrder = async (req, res) => {
    const { amount, currency } = req.body;
    console.log(`Creating Razorpay Order for amount: ${amount} ${currency}`);

    if (!amount || !currency) {
        return res.status(400).json({ success: false, message: "Amount and currency are required." });
    }

    const options = {
        amount: Math.round(amount * 100), // Razorpay expects amount in paisa (cents)
        currency: currency,
        receipt: `receipt_${Date.now()}`, // Unique receipt ID
        payment_capture: 1 // Auto capture payment
    };

    try {
        const order = await razorpay.orders.create(options);
        console.log("Razorpay Order created:", order.id);
        res.json({ success: true, orderId: order.id, amount: order.amount, currency: order.currency });
    } catch (error) {
        console.error("Error creating Razorpay Order:", error.message);
        res.status(500).json({ success: false, message: "Failed to create Razorpay order: " + error.message });
    }
};


// Logic to get user orders (existing)
const getUserOrders = async (req, res) => {
    try {
        const userId = req.userId;
        console.log("Fetching orders for userId:", userId);
        if (!userId) {
            return res.json({ success: false, message: "User not authenticated. No userId found in request." });
        }
        const orders = await orderModel.find({ userId: userId })
                                       .populate({
                                           path: 'items.productId',
                                           model: productModel,
                                           select: 'name price image variants' 
                                       })
                                       .sort({ date: -1 });
        console.log("Populated orders found in database:", JSON.stringify(orders, null, 2));
        const sanitizedOrders = orders.map(order => ({
            ...order.toObject(),
            items: order.items.map(item => {
                let productId = item.productId; 
                if (!productId || typeof productId !== 'object' || !productId.name) {
                    productId = {
                        name: "Unknown Product",
                        price: 0, 
                        image: ['https://placehold.co/100x100/A0A0A0/FFFFFF?text=No+Image'],
                        variants: [] 
                    };
                } else {
                    productId = productId.toObject(); 
                    if (!productId.image || productId.image.length === 0) {
                        productId.image = ['https://placehold.co/100x100/A0A0A0/FFFFFF?text=No+Image'];
                    } else if (!Array.isArray(productId.image)) { 
                        productId.image = [productId.image];
                    }
                    if (!productId.variants) { 
                        productId.variants = [];
                    }
                }
                return {
                    ...item.toObject(),
                    productId: productId 
                };
            })
        }));
        res.json({ success: true, data: sanitizedOrders });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.json({ success: false, message: "Error fetching user orders: " + error.message });
    }
};

// List all orders for the admin panel (existing)
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
                                       .populate({
                                           path: 'items.productId',
                                           model: productModel,
                                           select: 'name price image variants' 
                                       })
                                       .sort({ date: -1 });
        console.log("Admin list orders populated data:", JSON.stringify(orders, null, 2));
        const sanitizedOrders = orders.map(order => ({
            ...order.toObject(),
            items: order.items.map(item => {
                let productId = item.productId;
                if (!productId || typeof productId !== 'object' || !productId.name) {
                    productId = {
                        name: "Unknown Product",
                        price: 0,
                        image: ['https://placehold.co/100x100/A0A0A0/FFFFFF?text=No+Image'],
                        variants: []
                    };
                } else {
                    productId = productId.toObject();
                    if (!productId.image || productId.image.length === 0) {
                        productId.image = ['https://placehold.co/100x100/A0A0A0/FFFFFF?text=No+Image'];
                    } else if (!Array.isArray(productId.image)) {
                        productId.image = [productId.image];
                    }
                    if (!productId.variants) {
                        productId.variants = [];
                    }
                }
                return {
                    ...item.toObject(),
                    productId: productId
                };
            })
        }));
        res.json({ success: true, data: sanitizedOrders });
    } catch (error) {
        console.error("Error listing all orders:", error);
        res.json({ success: false, message: "Error listing orders" });
    }
};

// Update the status of an order (existing)
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.json({ success: false, message: "Error updating status" });
    }
};

export { placeOrder, getUserOrders, listOrders, updateStatus, createPaymentIntent, createRazorpayOrder }; // ⭐ NEW: Export createRazorpayOrder
