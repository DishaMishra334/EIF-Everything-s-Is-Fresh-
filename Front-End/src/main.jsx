import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import ShopContextProvider from './Context/ShopContext.jsx';
// Corrected import path to match the renamed file


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <ShopContextProvider>
        <App />
  </ShopContextProvider>
   
  </BrowserRouter>
);
