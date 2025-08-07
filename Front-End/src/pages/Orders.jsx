// frontend/src/Orders.jsx

import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../Context/ShopContext'
import Title from '../Componet/Title';

const Orders = () => {
    const { userOrders, currency, fetchUserOrders } = useContext(ShopContext);

    useEffect(() => {
        fetchUserOrders();
    }, [fetchUserOrders]);

    return (
        <div className='border-t pt-16'>
            <div className='text-2xl'>
                <Title text1={'MY'} text2={'ORDERS'} />
            </div>
            <div>
                {userOrders.length === 0 ? (
                    <p className='text-center text-gray-600 mt-8'>You have no orders yet.</p>
                ) : (
                    userOrders.map((order, orderIndex) => (
                        <div key={order._id || orderIndex} className='mb-8 p-4 border rounded-lg shadow-sm'>
                            <h3 className='text-lg font-semibold mb-3'>Order ID: {order._id}</h3>
                            <p className='text-gray-600 mb-2'>Order Date: {new Date(order.date).toLocaleDateString()}</p>
                            <p className='text-gray-600 mb-2'>Status: <span className='font-medium text-green-700'>{order.status || 'Processing'}</span></p>
                            <p className='text-gray-600 mb-4'>Total Amount: {currency}{order.amount}</p>

                            {order.items.map((orderItem, itemIndex) => {
                                // ⭐ FIX: Directly use orderItem.productId as it should be the populated product object
                                const productDetail = orderItem.productId; 

                                // Determine the image URL, with a robust fallback
                                const imageUrl = productDetail && Array.isArray(productDetail.image) && productDetail.image.length > 0
                                    ? productDetail.image[0]
                                    : 'https://placehold.co/100x100/A0A0A0/FFFFFF?text=No+Image';

                                return (
                                    <div key={itemIndex} className='py-4 border-t text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                                        <div className='flex items-start gap-6 text-sm'>
                                            <img 
                                                className='w-16 sm:w-20 object-cover rounded' 
                                                src={imageUrl} 
                                                alt={productDetail ? productDetail.name : 'Product Image'} 
                                                onError={(e) => { // Fallback for broken image links
                                                    e.target.onerror = null; 
                                                    e.target.src = "https://placehold.co/100x100/E0E0E0/333333?text=Error";
                                                }}
                                            />
                                            <div>
                                                <p className='sm:text-base font-medium'>{productDetail ? productDetail.name : 'Unknown Product'}</p>
                                                <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                                                    {/* ⭐ FIX: Access price from orderItem.price or productDetail.variants */}
                                                    <p className='text-lg'>
                                                        {currency}
                                                        {orderItem.price // Use the price stored in the order item itself
                                                            ? orderItem.price.toFixed(2)
                                                            : (productDetail && productDetail.variants && productDetail.variants.length > 0
                                                                ? productDetail.variants.find(v => v.size === orderItem.size)?.new_price?.toFixed(2) || 'N/A'
                                                                : (productDetail?.price ? productDetail.price.toFixed(2) : 'N/A'))
                                                        }
                                                    </p>
                                                    <p>Quantity: {orderItem.quantity}</p>
                                                    {orderItem.size && <p>Size: {orderItem.size}</p>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='md:w-1/2 flex justify-end'>
                                            <button className='border px-4 py-2 text-sm font-medium rounded-sm'>Track Item</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Orders;
