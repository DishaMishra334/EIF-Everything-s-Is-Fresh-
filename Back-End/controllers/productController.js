// backend/controllers/productController.js

import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js';

// Configuration for Cloudinary is assumed to be done elsewhere in the app.

const addProduct = async (req, res) => {
    console.log("Incoming req.files:", req.files);
    console.log("Incoming req.body:", req.body);

    try {
        const { name, description, category, bestseller } = req.body;

        let receivedVariants = req.body.variants;
        let parsedVariants = [];

        // Handle variants parsing
        if (typeof receivedVariants === 'string') {
            try {
                parsedVariants = JSON.parse(receivedVariants);
            } catch (e) {
                console.error("Error parsing variants JSON string:", e);
                return res.status(400).json({ success: false, message: "Invalid variants data format." });
            }
        } else if (Array.isArray(receivedVariants)) {
            parsedVariants = receivedVariants;
        } else {
            const baseNewPrice = Number(req.body.new_price || req.body.price);
            const baseOldPrice = Number(req.body.old_price || 0);

            if (isNaN(baseNewPrice) || baseNewPrice <= 0) {
                return res.status(400).json({ success: false, message: "A valid base price (new_price) is required." });
            }

            parsedVariants = [
                { size: "1kg", new_price: baseNewPrice, old_price: baseOldPrice },
                { size: "2kg", new_price: Math.round(baseNewPrice * 1.8), old_price: Math.round(baseOldPrice * 1.8) },
                { size: "5kg", new_price: Math.round(baseNewPrice * 4.0), old_price: Math.round(baseOldPrice * 4.0) }
            ];
            console.warn("No 'variants' array found in request body. Creating multiple default variants with scaled prices.");
        }

        if (!Array.isArray(parsedVariants) || parsedVariants.length === 0) {
            return res.status(400).json({ success: false, message: "No variants provided or variants array is empty." });
        }

        const validatedVariants = parsedVariants.map(variant => {
            if (!variant.size || !variant.new_price) {
                throw new Error("Each variant must have 'size' and 'new_price'.");
            }
            return {
                size: String(variant.size),
                new_price: Number(variant.new_price),
                old_price: Number(variant.old_price || 0)
            };
        });

        // ⭐ THIS SECTION CORRECTLY HANDLES THE CLOUDINARY UPLOAD
        // It takes the temporary file path from multer and sends it to Cloudinary
        const filesToUpload = Object.values(req.files).flat();
        console.log("Files found for upload:", filesToUpload);

        let imagesURL = [];
        if (filesToUpload.length > 0) {
            imagesURL = await Promise.all(
                filesToUpload.map(async (file) => {
                    try {
                        let result = await cloudinary.uploader.upload(file.path, { resource_type: 'image' });
                        return result.secure_url;
                    } catch (uploadError) {
                        console.error(`Failed to upload file ${file.originalname}:`, uploadError);
                        return null; 
                    }
                })
            );
            imagesURL = imagesURL.filter(url => url !== null);
        }

        if (imagesURL.length === 0) {
            console.warn("No images were successfully uploaded for this product.");
        }

        const productData = {
            name,
            description,
            category,
            variants: validatedVariants,
            bestseller: bestseller === "true",
            image: imagesURL, // This field is correctly set as an array of URLs
            date: Date.now()
        };

        console.log("Final productData for DB:", productData);

        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: "Product added successfully!" });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

const listProduct = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ success: true, products });
    } catch (error) {
        console.error("Error listing products:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product Removed" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await productModel.findById(productId);
        res.json({ success: true, product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

export { listProduct, addProduct, removeProduct, singleProduct };