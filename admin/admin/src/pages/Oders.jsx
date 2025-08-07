// frontend/src/pages/Orders/Orders.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const Orders = () => {
    const backendUrl = "http://localhost:4000"; // Ensure this matches your backend URL
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(''); // State to hold the admin token

    // Function to fetch all orders from the backend
    const fetchAllOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const storedToken = localStorage.getItem("token"); // Get token from localStorage
            if (!storedToken) {
                toast.error("Admin not authenticated. Please login to view orders.");
                setLoading(false);
                setError("Not authenticated.");
                return;
            }
            setToken(storedToken); // Set token state

            const response = await axios.get(backendUrl + "/api/order/list", {
                // ⭐ FIX: Send token in 'Authorization' header with 'Bearer' prefix
                headers: { Authorization: `Bearer ${storedToken}` } 
            });

            if (response.data.success) {
                setOrders(response.data.data); // Backend sends data in 'data' field
                console.log("Fetched admin orders:", response.data.data);
            } else {
                toast.error(response.data.message || "Failed to fetch orders.");
                setError(response.data.message || "Failed to fetch orders.");
            }
        } catch (err) {
            console.error("Error fetching admin orders:", err);
            toast.error("Network error or server unreachable.");
            setError("Network error or server unreachable.");
        } finally {
            setLoading(false);
        }
    };

    // Function to update order status
    const updateStatus = async (orderId, newStatus) => {
        try {
            const response = await axios.post(backendUrl + "/api/order/updateStatus", {
                orderId,
                status: newStatus
            }, {
                // ⭐ FIX: Send token in 'Authorization' header with 'Bearer' prefix
                headers: { Authorization: `Bearer ${token}` } 
            });

            if (response.data.success) {
                toast.success(response.data.message);
                await fetchAllOrders(); // Re-fetch orders to update the UI
            } else {
                toast.error(response.data.message || "Failed to update status.");
            }
        } catch (err) {
            console.error("Error updating order status:", err);
            toast.error("Error updating status. Please try again.");
        }
    };

    // Fetch orders on component mount
    useEffect(() => {
        fetchAllOrders();
    }, []); // Empty dependency array means it runs once on mount

    if (loading) {
        return (
            <div className='flex justify-center items-center h-screen text-xl text-gray-600'>
                Loading orders...
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex justify-center items-center h-screen text-xl text-red-500'>
                Error: {error}
            </div>
        );
    }

    return (
        <div className='p-4 md:p-8 flex flex-col items-center w-full min-h-screen bg-gray-50 font-sans'>
            <div className='w-full max-w-6xl bg-white shadow-xl rounded-lg p-4 md:p-8'>
                <h2 className='text-2xl font-bold mb-6 text-gray-800 text-center'>All Orders</h2>

                {orders.length === 0 ? (
                    <p className='text-center text-gray-600 py-10 text-lg'>No orders found.</p>
                ) : (
                    <div className='flex flex-col gap-6'>
                        {orders.map((order) => (
                            <div key={order._id} className='border border-gray-200 rounded-lg p-4 shadow-sm bg-white'>
                                <p className='text-lg font-semibold mb-2'>Order ID: <span className='font-normal text-gray-700'>{order._id}</span></p>
                                <p className='text-gray-600 mb-1'>User ID: <span className='font-normal text-gray-700'>{order.userId}</span></p>
                                <p className='text-gray-600 mb-1'>Date: <span className='font-normal text-gray-700'>{new Date(order.date).toLocaleDateString()}</span></p>
                                <p className='text-gray-600 mb-1'>Total Amount: <span className='font-normal text-gray-700'>₹{order.amount.toFixed(2)}</span></p>
                                <p className='text-gray-600 mb-1'>Payment Method: <span className='font-normal text-gray-700'>{order.paymentMethod}</span></p>
                                <p className='text-gray-600 mb-4'>Payment Status: <span className='font-normal text-gray-700'>{order.paymentStatus}</span></p>

                                <h4 className='text-md font-medium mb-2'>Delivery Address:</h4>
                                <ul className='text-sm text-gray-600 mb-4 list-disc list-inside'>                                                                                             
                                    <li>{order.address.firstName} {order.address.lastName}</li>
                                    <li>{order.address.street}, {order.address.city}</li>
                                    <li>{order.address.state}, {order.address.zipcode} - {order.address.country}</li>
                                    <li>Email: {order.address.email}</li>
                                    <li>Phone: {order.address.phone}</li>
                                </ul>

                                <h4 className='text-md font-medium mb-2'>Order Items:</h4>
                                <div className='flex flex-col gap-2 mb-4'>
                                    {order.items.map((item, itemIndex) => {
                                        const product = item.productId; // This should be the populated product object
                                        const imageUrl = product && Array.isArray(product.image) && product.image.length > 0
                                            ? product.image[0]
                                            : 'https://placehold.co/50x50/A0A0A0/FFFFFF?text=No+Image';

                                        return (
                                            <div key={itemIndex} className='flex items-center gap-3 border border-gray-100 p-2 rounded-md bg-gray-50'>
                                                <img src={imageUrl} alt={product ? product.name : 'Product'} className='w-12 h-12 object-cover rounded' />
                                                <div className='flex-1'>
                                                    <p className='font-medium text-gray-800'>{product ? product.name : 'Unknown Product'}</p>
                                                    <p className='text-sm text-gray-600'>Qty: {item.quantity} {item.size ? `(${item.size})` : ''} - ₹{item.price.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className='flex items-center gap-3 mt-4'>
                                    <p className='font-medium text-gray-800'>Order Status:</p>
                                    <select
                                        className='p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
                                        value={order.status}
                                        onChange={(e) => updateStatus(order._id, e.target.value)}
                                    >
                                        <option value="Processing">Processing</option>
                                        <option value="Out for Delivery">Out for Delivery</option>
                                        <option value="Delivered">Delivered</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
