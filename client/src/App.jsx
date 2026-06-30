import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './pages/Navbar.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Cart from './pages/Cart.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
// 1. Import your newly built Checkout page component
import Checkout from './pages/Checkout.jsx'; 

import { CartCountProvider } from './context/CartCountContext.jsx'; 

function App() {
  return (
    <CartCountProvider>
      <Router>
        <Navbar /> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          
          {/* 2. Add your new Checkout route handler right here */}
          <Route path="/checkout" element={<Checkout />} />
          
          <Route path="/home" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </CartCountProvider>
  );
}

export default App;