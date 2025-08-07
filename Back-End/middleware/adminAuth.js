import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        console.log('Authorization Header (raw):', authorization);

        // Trim the authorization string to remove any leading/trailing whitespace
        let processedAuthorization = authorization ? authorization.trim() : '';
``
        // Added robustness: Remove surrounding quotes if they exist from client input
        if (processedAuthorization.startsWith('"') && processedAuthorization.endsWith('"')) {
            processedAuthorization = processedAuthorization.slice(1, -1);
        }
        console.log('Authorization Header (processed):', processedAuthorization);

        // Debugging: Log character codes to confirm exact string content
        console.log('Char codes of processedAuthorization:', Array.from(processedAuthorization).map(char => char.charCodeAt(0)));
        console.log('Char codes of expected "Bearer ":', Array.from('Bearer ').map(char => char.charCodeAt(0)));
        console.log('Does it truly start with "Bearer "?', processedAuthorization.startsWith('Bearer '));

        if (!processedAuthorization || !processedAuthorization.startsWith('Bearer ')) {
            console.log('Failed Auth Check: No Bearer Token (after processing and startsWith check)');
            return res.json({ success: false, message: "No token provided, please log in again" });
        }

        const token = processedAuthorization.split(' ')[1];
        console.log('Extracted Token:', token);

        if (!token) {
            console.log('Failed Auth Check: Token empty after split');
            return res.json({ success: false, message: "No token provided, please log in again" });
        }

        // Verify the token
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', token_decode);

        // Check if the decoded email matches the admin email from environment variables
        if (token_decode.email !== process.env.ADMIN_EMAIL) {
            console.log('Failed Auth Check: Email Mismatch');
            return res.json({ success: false, message: "Not authorized as admin, please log in again" });
        }
        
        // If all checks pass, proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.log('Auth Error:', error); // This will log any JWT specific errors (e.g., JsonWebTokenError)
        if (error.name === 'JsonWebTokenError') {
            return res.json({ success: false, message: "Invalid token, please log in again" });
        }
        res.json({ success: false, message: error.message });
    }
};

export default adminAuth;