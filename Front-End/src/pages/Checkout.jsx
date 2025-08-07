import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import { getAuthToken} from '../pages/AuthUtils'
const Checkout = () => {
  const { cartItems, getTotalCartAmount, clearCart } = useContext(ShopContext);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const handleProceedToCheckout = async () => {
    // Check if the user is authenticated by getting the token
    const authToken = getAuthToken();

    if (!authToken) {
      // If no token is found, the user is not logged in.
      // Set the specific error message and redirect.
      setErrorMessage("Please login first.");
      
      // Use setTimeout to give the user a moment to see the message before redirection
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      return;
    }
    
    // If the user is logged in, you can proceed with the API call to place the order.
    console.log("User is authenticated. Proceeding to place order...");

    // This is where you would make your API call to place the order
    // try {
    //    const response = await axios.post('http://localhost:4000/api/order/place', {
    //       cartItems,
    //       amount: getTotalCartAmount()
    //    }, { headers: { 'auth-token': authToken } });
    //    if (response.data.success) {
    //        console.log("Order placed successfully!");
    //        clearCart();
    //        navigate('/myorders');
    //    } else {
    //        setErrorMessage(response.data.message);
    //    }
    // } catch (error) {
    //    console.error("Error placing order:", error);
    //    setErrorMessage("An error occurred. Please try again.");
    // }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Your Cart</h1>
        {errorMessage && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            {errorMessage}
          </div>
        )}
        {Object.keys(cartItems).length > 0 ? (
          <div>
            {/* Display cart items here */}
            <div className="flex justify-between font-semibold text-gray-700 mt-4 border-t pt-4">
              <span>Total:</span>
              <span>${getTotalCartAmount()}</span>
            </div>
            <button
              onClick={handleProceedToCheckout}
              className="mt-6 w-full py-3 px-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-colors duration-200"
            >
              Proceed to Checkout
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        )}
      </div>
    </div>
  );
};

export default Checkout;
