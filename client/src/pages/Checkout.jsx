import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, removeFromCart } from '../cartService';
import { CartCountContext } from '../context/CartCountContext.jsx';

function Checkout() {
  const navigate = useNavigate();
  const { setCartCount } = useContext(CartCountContext);
  
  // State management
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    pincode: ''
  });

  // Load cart data automatically on page mount
  useEffect(() => {
    const loadCheckoutData = async () => {
      try {
        const data = await getCart();
        setCartItems(data.items || []);
      } catch (err) {
        console.error("Failed to load checkout details:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCheckoutData();
  }, []);

  // Update input states when student types into form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit Handler
  const handlePlaceOrder = async (e) => {
    e.preventDefault(); // Stop page from refreshing on form submission

    // Basic Validation check
    if (!formData.fullName || !formData.email || !formData.address || !formData.city || !formData.pincode) {
      alert("Please fill out all fields before placing your order! 📝");
      return;
    }

    try {
      alert("🎉 Order Placed Successfully!");

      // Loop through all items and call your delete service to clear the backend database
      for (const item of cartItems) {
        await removeFromCart(item.productId);
      }

      // Reset your global Navbar context badge back to 0
      setCartCount(0);

      // Take the user safely back to the home page dashboard
      navigate('/');
    } catch (err) {
      console.error("Failed to empty cart database during checkout cleanup:", err);
      alert("Something went wrong finalizing your order. Please try again.");
    }
  };

  // Compute calculated subtotal numbers
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Preparing checkout interface... ⏳</div>;

  return (
    <div style={{ padding: '30px', background: '#eaeded', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: '20px' }}>Review Your Order & Checkout</h2>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        
        {/* LEFT SIDE: Shipping Form Fields */}
        <div style={{ flex: 2, minWidth: '300px', background: '#fff', padding: '25px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>1. Shipping Details</h3>
          <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
            
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Full Name</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #aaa' }} placeholder="John Doe" required />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #aaa' }} placeholder="john@example.com" required />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Street Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #aaa' }} placeholder="123 Main St, Apartment 4B" required />
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>City</label>
                <input type="text" name="city" value={formData.city} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #aaa' }} placeholder="Jaipur" required />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Pincode / ZIP</label>
                <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #aaa' }} placeholder="302001" required />
              </div>
            </div>

            <button type="submit" style={{ marginTop: '15px', padding: '12px', background: '#ffd814', border: '1px solid #fcd200', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
              Place Your Order
            </button>
          </form>
        </div>

        {/* RIGHT SIDE: Live Order Breakdown Summary */}
        <div style={{ flex: 1, minWidth: '280px', background: '#fff', padding: '25px', borderRadius: '4px', height: 'fit-content', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>2. Order Summary</h3>
          
          {cartItems.length === 0 ? (
            <p style={{ marginTop: '15px', color: '#666' }}>No items to check out.</p>
          ) : (
            <>
              <div style={{ maxHeight: '250px', overflowY: 'auto', marginTop: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                {cartItems.map(item => (
                  <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '12px', alignItems: 'center' }}>
                    <span style={{ maxWidth: '70%', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      <strong>{item.quantity}x</strong> {item.title}
                    </span>
                    <span style={{ color: '#B12704', fontWeight: '600' }}>
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>Total Items:</span>
                  <span>{totalItemsCount}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #ddd', paddingTop: '15px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Order Total:</span>
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#B12704' }}>
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

export default Checkout;