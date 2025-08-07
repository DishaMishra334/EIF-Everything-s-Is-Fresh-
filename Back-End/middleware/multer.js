import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Get directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        const uploadPath = path.join(__dirname, "../uploads");

        // Create uploads directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        callback(null, uploadPath);
    },
    filename: function (req, file, callback) {
        // Generate unique filename with original extension
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        callback(null, "product_" + uniqueSuffix + ext);
    },
});

// File filter for security
const fileFilter = (req, file, callback) => {
    // --- ADDED FOR DEBUGGING ---
    console.log("--- Multer File Filter Debug ---");
    console.log("File originalname:", file.originalname);
    console.log("File mimetype:", file.mimetype);
    console.log("-------------------------------");

    // More precise regex for allowed MIME types (e.g., "image/jpeg")
    // The 'i' flag makes it case-insensitive. Added 'avif'.
    const allowedMimeTypes = /image\/(jpeg|jpg|png|webp|avif)/i;

    // More precise regex for allowed file extensions (e.g., ".jpeg" at the end of the filename). Added 'avif'.
    const allowedExtensions = /\.(jpeg|jpg|png|webp|avif)$/i;

    const isMimeTypeAllowed = allowedMimeTypes.test(file.mimetype);
    const isExtensionAllowed = allowedExtensions.test(path.extname(file.originalname));

    // --- ADDED FOR DEBUGGING ---
    console.log("Is MIME Type Allowed:", isMimeTypeAllowed);
    console.log("Is Extension Allowed:", isExtensionAllowed);
    console.log("-------------------------------");


    if (isMimeTypeAllowed && isExtensionAllowed) {
        // If both mimetype and extension are allowed, accept the file
        return callback(null, true);
    } else {
        // Otherwise, reject the file with an error
        // Updated error message to reflect AVIF support
        callback(new Error("Only images are allowed (jpeg, jpg, png, webp, avif)"));
    }
};

const upload = multer({ 
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 4 // Maximum 4 files
    },
});

export default upload;