// frontend/src/pages/Placeoder.jsx
import React, { useContext, useEffect, useState } from 'react';
import Title from '../Componet/Title';
import { ShopContext } from '../Context/ShopContext';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const Placeoder = () => {
    const { currency, delivery_fee, getTotalCartAmount, placeOrder, navigate, products, cartItems, backendUrl, token } = useContext(ShopContext);

    const stripe = useStripe();
    const elements = useElements();

    const subtotal = getTotalCartAmount();
    const grandTotal = subtotal > 0 ? subtotal + delivery_fee : 0;

    const [method, setMethod] = useState('COD'); // Default to COD
    const [deliveryInfo, setDeliveryInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDeliveryInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const getOrderItems = () => {
        let orderItems = [];
        for (const itemId in cartItems) {
            const productInfo = products.find(p => p._id === itemId);
            if (productInfo) {
                for (const size in cartItems[itemId]) {
                    orderItems.push({
                        productId: itemId,
                        quantity: cartItems[itemId][size],
                        size: size,
                        price: productInfo.variants.find(v => v.size === size)?.new_price || productInfo.price
                    });
                }
            }
        }
        return orderItems;
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (grandTotal <= 0) {
            toast.error("Your cart is empty. Please add items before placing an order.");
            return;
        }

        for (const key in deliveryInfo) {
            if (deliveryInfo[key].trim() === '') {
                toast.error(`Please fill in the ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`);
                return;
            }
        }

        const orderItems = getOrderItems();

        if (orderItems.length === 0) {
            toast.error("No items in cart to place an order.");
            return;
        }

        const orderData = {
            address: deliveryInfo,
            items: orderItems,
            amount: grandTotal,
            paymentMethod: method,
        };

        let paymentStatus = "Pending";

        if (method === 'stripe') {
            if (!stripe || !elements) {
                toast.error("Stripe is not loaded. Please try again.");
                return;
            }

            const cardElement = elements.getElement(CardElement);

            if (!cardElement) {
                toast.error("Card details are missing. Please enter your card information.");
                return;
            }

            try {
                const paymentIntentResponse = await axios.post(backendUrl + "/api/order/create-payment-intent", {
                    amount: Math.round(grandTotal * 100),
                    currency: 'inr'
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!paymentIntentResponse.data.clientSecret) {
                    toast.error("Failed to initiate payment. Please try again.");
                    return;
                }

                const clientSecret = paymentIntentResponse.data.clientSecret;

                const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: cardElement,
                        billing_details: {
                            name: `${deliveryInfo.firstName} ${deliveryInfo.lastName}`,
                            email: deliveryInfo.email,
                            address: {
                                line1: deliveryInfo.street,
                                city: deliveryInfo.city,
                                state: deliveryInfo.state,
                                postal_code: deliveryInfo.zipcode,
                                country: deliveryInfo.country,
                            },
                            phone: deliveryInfo.phone,
                        },
                    },
                });

                if (confirmError) {
                    console.error("Stripe confirm error:", confirmError.message);
                    toast.error(`Payment failed: ${confirmError.message}`);
                    paymentStatus = "Failed";
                } else if (paymentIntent.status === 'succeeded') {
                    toast.success("Payment successful!");
                    paymentStatus = "Paid";
                } else {
                    toast.error("Payment not successful. Status: " + paymentIntent.status);
                    paymentStatus = "Failed";
                }

            } catch (stripeError) {
                console.error("Error during Stripe payment process:", stripeError);
                toast.error("Payment processing error. Please try again.");
                paymentStatus = "Failed";
            }
        } 
        // Removed Razorpay logic block

        // Place the order regardless of payment method (COD or online failed/pending)
        // This is only reached for COD or if Stripe failed before opening checkout
        orderData.paymentStatus = paymentStatus;
        const result = await placeOrder(orderData);

        if (result.success) {
            navigate('/Orders');
        }
    };

    // Styling for CardElement (Stripe)
    const CARD_ELEMENT_OPTIONS = {
        style: {
            base: {
                color: "#32325d",
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                    color: "#aab7c4",
                },
            },
            invalid: {
                color: "#fa755a",
                iconColor: "#fa755a",
            },
        },
    };

    // Removed useEffect for loading Razorpay script

    return (
        <form onSubmit={handlePlaceOrder} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
            {/* ------------left side------------ */}
            <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
                <div className='text-xl sm:text-2xl my-3'>
                    <Title text1={'DELIVERY'} text2={'INFORMATION'} />
                </div>
                <div className='flex gap-3'>
                    <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First Name' name="firstName" value={deliveryInfo.firstName} onChange={handleChange} />
                    <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last Name' name="lastName" value={deliveryInfo.lastName} onChange={handleChange} />
                </div>
                <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='email address' name="email" value={deliveryInfo.email} onChange={handleChange} />
                <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='street' name="street" value={deliveryInfo.street} onChange={handleChange} />
                <div className='flex gap-3'>
                    <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' name="city" value={deliveryInfo.city} onChange={handleChange} />
                    <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' name="state" value={deliveryInfo.state} onChange={handleChange} />
                </div>
                <div className='flex gap-3'>
                    <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Zip code' name="zipcode" value={deliveryInfo.zipcode} onChange={handleChange} />
                    <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' name="country" value={deliveryInfo.country} onChange={handleChange} />
                </div>
                <input className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone number' name="phone" value={deliveryInfo.phone} onChange={handleChange} />
            </div>
            {/* -----------------Right side - Cart Total Display */}
            <div className='mt-8 min-w-80'>
                <div className='text-xl sm:text-2xl my-3'>
                    <Title text1={'CART'} text2={'TOTALS'} />
                </div>
                <div className='bg-gray-50 p-6 rounded-lg shadow'>
                    <div className='flex justify-between items-center text-lg mb-2'>
                        <p>Subtotal:</p>
                        <p className='font-medium'>{currency} {subtotal.toFixed(2)}</p>
                    </div>
                    <div className='flex justify-between items-center text-lg mb-2'>
                        <p>Delivery Fee:</p>
                        <p className='font-medium'>{currency} {subtotal > 0 ? delivery_fee.toFixed(2) : (0).toFixed(2)}</p>
                    </div>
                    <div className='flex justify-between items-center text-xl font-bold mt-4 pt-4 border-t border-gray-300'>
                        <p>Total:</p>
                        <p>{currency} {grandTotal.toFixed(2)}</p>
                    </div>
                    <div className='mt-12'>
                        <Title text1={'PAYMENT'} text2={'METHOD'} />
                    </div>
                    <div className='flex gap-3 flex-col lg:flex-row'>
                        <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 min-h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400 border-green-600' : 'border-gray-400'}`}></p>
                            <img className='h-5 mx-4' src={assets.stripe_logo} alt="Stripe Logo" />
                        </div>
                        {/* Removed Razorpay UI option */}
                        <div onClick={() => setMethod('COD')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 min-h-3.5 border rounded-full ${method === 'COD' ? 'bg-green-400 border-green-600' : 'border-gray-400'}`}></p>
                            <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
                        </div>
                    </div>

                    {/* Stripe Card Element */}
                    {method === 'stripe' && (
                        <div className='mt-4 p-4 border rounded-lg bg-white shadow-inner'>
                            <p className='text-gray-700 text-sm font-medium mb-2'>Enter Card Details:</p>
                            <CardElement options={CARD_ELEMENT_OPTIONS} />
                        </div>
                    )}

                    <div className='w-full text-end mt-8'>
                        <button type="submit" className='bg-green-700 text-white px-16 py-3 text-sm'>
                            PLACE ORDER
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default Placeoder;
