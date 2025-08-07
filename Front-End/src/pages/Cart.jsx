// pages/Cart.jsx
import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../Context/ShopContext';
import Title from '../Componet/Title'; // Assuming this path is correct

const Cart = () => {
  const { products, currency, cartItems, removeFromCart, getTotalCartAmount, delivery_fee,  navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = [];
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        const quantity = cartItems[itemId][size];
        if (quantity > 0) {
          tempData.push({
            _id: itemId,
            size: size, // Ensure size is correctly stored in cartItems
            quantity: quantity,
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItems, products]);

  const calculateSubtotal = () => {
    return getTotalCartAmount();
  };

  const calculateGrandTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 0 ? subtotal + delivery_fee : 0;
  };

  if (cartData.length === 0) {
    return (
      <div className='border-t pt-14 text-center text-gray-600 h-[calc(100vh-200px)] flex flex-col justify-center items-center'>
        <div className='text-2xl mb-3'>
          <Title text1={'YOUR'} text2={'CART'}/>
        </div>
        <p className='text-lg'>Your cart is empty.</p>
        <p className='text-md mt-2'>Start shopping to add items!</p>
      </div>
    );
  }

  return (
    <div className='border-t pt-14'>
      <div className='text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'CART'}/>
      </div>
       <div className='flex flex-col gap-4'>
        {
          cartData.map((item,index)=>{
              const productData = products.find((product)=>product._id === item._id);

              if (!productData) {
                console.warn(`Product with ID ${item._id} not found in products list.`);
                return null;
              }

              let variantPrice = 0;
              // ⭐ FIX START: Correctly find variant price for display ⭐
              if (productData.variants && Array.isArray(productData.variants)) {
                // Find the variant that matches the 'size' stored in the cart item
                const selectedVariant = productData.variants.find(v => v.size === item.size);

                if (selectedVariant) {
                  // Ensure new_price is a number
                  variantPrice = parseFloat(selectedVariant.new_price);
                  if (isNaN(variantPrice)) {
                      console.warn(`new_price for variant size '${item.size}' of product '${productData.name}' is NaN. Displaying 0.`);
                      variantPrice = 0;
                  }
                } else {
                  console.warn(`Variant with size '${item.size}' not found for product '${productData.name}' (ID: ${item._id}). Displaying price as 0.`);
                }
              } else {
                 console.warn(`Product '${productData.name}' (ID: ${item._id}) has no valid 'variants' array. Displaying price as 0.`);
              }
              // ⭐ FIX END ⭐

              return (
                <div key={`${item._id}-${item.size}`} className='py-4 border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
                    <div className='flex items-start gap-6'>
                      <img className='w-16 sm:w-20 object-cover' src={productData.image && productData.image.length > 0 ? productData.image[0] : 'https://via.placeholder.com/150?text=No+Image'} alt={productData.name || 'Product Image'} />
                        <div>
                          <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                          {item.size && <p className='text-sm text-gray-500'>Size: {item.size}</p>}
                          <p className='text-sm text-gray-500'>Quantity: {item.quantity}</p>
                          <p className='text-sm font-semibold'>
                              {currency} {(!isNaN(variantPrice) ? (variantPrice * item.quantity).toFixed(2) : 'N/A')} {/* ⭐ Display correctly formatted price ⭐ */}
                          </p>
                        </div>
                    </div>
                    <div className='flex justify-end pr-4'>
                         <button
                            onClick={() => removeFromCart(item._id, item.size)}
                            className='text-red-500 hover:text-red-700 text-2xl font-bold p-1 leading-none'
                          >
                            &times;
                          </button>
                    </div>
                </div>
              )
          })
        }

        <div className='mt-8 pt-4 border-t border-gray-300'>
            <div className='flex justify-between items-center text-lg'>
                <p>Subtotal:</p>
                <p className='font-medium'>{currency} {calculateSubtotal().toFixed(2)}</p>
            </div>
            <div className='flex justify-between items-center text-lg mt-2'>
                <p>Delivery Fee:</p>
                <p className='font-medium'>{currency} {calculateSubtotal() > 0 ? delivery_fee.toFixed(2) : (0).toFixed(2)}</p>
            </div>
            <div className='flex justify-between items-center text-xl font-bold mt-4 pt-4 border-t border-gray-400'>
                <p>Total:</p>
                <p>{currency} {calculateGrandTotal().toFixed(2)}</p>
            </div>
        </div>

        <button onClick={()=>navigate('/placeoder')} className='bg-green-500 hover:bg-green-600 text-white py-3 rounded-md text-lg font-semibold mt-4'>
            Proceed to Checkout
        </button>
       </div>
    </div>
  )
}

export default Cart;