import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { CartCountContext } from '../context/CartCountContext.jsx';

function Cart() {
  const navigate = useNavigate();
  const { setCartCount } = useContext(CartCountContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  // Fetch the current user's cart from Render backend securely
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchCart = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/cart`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const items = res.data.items || [];
        setCartItems(items);
        
        // Synchronize Global Navbar badge total
        const totalQty = items.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(totalQty);
      } catch (err) {
        console.error("Error pulling database shopping cart info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [token, setCartCount]);

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  if (loading) return <div style={{ padding: '60px', textAlign: 'center' }}>Loading Your Shopping Basket... ⏳</div>;

  if (!token) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', padding: '40px 20px', background: '#fff', borderRadius: '4px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', boxSizing: 'border-box' }}>
        <h2>Your Shopping Cart is Empty</h2>
        <p style={{ color: '#565959', margin: '15px 0' }}>Sign in to sync items added to your database account layout.</p>
        <button onClick={() => navigate('/login')} style={{ padding: '10px 30px', background: '#ffd814', border: '1px solid #fcd200', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}>Sign in to your account</button>
      </div>
    );
  }

  return (
    <div style={{ background: '#eaeded', minHeight: '100vh', padding: '20px 15px', fontFamily: 'Arial, sans-serif', boxSizing: 'border-box' }}>
      
      {/* FIXED LOGIC: Changed to a wrapping flex container that reacts to laptops vs phones */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'flex', 
        flexWrap: 'wrap', // 👈 Side-by-side on laptops, but stacks elements vertically on phone screens
        gap: '20px', 
        alignItems: 'flex-start' 
      }}>
        
        {/* LEFT COLUMN: ITEMS VIEW */}
        <div style={{ 
          flex: '1 1 650px', // 👈 Grows on laptops, drops to a clean 100% width block on phones 
          background: '#ffffff', 
          padding: '20px', 
          borderRadius: '4px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          boxSizing: 'border-box'
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: '500', margin: '0 0 20px 0', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Shopping Cart</h1>
          
          {cartItems.length === 0 ? (
            <p style={{ fontSize: '15px', color: '#565959' }}>Your Amazon Clone basket contains no items. Go add some products!</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.productId} style={{ 
                display: 'flex', 
                flexWrap: 'wrap', // 👈 Stacks product details if a phone screen gets super thin
                gap: '15px', 
                padding: '15px 0', 
                borderBottom: '1px solid #e7e7e7',
                alignItems: 'center'
              }}>
                <div style={{ width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                  <img src={item.image} alt={item.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
                
                <div style={{ flex: '1 1 200px' }}>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '15px', color: '#0f1111' }}>{item.title}</h3>
                  <p style={{ color: '#007185', fontSize: '13px', margin: '0 0 5px 0' }}>In Stock</p>
                  <p style={{ fontSize: '13px', fontWeight: 'bold', margin: 0 }}>Qty: <span style={{ color: '#565959' }}>{item.quantity}</span></p>
                </div>
                
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f1111', minWidth: '80px', textAlign: 'right' }}>
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))
          )}
        </div>

        {/* RIGHT COLUMN: SUB-TOTAL CHECKOUT BOX */}
        {cartItems.length > 0 && (
          <div style={{ 
            flex: '1 1 280px', // 👈 Fills out cleanly on laptop sidebars or centers fluidly under the items list on phones
            background: '#ffffff', 
            padding: '20px', 
            borderRadius: '4px', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            boxSizing: 'border-box'
          }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: 'normal', lineHeight: '1.4' }}>
              Subtotal ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items): <br />
              <strong style={{ fontSize: '20px', fontWeight: '700', color: '#B12704', display: 'block', marginTop: '5px' }}>
                ₹{calculateTotal().toLocaleString('en-IN')}
              </strong>
            </h3>
            <button onClick={() => navigate('/checkout')} style={{ width: '100%', padding: '10px 0', background: '#ffd814', border: '1px solid #fcd200', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
              Proceed to Buy
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default Cart;