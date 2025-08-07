// frontend/src/App.js (or your main routing file)

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Cart from './pages/cart';
import Orders from './pages/Orders'; // Assuming this is your customer Orders page
import Producte from './pages/Producte';
import Placeoder from './pages/Placeoder';
import Login from './pages/Login';
import Contect from './pages/contect';
import Navbar from './Componet/Navbar';
import Footer from './Componet/Footer';
import Collections from './pages/collections';
import Searchbar from './Componet/searchbar';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'; // Corrected import for ToastContainer
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/Resetpassword';
import Checkout from './pages/Checkout';

// ⭐ NEW: Stripe Imports
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Load your Stripe Publishable Key (from .env or directly if not using .env in frontend)
// For frontend, you typically put this directly or use a build tool to inject it.
// Replace 'pk_test_YOUR_PUBLISHABLE_KEY' with your actual public key.
const stripePromise = loadStripe("pk_test_YOUR_PUBLISHABLE_KEY"); 

const App = () => {
  return (
    <div className='max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8'>
      <ToastContainer/>
      <Navbar/>
      <Searchbar/>
      {/* ⭐ NEW: Wrap Routes that use Stripe with Elements provider */}
      <Elements stripe={stripePromise}>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/Home' element={<Home/>}/>
          <Route path='/About' element={<About/>}/>
          <Route path='/Cart' element={<Cart/>}/>
          <Route path='/Collection' element={<Collections/>}/>
          <Route path='/Orders' element={<Orders/>}/> 
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/product/:ProducteID' element={<Producte/>}/>
          <Route path='/Placeoder' element={<Placeoder/>}/>
          <Route path='/Login' element={<Login/>}/>
          <Route path='/Contect' element={<Contect/>}/>
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/ResetPassword' element={<ResetPassword/>}/>
        </Routes>
      </Elements>
      <Footer/>
    </div>
  );
};

export default App;
