// backend/controllers/userController.js

import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import orderModel from '../models/orderModel.js';
import productModel from '../models/productModel.js'; 

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Logic for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.json({ success: false, message: error.message });
    }
};

// Logic for user registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exist" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password (minimum 8 characters)" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });

        const user = await newUser.save();

        const token = createToken(user._id);

        res.json({ success: true, token });

    } catch (error) {
        console.error("Registration Error:", error);
        res.json({ success: false, message: error.message });
    }
};

// Place an order for a user
const placeOrder = async (req, res) => {
    try {
        const userId = req.userId;
        const { items, amount, address, paymentMethod } = req.body;
        
        console.log("Placing order for userId:", userId);
        console.log("Order body received:", req.body);

        if (!userId) {
            return res.json({ success: false, message: "User not authenticated. No userId found in request." });
        }
        
        if (!items || items.length === 0) { 
            console.error("Attempted to place an order with an empty cart.");
            return res.json({ success: false, message: "Cannot place an order with no items." });
        }

        const correctedAddress = { ...address, zipcode: address.zipCode };
        delete correctedAddress.zipCode;

        const newOrder = new orderModel({
            userId: userId, 
            items,
            amount,
            address: correctedAddress,
            paymentMethod,
            paymentStatus: "Pending",
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

// Logic for admin login
const adminlogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email: email }, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Admin Login Error:", error);
        res.json({ success: false, message: error.message });
    }
};

// Logic to get user orders
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
                                         select: 'name price image'
                                     })
                                     .sort({ date: -1 });

        console.log("Populated orders found in database:", orders);

        // ⭐ FIX: Handle cases where product data is missing or image URL is empty
        const sanitizedOrders = orders.map(order => ({
            ...order.toObject(),
            items: order.items.map(item => {
                let productId = item.productId;
                
                // If the product was not found or populated correctly, create a default object
                if (!productId || typeof productId.toObject !== 'function') {
                    productId = {
                        name: "Unknown Product",
                        price: "N/A",
                        image: 'https://placehold.co/100x100/A0A0A0/FFFFFF?text=No+Image'
                    };
                } else {
                    // Convert Mongoose sub-document to a plain object
                    productId = productId.toObject();

                    // Check if the image field is empty and replace with a placeholder
                    if (productId.image === "" || !productId.image) {
                        productId.image = 'https://placehold.co/100x100/A0A0A0/FFFFFF?text=No+Image';
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

export { loginUser, registerUser, adminlogin, placeOrder, getUserOrders };
