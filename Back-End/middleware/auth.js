import jwt from 'jsonwebtoken';
import userModel from "../models/userModel.js";

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.token;
        console.log("Auth middleware called. Token received:", token);

        if (!token) {
            console.error("No token provided.");
            return res.status(401).json({ success: false, message: "Not Authorized, Login Again." });
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token decoded successfully:", token_decode);
 
        const userId = token_decode.id;

        // ⭐ CRITICAL FIX: Check if the user exists in the database 
        const user = await userModel.findById(userId);
        if (!user) {
            console.error("User not found for ID:", userId);
            // Returning a 404 with a specific message is more helpful
            return res.status(404).json({ success: false, message: "User not found for the provided token" });
        }
        
        req.userId = userId;
        next();
    } catch (error) {
        console.error("Authentication Error:", error);
        // ⭐ CRITICAL FIX: Add specific error handling for different JWT errors
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ success: false, message: "Invalid token. Please login again." });
        } else if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ success: false, message: "Token expired. Please login again." });
        }
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
export default authMiddleware;
