import axios from 'axios';
import { API_BASE_URL } from './config'; // 👈 Step 1: Import your live Render URL from config.js

// Step 2: Use the live URL variable instead of the old localhost string
const API_URL = API_BASE_URL; 

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  
  // DEBUGGING LOG: Press F12 in your browser and check the "Console" tab to read this output!
  console.log("Current Outgoing Auth Token Status:", token ? "Token Found ✅" : "No Token Found ❌");

  // Safeguard against token strings stored accidentally as literal "null" or "undefined"
  if (!token || token === 'null' || token === 'undefined') {
    return {
      headers: { 'Content-Type': 'application/json' }
    };
  }

  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export const getCart = async () => {
  const response = await axios.get(`${API_URL}/cart`, getAuthHeaders());
  return response.data;
};

export const addToCart = async (productId, quantity) => {
  const response = await axios.post(
    `${API_URL}/cart/add`, 
    { productId, quantity }, 
    getAuthHeaders()
  );
  return response.data;
};

export const updateQuantity = async (productId, quantity) => {
  const response = await axios.put(`${API_URL}/cart/update`, { productId, quantity }, getAuthHeaders());
  return response.data;
};

export const removeFromCart = async (productId) => {
  const response = await axios.delete(`${API_URL}/cart/remove/${productId}`, getAuthHeaders());
  return response.data;
};