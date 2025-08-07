// backend/controllers/cartController.js

import userModel from '../models/userModel.js';

const getCart = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.json({ success: false, message: "User not authenticated." });
        }
        
        let userData = await userModel.findById(userId);

        if (!userData) {
            return res.json({ success: false, message: "User not found for the provided token." });
        }

        res.json({ success: true, cartData: userData.cartData || {} });

    } catch (error) {
        console.error("Error in getCart controller:", error);
        res.json({ success: false, message: "Error fetching cart data." });
    }
};

const addToCart = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.json({ success: false, message: "User not authenticated." });
        }
        
        let userData = await userModel.findById(userId);
        
        if (!userData) {
            return res.json({ success: false, message: "User not found for the provided token." });
        }

        const { cartItems } = req.body;
        console.log("Backend received cartItems to sync:", cartItems);

        userData.cartData = cartItems;
        await userData.save();

        res.json({ success: true, message: "Cart synced successfully." });

    } catch (error) {
        console.error("Error in addToCart controller:", error);
        res.json({ success: false, message: "Error adding item to cart." });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.json({ success: false, message: "User not authenticated." });
        }
        
        let userData = await userModel.findById(userId);

        if (!userData) {
            return res.json({ success: false, message: "User not found for the provided token." });
        }

        let cartData = userData.cartData || {};
        const { itemId, size } = req.body;

        if (cartData[itemId] && cartData[itemId][size]) {
            cartData[itemId][size] -= 1;

            if (cartData[itemId][size] <= 0) {
                delete cartData[itemId][size];
                if (Object.keys(cartData[itemId]).length === 0) {
                    delete cartData[itemId];
                }
            }
        } else {
            return res.json({ success: true, message: "Item not found in cart or already removed." });
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: "Item removed from cart." });

    } catch (error) {
        console.error("Error in removeFromCart controller:", error);
        res.json({ success: false, message: "Error removing item from cart." });
    }
};

export { getCart, addToCart, removeFromCart };
