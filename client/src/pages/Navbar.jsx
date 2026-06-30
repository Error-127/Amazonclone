import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartCountContext } from '../context/CartCountContext.jsx';

function Navbar() {
  const navigate = useNavigate();
  const { cartCount, setCartCount } = useContext(CartCountContext);
  const isLoggedIn = !!localStorage.getItem('token');

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setCartCount(0);
    alert("You have been signed out successfully.");
    navigate('/login');
  };

  return (
    <header style={{
      background: '#131921',
      padding: '10px 40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontFamily: 'Arial, sans-serif',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      
      {/* LEFT SIDE: LOGO */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/" style={{ color: '#ffffff', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>
          amazon<span style={{ color: '#febd69' }}>.clone</span>
        </Link>
      </div>

      {/* RIGHT SIDE: CONTROLS (Search is removed from here) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
        
        <Link 
          to="/" 
          style={{ color: '#ffffff', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}
        >
          Home
        </Link>

        <Link 
          to="/cart" 
          style={{ 
            color: '#ffffff', 
            textDecoration: 'none', 
            fontSize: '14px', 
            fontWeight: '700', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '5px' 
          }}
        >
          🛒 Cart <span style={{ color: '#febd69', fontSize: '15px' }}>({cartCount})</span>
        </Link>

        {isLoggedIn ? (
          <button 
            onClick={handleSignOut}
            type="button"
            style={{
              background: '#ffd814',
              border: '1px solid #fcd200',
              borderRadius: '4px',
              padding: '6px 15px',
              cursor: 'pointer',
              color: '#0f1111',
              fontWeight: '500',
              fontSize: '13px'
            }}
            onMouseOver={(e) => e.target.style.background = '#f7ca00'}
            onMouseOut={(e) => e.target.style.background = '#ffd814'}
          >
            Sign Out
          </button>
        ) : (
          <Link 
            to="/login" 
            style={{
              background: '#ffd814',
              color: '#0f1111',
              padding: '6px 15px',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '13px',
              border: '1px solid #fcd200',
              display: 'inline-block'
            }}
            onMouseOver={(e) => e.target.style.background = '#f7ca00'}
            onMouseOut={(e) => e.target.style.background = '#ffd814'}
          >
            Sign In
          </Link>
        )}

      </div>
    </header>
  );
}

export default Navbar;