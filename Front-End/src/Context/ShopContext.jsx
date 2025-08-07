// frontend/context/ShopContext.jsx
import React, { createContext, useEffect, useState, useCallback } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const backendUrl = "http://localhost:4000";

    const currency = '₹';
    const delivery_fee = 0;
    const [serach, setSerach] = useState('');
    const [showSerach, setshowSerach] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const [userOrders, setUserOrders] = useState([]);

    const navigate = useNavigate();

    const loadCartData = useCallback(async (authToken) => {
        if (!authToken) {
            console.log("No token available to load cart data.");
            setCartItems({});
            return;
        }
        try {
            const response = await axios.post(backendUrl + "/api/cart/get", {}, { headers: { token: authToken } });
            if (response.data.success) {
                console.log("Cart data from backend:", response.data.cartData);
                setCartItems(response.data.cartData);
            } else {
                toast.error("Failed to load cart data: " + response.data.message);
                setCartItems({});
            }
        } catch (error) {
            console.error("Error loading cart data:", error);
            toast.error("Error loading cart data. Please try again.");
            setCartItems({});
        }
    }, [backendUrl, toast]);

    const updateCartOnServer = useCallback(async (updatedCart) => {
        if (!token) {
            console.log("Not logged in. Cart not synced with backend.");
            return;
        }
        try {
            await axios.post(backendUrl + "/api/cart/add", { cartItems: updatedCart }, { headers: { token } });
        } catch (error) {
            console.error("Error syncing cart with backend:", error);
        }
    }, [backendUrl, token]);

    const addToCart = useCallback(async (itemId, size) => {
        console.log("Adding item to cart:", itemId, "with size:", size);
        let currentCart = structuredClone(cartItems);

        if (!currentCart[itemId]) {
            currentCart[itemId] = {};
        }
        currentCart[itemId][size] = (currentCart[itemId][size] || 0) + 1;

        setCartItems(currentCart);
        if (token) {
            await updateCartOnServer(currentCart);
        }
    }, [cartItems, token, updateCartOnServer]);

    const removeFromCart = useCallback(async (itemId, size) => {
        let currentCart = structuredClone(cartItems);

        if (currentCart[itemId] && currentCart[itemId][size]) {
            currentCart[itemId][size] -= 1;

            if (currentCart[itemId][size] <= 0) {
                delete currentCart[itemId][size];
                if (Object.keys(currentCart[itemId]).length === 0) {
                    delete currentCart[itemId];
                }
            }
        }
        setCartItems(currentCart);
        if (token) {
            await updateCartOnServer(currentCart);
        }
    }, [cartItems, token, updateCartOnServer]);

    const getCartTotalCount = () => {
        let totalCount = 0;
        for (const itemId in cartItems) {
            for (const size in cartItems[itemId]) {
                totalCount += cartItems[itemId][size];
            }
        }
        return totalCount;
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        // console.log("Cart Items:", cartItems); // This can be noisy, so it's commented out
        // console.log("Available Products:", products); // This can also be noisy, commented out

        for (const itemId in cartItems) {
            const productInfo = products.find((product) => product._id === itemId);

            if (productInfo) {
                for (const size in cartItems[itemId]) {
                    const quantity = cartItems[itemId][size];
                    let price = 0;

                    // Find the variant price
                    const variant = productInfo.variants?.find(v => v.size === size);
                    if (variant) {
                        price = variant.new_price;
                    } else {
                        // Fallback to base product price if no variant is found
                        price = productInfo.price;
                        console.warn(`Variant with size '${size}' not found for product ID '${itemId}'. Using base product price: ${price}`);
                    }

                    totalAmount += price * quantity;
                }
            } else {
                console.warn(`Product with ID '${itemId}' not found in 'products' data. This item might not be correctly priced in the cart.`);
            }
        }
        return totalAmount;
    };

    const getProductsData = useCallback(async () => {
        try {
            console.log("Fetching product list from:", backendUrl + '/api/product/list');
            const response = await axios.get(backendUrl + '/api/product/list');
            console.log("Full API Response (Product List):", response.data);

            if (response.data.success) {
                let productsArray = [];
                if (Array.isArray(response.data.products)) {
                    productsArray = response.data.products;
                } else if (Array.isArray(response.data.product)) {
                    console.warn("API returned 'product' (singular) as an array. Using this data but consider changing backend to 'products' (plural).");
                    productsArray = response.data.product;
                } else {
                    console.error("API response did not contain a product array at response.data.products or response.data.product:", response.data);
                    toast.error("Failed to load products: Data format incorrect.");
                }

                // Log the final data that will be set to state
                console.log("Products to be set to state:", productsArray);
                productsArray.forEach(product => {
                    if (!product.image || product.image.length === 0) {
                        console.warn(`Product "${product.name}" (ID: ${product._id}) has no images. The placeholder will be used.`);
                    }
                });

                setProducts(productsArray);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Error fetching products: " + error.message);
        }
    }, [backendUrl, toast]);


    const fetchUserOrders = useCallback(async () => {
        if (!token) {
            setUserOrders([]);
            return;
        }
        try {
            const response = await axios.get(backendUrl + "/api/user/orders", {
                headers: { token: token }
            });
            console.log("Response from fetchUserOrders:", response.data);
            if (response.data.success) {
                setUserOrders(response.data.data);
            } else {
                toast.error("Failed to fetch orders: " + response.data.message);
                setUserOrders([]);
            }
        } catch (error) {
            console.error("Error fetching user orders:", error);
            toast.error("Error fetching user orders. Please try again.");
            setUserOrders([]);
        }
    }, [backendUrl, token, toast]);

    const placeOrder = useCallback(async (orderData) => {
        // ⭐ CRITICAL FIX: Check for token before proceeding
        if (!token) {
            toast.error("Please login to place an order.");
            navigate('/login'); // Redirect to login page
            return { success: false, message: "Not logged in" };
        }

        try {
            const response = await axios.post(backendUrl + "/api/order/place", orderData, {
                headers: { token: token }
            });

            if (response.data.success) {
                toast.success("Order Placed Successfully!");
                setCartItems({});
                updateCartOnServer({});
                fetchUserOrders();
            } else {
                toast.error("Failed to place order: " + response.data.message);
            }
            return response.data;
        } catch (error) {
            console.error("Error placing order:", error);
            toast.error("Error placing order. Please try again.");
            return { success: false, message: error.message };
        }
    }, [backendUrl, token, setCartItems, updateCartOnServer, fetchUserOrders, toast, navigate]);


    useEffect(() => {
        getProductsData();
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }
    }, [getProductsData]);

    useEffect(() => {
        if (token) {
            loadCartData(token);
            fetchUserOrders();
        } else {
            setCartItems({});
            setUserOrders([]);
        }
    }, [token, loadCartData, fetchUserOrders]);


    const contextValue = {
        products,
        currency,
        delivery_fee,
        serach,
        setSerach,
        showSerach,
        setshowSerach,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getCartTotalCount,
        getTotalCartAmount,
        navigate,
        backendUrl,
        setToken,
        token,
        userOrders,
        fetchUserOrders,
        placeOrder
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
