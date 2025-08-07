import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import { assets } from '../assets/assets';

// Helper function to generate unique IDs for reviews (for local storage simulation)
const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// CRITICAL FIX: Placeholder image now uses an SVG data URI.
// This is a self-contained image that does not rely on an external network request,
// which prevents "Failed to load resource" errors seen with some placeholder services.
const PLACEHOLDER_IMAGE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="100%" height="100%" fill="%23e0e0e0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="%23757575">No Image</text></svg>';

const Producte = () => {
    const { ProducteID } = useParams();
    const { products, currency, addToCart } = useContext(ShopContext);
    const [productData, setProductData] = useState(null);
    const [mainImage, setMainImage] = useState(PLACEHOLDER_IMAGE);
    const [selectedQuantity, setSelectedQuantity] = useState('');
    const [displayPrice, setDisplayPrice] = useState(0);

    // --- New States for Reviews ---
    const [reviews, setReviews] = useState([]);
    const [reviewerName, setReviewerName] = useState('');
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [showReviewForm, setShowReviewForm] = useState(false);

    // --- New State for Related Products ---
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        const foundProduct = products.find(item => item._id === ProducteID);
        if (foundProduct) {
            setProductData(foundProduct);

            // CRITICAL FIX: Check if the image array exists and has at least one item.
            // If you are still seeing "No Image", please check your backend data for this product.
            // The 'image' array should contain at least one valid image URL.
            console.log("Product image data:", foundProduct.image);
            if (foundProduct.image && foundProduct.image.length > 0) {
                setMainImage(foundProduct.image[0]);
            } else {
                // If no image is available, set the placeholder image
                setMainImage(PLACEHOLDER_IMAGE);
            }

            // --- CRITICAL FIX HERE: Set initial quantity and price from variants ---
            if (foundProduct.variants && foundProduct.variants.length > 0) {
                const initialVariant = foundProduct.variants[0]; // Take the first variant as default
                setSelectedQuantity(initialVariant.size);
                setDisplayPrice(initialVariant.new_price);
            } else {
                setSelectedQuantity('');
                setDisplayPrice(0);
                console.warn(`Product ${foundProduct.name} (ID: ${foundProduct._id}) has no 'variants' array. Price will be 0.`);
            }
            // --- END CRITICAL FIX ---

            // --- Load reviews from local storage for this product ---
            try {
                const storedReviews = JSON.parse(localStorage.getItem(`reviews_${ProducteID}`)) || [];
                setReviews(storedReviews);
            } catch (error) {
                console.error("Failed to parse reviews from local storage:", error);
                setReviews([]);
            }

            // --- Filter related products ---
            const filteredRelated = products
                .filter(item => item._id !== ProducteID && item.category === foundProduct.category)
                .sort(() => 0.5 - Math.random())
                .slice(0, 4);
            setRelatedProducts(filteredRelated);

        } else {
            setProductData(null);
            setMainImage(PLACEHOLDER_IMAGE);
            setReviews([]);
            setRelatedProducts([]);
        }
    }, [ProducteID, products]); // Re-run when ProductID or products change

    // This useEffect updates the price ONLY when selectedQuantity or productData changes
    useEffect(() => {
        if (productData && selectedQuantity) {
            const selectedVariant = productData.variants.find(
                (variant) => variant.size === selectedQuantity
            );
            if (selectedVariant) {
                setDisplayPrice(selectedVariant.new_price);
            } else {
                setDisplayPrice(0); // If no variant matches the selected quantity
            }
        }
    }, [selectedQuantity, productData]); // Dependencies for this useEffect

    const handleQuantityChange = (event) => {
        setSelectedQuantity(event.target.value);
        // Price update is now handled by the separate useEffect above
    };

    const handleAddToCart = () => {
        if (productData && selectedQuantity) { // Ensure both are selected
            addToCart(productData._id, selectedQuantity);
            console.log(`${selectedQuantity} of ${productData.name} added to cart!`);
        } else {
            console.warn('Please select a quantity before adding to cart.');
        }
    };

    // --- Functions for Reviews ---
    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (!reviewerName || !reviewComment || reviewRating === 0) {
            console.error('Please fill in all review fields and give a rating.');
            return;
        }

        const newReview = {
            id: generateUniqueId(),
            name: reviewerName,
            rating: reviewRating,
            comment: reviewComment,
            date: new Date().toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
        };

        const updatedReviews = [...reviews, newReview];
        setReviews(updatedReviews);
        localStorage.setItem(`reviews_${ProducteID}`, JSON.stringify(updatedReviews));

        setReviewerName('');
        setReviewRating(0);
        setReviewComment('');
        setShowReviewForm(false);
        console.log('Your review has been submitted!');
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            if (i < rating) {
                stars.push(<img key={i} src={assets.star_icon} alt="star" className="w-4 h-4" />);
            } else {
                stars.push(<img key={i} src={assets.star_dull_icon} alt="dull star" className="w-4 h-4" />);
            }
        }
        return stars;
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
        : 'N/A';

    if (!productData) {
        // Render a loading state or a "not found" message
        return <div className='p-4 text-center text-lg text-gray-500'>Product Not Found or Loading...</div>;
    }

    return (
        <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100 px-4 sm:px-0'>
            {/* Product Data Section */}
            <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
                {/* Product Images */}
                <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
                    <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
                        {/* CRITICAL FIX: Ensure productData.image exists before mapping */}
                        {productData.image && productData.image.length > 0 ? (
                            productData.image.map((item, index) => (
                                <img
                                    onClick={() => setMainImage(item)}
                                    src={item}
                                    key={index}
                                    className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer border-2 border-transparent hover:border-orange-500 transition-all duration-200'
                                    alt={`Product thumbnail ${index + 1}`}
                                />
                            ))
                        ) : (
                             // Display a single placeholder if no images are available
                            <img
                                src={PLACEHOLDER_IMAGE}
                                className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer border-2 border-transparent'
                                alt='No image available'
                            />
                        )}
                    </div>
                    <div className='w-full sm:w-[80%] flex justify-center items-center'>
                        <img className='w-auto h-auto max-w-full max-h-96 object-contain' src={mainImage} alt={productData.name} />
                    </div>
                </div>

                {/* Product Info */}
                <div className='flex-1 p-4 sm:p-0'>
                    <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
                    <div className='flex items-center gap-1 mt-2'>
                        {renderStars(Math.round(averageRating))}
                        <p className='pl-2'>({reviews.length} Reviews)</p>
                        {reviews.length > 0 && <p className='pl-2 text-gray-600'>Average: {averageRating}/5</p>}
                    </div>

                    {/* Quantity Selection */}
                    <div className='mt-5'>
                        <h3 className='font-semibold text-lg mb-2'>Select Quantity:</h3>
                        <div className='flex gap-4 flex-wrap'>
                            {/* Dynamically render quantity options from productData.variants */}
                            {productData.variants && productData.variants.length > 0 ? (
                                productData.variants.map((variant) => (
                                    <label key={variant.size} className='flex items-center cursor-pointer'>
                                        <input
                                            type='radio'
                                            name='quantity'
                                            value={variant.size} // Use variant.size as the value
                                            checked={selectedQuantity === variant.size}
                                            onChange={handleQuantityChange}
                                            className='mr-2 accent-orange-500'
                                        />
                                        <span className='text-lg'>{variant.size}</span>
                                    </label>
                                ))
                            ) : (
                                <p className="text-red-500">No quantity options available.</p>
                            )}
                        </div>
                    </div>

                    {/* Price based on selected quantity */}
                    <p className='mt-5 text-3xl font-medium'>{currency}{displayPrice.toFixed(2)}</p>
                    <p className='mt-5 text-gray-800 md:w-4/5'>{productData.description}</p>

                    {/* Add to Cart Button */}
                    <button
                        onClick={handleAddToCart}
                        className='mt-8 py-3 px-6 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-200 text-lg font-medium'
                    >
                        ADD TO CART
                    </button>

                    {/* Additional Product Info */}
                    <div className='mt-8 text-gray-700'>
                        <p className='mb-2'><strong className='font-semibold'>Quality:</strong> 100% Organic Product</p>
                        <p className='mb-2'><strong className='font-semibold'>Payment:</strong> Cash on delivery is available on this product</p>
                        <p><strong className='font-semibold'>Returns:</strong> Easy return and exchange policy within 24hr</p>
                    </div>
                </div>
            </div>

            {/* Customer Reviews Section */}
            <div className='mt-16'>
                <h2 className='text-3xl font-bold mb-6 text-center'>Customer Reviews</h2>

                {/* Review Summary */}
                {reviews.length > 0 && (
                    <div className='text-center mb-8'>
                        <p className='text-xl'>Overall Rating: <span className='font-bold text-orange-500'>{averageRating}/5</span> based on {reviews.length} reviews</p>
                        <div className='flex justify-center mt-2'>
                            {renderStars(Math.round(averageRating))}
                        </div>
                    </div>
                )}

                {/* List of Reviews */}
                {reviews.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {reviews.map((review) => (
                            <div key={review.id} className='bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200'>
                                <div className='flex items-center justify-between mb-3'>
                                    <p className='font-semibold text-lg text-gray-800'>{review.name}</p>
                                    <div className='flex'>{renderStars(review.rating)}</div>
                                </div>
                                <p className='text-sm text-gray-600 mb-3'>{review.date}</p>
                                <p className='text-gray-700 leading-relaxed'>{review.comment}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className='text-center text-gray-600 text-lg'>No reviews yet. Be the first to review this product!</p>
                )}

                {/* Write a Review Button/Form Toggle */}
                <div className='mt-10 text-center'>
                    <button
                        onClick={() => setShowReviewForm(!showReviewForm)}
                        className='py-3 px-8 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 text-lg font-medium'
                    >
                        {showReviewForm ? 'Hide Review Form' : 'Write a Review'}
                    </button>
                </div>

                {/* Review Submission Form */}
                {showReviewForm && (
                    <div className='mt-8 bg-white p-8 rounded-lg shadow-lg border border-gray-200 max-w-2xl mx-auto'>
                        <h3 className='text-2xl font-bold mb-6 text-center'>Submit Your Review</h3>
                        <form onSubmit={handleReviewSubmit} className='space-y-6'>
                            <div>
                                <label htmlFor='reviewerName' className='block text-gray-700 text-sm font-semibold mb-2'>Your Name:</label>
                                <input
                                    type='text'
                                    id='reviewerName'
                                    value={reviewerName}
                                    onChange={(e) => setReviewerName(e.target.value)}
                                    className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500'
                                    required
                                />
                            </div>
                            <div>
                                <label className='block text-gray-700 text-sm font-semibold mb-2'>Rating:</label>
                                <div className='flex items-center gap-1'>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <img
                                            key={star}
                                            src={star <= reviewRating ? assets.star_icon : assets.star_dull_icon}
                                            alt={`star ${star}`}
                                            className='w-8 h-8 cursor-pointer'
                                            onClick={() => setReviewRating(star)}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label htmlFor='reviewComment' className='block text-gray-700 text-sm font-semibold mb-2'>Your Comment:</label>
                                <textarea
                                    id='reviewComment'
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    rows='5'
                                    className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-y'
                                    required
                                ></textarea>
                            </div>
                            <button
                                type='submit'
                                className='w-full py-3 px-6 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-200 text-lg font-medium'
                            >
                                Submit Review
                            </button>
                        </form>
                    </div>
                )}
            </div>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <div className='mt-16'>
                    <h2 className='text-3xl font-bold mb-8 text-center'>Related Products</h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                        {relatedProducts.map((item) => (
                            <Link to={`/product/${item._id}`} key={item._id} className='block group'>
                                <div className='bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden'>
                                    <div className='relative w-full h-48 sm:h-56 overflow-hidden'>
                                        {/* CRITICAL FIX: Add a check for the related product image */}
                                        {/* This ensures the placeholder is used if the image array is empty or missing in the related product data */}
                                        {item.image && item.image.length > 0 ? (
                                            <img src={item.image[0]} alt={item.name} className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300' />
                                        ) : (
                                            <img src={PLACEHOLDER_IMAGE} alt='No image available' className='w-full h-full object-cover' />
                                        )}
                                    </div>
                                    <div className='p-4'>
                                        <h3 className='font-semibold text-lg text-gray-900 group-hover:text-orange-600 transition-colors duration-200'>{item.name}</h3>
                                        {/* Display price range or default variant price for related products */}
                                        {item.variants && item.variants.length > 0 && (
                                            <p className='text-gray-700 mt-1'>
                                                {currency} {item.variants[0].new_price.toFixed(2)} onwards
                                            </p>
                                        )}
                                        {/* Fallback if no variants are defined for related products */}
                                        {!item.variants || item.variants.length === 0 && (
                                            <p className='text-red-500 text-sm mt-1'>Price not available</p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Producte;
