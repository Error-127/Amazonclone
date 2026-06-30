import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { CartCountContext } from '../context/CartCountContext.jsx';
import { addToCart, getCart } from '../cartService';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  
  const { cartCount, setCartCount } = useContext(CartCountContext);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product specifications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  const handleAddToCartClick = async () => {
    // 🚨 STRICT AUTHENTICATION GUARD: Verify token existence before making any API request
    const token = localStorage.getItem('token');
    if (!token || token === 'null' || token === 'undefined') {
      alert("Please sign in to add items to your cart.");
      navigate('/login');
      return; // Stops the function immediately
    }

    setAdding(true);
    try {
      await addToCart(product._id || product.id, quantity);
      
      alert(`🎉 Added ${quantity} item(s) to your cart!`);
      
      const currentCart = await getCart();
      setCartCount(currentCart.items?.reduce((acc, item) => acc + item.quantity, 0) || 0);
    } catch (err) {
      console.error("Cart action error details:", err);
      alert("Your session has expired. Please sign in again.");
      localStorage.removeItem('token'); // Clears the corrupted/expired token
      navigate('/login');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', fontSize: '18px' }}>Loading product information... ⏳</div>;
  if (!product) return <div style={{ padding: '60px', textAlign: 'center' }}>Product not found!</div>;

  return (
    <div style={{ background: '#eaeded', minHeight: '100vh', fontFamily: 'Arial, sans-serif', padding: '20px 40px' }}>
      
      {/* 1. BREADCRUMB NAVIGATION */}
      <div style={{ maxWidth: '1300px', margin: '0 auto 15px auto', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
        <Link 
          to="/" 
          style={{ 
            color: '#007185', 
            textDecoration: 'none', 
            fontWeight: '600',
            fontSize: '14px'
          }}
          onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
          onMouseOut={(e) => e.target.style.textDecoration = 'none'}
        >
          ← Back to Products
        </Link>
        <span style={{ color: '#565959' }}>|</span>
        <span style={{ color: '#565959', fontWeight: '400' }}>{product.category || 'Department Item'}</span>
      </div>

      {/* 2. MAIN CARD LAYOUT */}
      <div style={{ 
        maxWidth: '1300px', 
        margin: '0 auto', 
        background: '#ffffff', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)', 
        display: 'flex', 
        gap: '40px', 
        padding: '30px',
        flexWrap: 'wrap'
      }}>
        
        {/* Left Media Container */}
        <div style={{ 
          flex: '1 1 450px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: '#ffffff',
          padding: '10px'
        }}>
          <img 
            src={product.image || product.thumbnail} 
            alt={product.title} 
            style={{ maxWidth: '100%', maxHeight: '420px', objectFit: 'contain' }}
          />
        </div>

        {/* Right Info Box */}
        <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
          
          <h1 style={{ fontSize: '28px', color: '#111111', margin: '0 0 5px 0', fontWeight: '500', lineHeight: '1.3' }}>
            {product.title}
          </h1>
          
          <div style={{ color: '#007185', fontSize: '14px', fontWeight: '500', marginBottom: '15px' }}>
            Brand: {product.brand || 'Velvet Touch'}
          </div>
          
          <hr style={{ border: 'none', borderTop: '1px solid #e7e7e7', width: '100%', margin: '0 0 15px 0' }} />
          
          <div style={{ margin: '0 0 15px 0', display: 'flex', alignItems: 'baseline', gap: '5px' }}>
            <span style={{ fontSize: '14px', color: '#565959' }}>Price:</span>
            <span style={{ fontSize: '28px', fontWeight: '500', color: '#B12704' }}>
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
          </div>

          <div style={{ margin: '0 0 25px 0' }}>
            <h4 style={{ margin: '0 0 5px 0', fontSize: '16px', color: '#111' }}>About this item:</h4>
            <p style={{ color: '#333333', fontSize: '15px', lineHeight: '1.5', margin: '0' }}>
              {product.description || 'Premium high-quality standard industry cosmetic item designed for daily utility applications.'}
            </p>
          </div>

          {/* Action Order Block */}
          <div style={{ 
            background: '#ffffff', 
            border: '1px solid #d5d9d9', 
            borderRadius: '8px', 
            padding: '20px', 
            maxWidth: '350px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#B12704', marginBottom: '15px' }}>
              In Stock
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <span style={{ color: '#565959', fontSize: '14px' }}>Quantity:</span>
              <select 
                value={quantity} 
                onChange={(e) => setQuantity(Number(e.target.value))}
                style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #d5d9d9', background: '#f0f2f2', cursor: 'pointer', outline: 'none' }}
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <button 
              disabled={adding}
              onClick={handleAddToCartClick}
              style={{ 
                width: '100%', 
                padding: '10px 0', 
                background: adding ? '#e2e2e2' : '#ffd814', 
                border: '1px solid #fcd200', 
                borderRadius: '20px', 
                fontWeight: '500', 
                cursor: adding ? 'not-allowed' : 'pointer', 
                fontSize: '14px',
                color: '#0f1111',
                boxShadow: '0 2px 5px rgba(213,217,217,.5)'
              }}
              onMouseOver={(e) => { if(!adding) e.target.style.background = '#f7ca00'; }}
              onMouseOut={(e) => { if(!adding) e.target.style.background = '#ffd814'; }}
            >
              {adding ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductDetail;