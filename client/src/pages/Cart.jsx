import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { getCart, updateQuantity, removeFromCart } from '../cartService';
import { CartCountContext } from '../context/CartCountContext.jsx'; 

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const navigate = useNavigate(); 
  const { setCartCount } = useContext(CartCountContext);

  useEffect(() => {
    loadCartData();
  }, []);

  const loadCartData = async () => {
    try {
      const data = await getCart();
      const itemsList = data.items || [];
      setCartItems(itemsList);
      setCartCount(itemsList.reduce((acc, item) => acc + item.quantity, 0));
    } catch (err) {
      console.error("Failed to load cart elements", err);
    } finally {
      setLoading(false);
    }
  };

  const handleQtyChange = async (productId, currentQty, amount) => {
    const newQty = currentQty + amount;
    setProcessingId(productId);

    try {
      if (newQty < 1) {
        const updatedCart = await removeFromCart(productId);
        const newItems = updatedCart.items || [];
        setCartItems(newItems);
        setCartCount(newItems.reduce((acc, item) => acc + item.quantity, 0));
      } else {
        const updatedCart = await updateQuantity(productId, newQty);
        const newItems = updatedCart.items || [];
        setCartItems(newItems);
        setCartCount(newItems.reduce((acc, item) => acc + item.quantity, 0));
      }
    } catch (err) {
      alert("Failed to update item count");
    } finally {
      setProcessingId(null);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const updatedCart = await removeFromCart(productId);
      const newItems = updatedCart.items || [];
      setCartItems(newItems);
      setCartCount(newItems.reduce((acc, item) => acc + item.quantity, 0));
    } catch (err) {
      alert("Failed to remove item");
    }
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', fontSize: '18px' }}>Loading your cart... ⏳</div>;

  return (
    <div style={{ background: '#eaeded', minHeight: '100vh', fontFamily: 'Arial, sans-serif', padding: '30px 20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '20px', flexWrap: 'wrap-reverse' }}>
        
        {/* LEFT COLUMN: PRODUCT LISTING */}
        <div style={{ flex: '3 1 800px', background: '#ffffff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '26px', fontWeight: '500', color: '#111' }}>Shopping Cart</h2>
          <span style={{ color: '#007185', fontSize: '14px', cursor: 'pointer' }} onClick={() => navigate('/')}>Deselect all items</span>
          <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '16px 0' }} />
          
          {cartItems.length === 0 ? (
            <div style={{ padding: '40px 0', textAlign: 'center' }}>
              <h3 style={{ color: '#565959', fontWeight: 'normal' }}>Your Amazon Cart is empty.</h3>
              <button onClick={() => navigate('/')} style={{ marginTop: '15px', padding: '10px 20px', background: '#ffd814', border: '1px solid #fcd200', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}>Shop Products Now</button>
            </div>
          ) : (
            cartItems.map(item => (
              <div 
                key={item.productId} 
                style={{ 
                  display: 'flex', 
                  gap: '20px', 
                  padding: '20px 0', 
                  borderBottom: '1px solid #f0f2f5', 
                  alignItems: 'flex-start', 
                  opacity: processingId === item.productId ? 0.5 : 1,
                  flexWrap: 'wrap'
                }}
              >
                {/* Product Image Wrapper */}
                <div style={{ width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: '#f7f7f7', borderRadius: '6px', padding: '5px' }}>
                  <img src={item.image} alt={item.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
                
                {/* Left-Aligned Information Panel */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '500', color: '#007185', lineHeight: '1.3' }}>
                    {item.title}
                  </h4>
                  
                  {/* Decorative Brand Text */}
                  <div style={{ fontSize: '13px', color: '#565959', marginBottom: '8px' }}>by Premium Brand</div>
                  
                  {/* Colorful Element 1: Orange Best Seller Badge */}
                  <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ background: '#c45500', color: '#ffffff', fontSize: '12px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '2px' }}>
                      #1 Best Seller
                    </span>
                    <span style={{ color: '#565959', fontSize: '13px' }}>in Department Items</span>
                  </div>

                  {/* Standard Price */}
                  <div style={{ fontSize: '19px', fontWeight: 'bold', color: '#111111', marginBottom: '4px' }}>
                    ₹{item.price?.toLocaleString('en-IN')}
                  </div>

                  {/* Colorful Element 2: In Stock & Fast Shipping Tags */}
                  <div style={{ fontSize: '13px', color: '#007600', fontWeight: 'bold', marginBottom: '2px' }}>In stock</div>
                  <div style={{ fontSize: '13px', color: '#565959', marginBottom: '15px' }}>
                    <span style={{ color: '#111', fontWeight: 'bold' }}>FREE delivery</span> Wednesday, 24 Jun
                  </div>
                  
                  {/* Interactive Control Row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                    
                    {/* Custom Pill Quantity Selector Container */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      border: '1px solid #d5d9d9', 
                      borderRadius: '20px', 
                      background: '#f0f2f2', 
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                      overflow: 'hidden'
                    }}>
                      <button 
                        disabled={processingId === item.productId}
                        onClick={() => handleQtyChange(item.productId, item.quantity, -1)} 
                        style={{ background: 'none', border: 'none', padding: '6px 14px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }}
                        onMouseOver={(e) => e.target.style.background = '#e3e6e6'}
                        onMouseOut={(e) => e.target.style.background = 'none'}
                      >-</button>
                      <span style={{ minWidth: '24px', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', color: '#0f1111' }}>{item.quantity}</span>
                      <button 
                        disabled={processingId === item.productId}
                        onClick={() => handleQtyChange(item.productId, item.quantity, 1)} 
                        style={{ background: 'none', border: 'none', padding: '6px 14px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }}
                        onMouseOver={(e) => e.target.style.background = '#e3e6e6'}
                        onMouseOut={(e) => e.target.style.background = 'none'}
                      >+</button>
                    </div>
                    
                    <span style={{ color: '#d5d9d9' }}>|</span>

                    <button 
                      onClick={() => handleRemove(item.productId)} 
                      style={{ color: '#007185', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }}
                      onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                      onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                    >
                      Delete
                    </button>

                    <span style={{ color: '#d5d9d9' }}>|</span>

                    <button style={{ color: '#007185', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
                      Save for later
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* RIGHT COLUMN: CHECKOUT SUMMARY SUMMARY CARD */}
        <div style={{ flex: '1 1 350px', height: 'fit-content', background: '#ffffff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', textAlign: 'left' }}>
          {cartItems.length > 0 ? (
            <>
              <div style={{ fontSize: '19px', color: '#111', marginBottom: '20px', lineHeight: '1.4' }}>
                Subtotal ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} items):{' '}
                <strong style={{ fontWeight: '700', color: '#b12704', fontSize: '22px', display: 'block', marginTop: '5px' }}>
                  ₹{totalPrice.toLocaleString('en-IN')}
                </strong>
              </div>
              
              {/* Colorful Element 3: Bold Rounded Amber Button Wrapper */}
              <button 
                onClick={() => navigate('/checkout')}
                style={{ 
                  width: '100%', 
                  padding: '12px 0', 
                  background: '#ffd814', 
                  border: '1px solid #fcd200', 
                  borderRadius: '20px', 
                  cursor: 'pointer', 
                  fontWeight: '500', 
                  fontSize: '15px',
                  color: '#0f1111',
                  boxShadow: '0 2px 5px rgba(213,217,217,.5)',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.target.style.background = '#f7ca00'}
                onMouseOut={(e) => e.target.style.background = '#ffd814'}
              >
                Proceed to Buy
              </button>
            </>
          ) : (
            <>
              <div style={{ fontSize: '18px', color: '#565959', marginBottom: '20px' }}>
                Subtotal (0 items):
                <strong style={{ display: 'block', color: '#aaa', fontSize: '22px', marginTop: '5px' }}>₹0</strong>
              </div>
              
              <button 
                disabled={true}
                style={{ 
                  width: '100%', 
                  padding: '12px 0', 
                  background: '#e7e9ec', 
                  color: '#8d9096', 
                  border: '1px solid #d5d9d9', 
                  borderRadius: '20px', 
                  cursor: 'not-allowed', 
                  fontSize: '15px',
                  fontWeight: '500'
                }}
              >
                Cart is Empty
              </button>
            </>
          )}
        </div>
        
      </div>
    </div>
  );
}

export default Cart;