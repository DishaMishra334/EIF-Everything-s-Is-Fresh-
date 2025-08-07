// Componet/Productitem.jsx
import React, { useContext } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { Link } from 'react-router-dom';

// ⭐ IMPORTANT CHANGE: Accept 'product' object instead of individual props
const Productitem = ({ product }) => {
    const { currency } = useContext(ShopContext);

    // Defensive Check 1: Ensure 'product' prop is valid
    if (!product || typeof product !== 'object' || !product._id) {
        console.warn("Productitem received an invalid or incomplete product prop:", product);
        return null; // Don't render if product data is fundamentally broken
    }

    // Function to find the lowest price among variants
    const getLowestPrice = (variants) => {
        // Defensive Check 2: Ensure 'variants' is an array and not empty
        if (!variants || !Array.isArray(variants) || variants.length === 0) {
            return null; // No valid variants, so no price to derive
        }

        // Map to just the new_price, then find the minimum
        // Ensure new_price is a number; if not, filter it out or convert it
        const prices = variants
            .map(variant => parseFloat(variant.new_price)) // Convert to float
            .filter(price => !isNaN(price)); // Remove any non-numeric results

        if (prices.length === 0) {
            return null; // No valid prices found after filtering
        }
        return Math.min(...prices);
    };

    // This line accesses product.variants to get the lowest price
    const lowestPrice = getLowestPrice(product.variants);

    return (
        <Link className='text-gray-700 cursor-pointer ' to={`/product/${product._id}`} > {/* ⭐ Use product._id */}
            <div className='overflow-hidden'>
                {/* Defensive Check 3: Ensure image array exists and has elements */}
                <img
                    className='hover:scale-110 transition ease-in-out'
                    src={(product.image && product.image.length > 0) ? product.image[0] : 'https://via.placeholder.com/150?text=No+Image'} // Fallback image
                    alt={product.name || 'Product Image'} // Fallback for alt text
                />
            </div>
            {/* Defensive Check 4: Ensure product.name exists */}
            <p className='pt-3 pb-1 text-sm'>{product.name || 'Unknown Product'}</p> {/* ⭐ Use product.name */}
            <p className='text-sm font-medium'>
                {currency}{' '} {/* Add a space after currency for better readability */}
                {/* Display the lowest price or a friendly message */}
                {lowestPrice !== null ? lowestPrice.toFixed(2) : 'N/A'}
            </p>
        </Link>
    );
};

export default Productitem;