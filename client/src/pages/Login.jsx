import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const loginData = { email, password };

    axios.post('http://localhost:5000/login', loginData)
      .then((response) => {
        setLoading(false);
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        alert('Login Successful! Welcome back. 👋');
        navigate('/home'); 
      })
      .catch((err) => {
        setLoading(false);
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(err.message || 'An error occurred during authentication.');
        }
      });
  };

  return (
    <div style={{ 
      fontFamily: 'sans-serif', 
      background: 'linear-gradient(135deg, #0f0c1b 0%, #201a36 50%, #0f0c1b 100%)', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      
      {/* Modern Neon Brand Title */}
      <h2 style={{ color: '#00f2fe', fontSize: '38px', marginBottom: '25px', fontWeight: '800', letterSpacing: '1.5px', textShadow: '0 0 15px rgba(0, 242, 254, 0.6)' }}>
        amazon<span style={{ color: '#ff007f', fontWeight: '300', fontSize: '24px', textShadow: '0 0 15px rgba(255, 0, 127, 0.6)' }}>.storefront</span>
      </h2>
      
      {/* Central Attractive Glassmorphism Card */}
      <div style={{ 
        backgroundColor: 'rgba(32, 26, 54, 0.85)', 
        border: '1px solid rgba(255, 0, 127, 0.2)',
        borderRadius: '20px', 
        padding: '40px', 
        width: '100%', 
        maxWidth: '400px', 
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5), 0 0 25px rgba(111, 66, 193, 0.2)',
        boxSizing: 'border-box'
      }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 25px 0', color: '#ffffff', textAlign: 'center', letterSpacing: '0.5px' }}>Sign In</h1>
        
        <form onSubmit={handleSubmit}>
          {/* Identity Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#00f2fe' }}>Mobile number or email</label>
            <input 
              type="text" 
              required
              placeholder="Enter phone number or email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px', boxSizing: 'border-box', backgroundColor: '#130f26', border: '2px solid #3d3563', borderRadius: '10px', fontSize: '14px', color: '#fff', outline: 'none', transition: '0.3s' }}
              onFocus={(e) => e.target.style.borderColor = '#ff007f'}
              onBlur={(e) => e.target.style.borderColor = '#3d3563'}
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#00f2fe' }}>Password</label>
            <input 
              type="password" 
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px', boxSizing: 'border-box', backgroundColor: '#130f26', border: '2px solid #3d3563', borderRadius: '10px', fontSize: '14px', color: '#fff', outline: 'none', transition: '0.3s' }}
              onFocus={(e) => e.target.style.borderColor = '#ff007f'}
              onBlur={(e) => e.target.style.borderColor = '#3d3563'}
            />
          </div>

          {/* Electric Cyan Neon Button */}
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              background: 'linear-gradient(90deg, #00f2fe 0%, #4facfe 100%)', 
              color: '#0f0c1b',
              border: 'none', 
              borderRadius: '10px', 
              padding: '14px', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              fontWeight: '700',
              fontSize: '16px',
              boxShadow: '0 4px 15px rgba(0, 242, 254, 0.4)',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(0, 242, 254, 0.6)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(0, 242, 254, 0.4)';
            }}
          >
            {loading ? 'Verifying Credentials... ⏳' : 'Sign In'}
          </button>
        </form>

        {/* Error Alert Box */}
        {error && (
          <div style={{ 
            marginTop: '25px', 
            padding: '12px', 
            backgroundColor: 'rgba(229, 62, 62, 0.15)', 
            borderLeft: '4px solid #e53e3e', 
            borderRadius: '6px', 
            color: '#fc8181', 
            fontSize: '13px',
            fontWeight: '500'
          }}>
            <b>🛑 Login Error:</b> {error}
          </div>
        )}

        <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.1)', margin: '25px 0' }} />
        
        {/* Switch to Register link */}
        <p style={{ fontSize: '14px', margin: '0', color: '#a0aec0', textAlign: 'center' }}>
          New to Amazon?{' '}
          <span 
            onClick={() => navigate('/signup')} 
            style={{ color: '#ff007f', cursor: 'pointer', fontWeight: '600', textDecoration: 'none', transition: '0.2s' }}
            onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
            onMouseOut={(e) => e.target.style.textDecoration = 'none'}
          >
            Create your account
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;