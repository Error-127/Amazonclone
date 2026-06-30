import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config'; // 👈 Step 1: Import your live Render URL from config.js

function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  
  // States to handle your search values and filter results locally
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch Products from Backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Step 2: Swap out the old localhost string with your cloud variable
        const res = await axios.get(`${API_BASE_URL}/products`);
        const data = res.data || [];
        setProducts(data);
        setFilteredProducts(data); 
      } catch (err) {
        console.error("Error loading home inventory:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Create a dynamic list of 5 slides from your database inventory
  const carouselSlides = products.slice(0, 5).map((product) => ({
    id: product._id || product.id,
    image: product.image || product.thumbnail,
    title: product.title,
    subtitle: `Limited Time Offer — Grab yours today!`
  }));

  // Auto-advance Carousel Effect (Transitions every 4 seconds)
  useEffect(() => {
    if (carouselSlides.length === 0) return;
    
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 4000);
    return () => clearInterval(slideTimer);
  }, [carouselSlides.length]);

  const nextSlide = () => {
    if (carouselSlides.length > 0) {
      setCurrentSlide((currentSlide + 1) % carouselSlides.length);
    }
  };
  
  const prevSlide = () => {
    if (carouselSlides.length > 0) {
      setCurrentSlide((currentSlide - 1 + carouselSlides.length) % carouselSlides.length);
    }
  };

  // Real-time search handler function matching titles/descriptions
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredProducts(products);
    } else {
      const lowerCaseQuery = query.toLowerCase();
      const filtered = products.filter(product => 
        product.title?.toLowerCase().includes(lowerCaseQuery) ||
        product.description?.toLowerCase().includes(lowerCaseQuery) ||
        product.category?.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredProducts(filtered);
    }
  };

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', fontSize: '18px' }}>Loading Amazon Dashboard... ⏳</div>;

  return (
    <div style={{ background: '#eaeded', minHeight: '100vh', fontFamily: 'Arial, sans-serif', paddingBottom: '40px' }}>
      
      {/* 1. LIGHT BLUE GRADIENT CAROUSEL HERO */}
      {carouselSlides.length > 0 && (
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          height: '420px', 
          overflow: 'hidden', 
          background: 'linear-gradient(to bottom, #e3f2fd, #bbdefb)', 
          borderBottom: '1px solid #90caf9'
        }}>
          
          {/* Navigation Buttons */}
          <button onClick={prevSlide} style={{ position: 'absolute', left: '20px', top: '45%', zIndex: 10, background: 'rgba(255,255,255,0.7)', color: '#004b87', border: '1px solid #90caf9', borderRadius: '50%', width: '45px', height: '45px', fontSize: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>‹</button>
          <button onClick={nextSlide} style={{ position: 'absolute', right: '20px', top: '45%', zIndex: 10, background: 'rgba(255,255,255,0.7)', color: '#004b87', border: '1px solid #90caf9', borderRadius: '50%', width: '45px', height: '45px', fontSize: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>›</button>

          {/* Carousel Active Slide Content Link */}
          <div 
            onClick={() => navigate(`/products/${carouselSlides[currentSlide].id}`)}
            style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '10px 0' }}
          >
            {/* Main Product Image */}
            <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
              <img 
                src={carouselSlides[currentSlide].image} 
                alt={carouselSlides[currentSlide].title}
                style={{ maxHeight: '100%', maxWidth: '90%', objectFit: 'contain', filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.12))' }}
              />
            </div>
            
            {/* Clear, Crisp Text Overlay Banner */}
            <div style={{
              width: '85%',
              maxWidth: '800px',
              background: '#ffffff',
              padding: '15px 25px',
              borderRadius: '8px',
              borderTop: '4px solid #007185',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              textAlign: 'center',
              marginTop: '15px'
            }}>
              <h2 style={{ 
                margin: 0, 
                fontSize: '18px', 
                fontWeight: 'bold', 
                color: '#111111',
                whiteSpace: 'nowrap', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis' 
              }}>
                {carouselSlides[currentSlide].title}
              </h2>
              <p style={{ 
                margin: '5px 0 0 0', 
                color: '#b12704',
                fontSize: '14px',
                fontWeight: 'bold' 
              }}>
                {carouselSlides[currentSlide].subtitle}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. DYNAMIC CONTENT CARD CONTAINERS */}
      <div style={{ maxWidth: '1400px', margin: '30px auto 0 auto', padding: '0 20px', position: 'relative', zIndex: 5 }}>
        
        {/* 🔍 INJECTED SEARCH BAR FIELD */}
        <div style={{ maxWidth: '100%', margin: '0 auto 25px auto', display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', width: '100%', maxWidth: '650px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
            <input 
              type="text" 
              placeholder="Search catalog products right here..." 
              value={searchQuery}
              onChange={handleSearchChange}
              style={{
                width: '100%',
                padding: '12px 20px',
                fontSize: '15px',
                border: '1px solid #cccccc',
                borderRight: 'none',
                borderRadius: '4px 0 0 4px',
                outline: 'none',
                height: '46px',
                boxSizing: 'border-box'
              }}
            />
            <div style={{
              background: '#febd69',
              padding: '0 22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '46px',
              boxSizing: 'border-box',
              fontSize: '16px',
              border: '1px solid #cccccc',
              borderLeft: 'none'
            }}>
              🔍
            </div>
          </div>
        </div>

        <h3 style={{
          background: '#fff',
          padding: '15px 25px',
          margin: '0 0 20px 0',
          borderRadius: '4px',
          fontSize: '22px',
          fontWeight: 'bold',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          Featured Department Products
        </h3>

        {/* Grid System maps through filteredProducts */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div 
                key={product._id || product.id}
                onClick={() => navigate(`/products/${product._id || product.id}`)}
                style={{
                  background: '#ffffff',
                  padding: '20px',
                  borderRadius: '4px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ width: '100%', height: '200px', background: '#f7f7f7', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', marginBottom: '15px', overflow: 'hidden' }}>
                  <img 
                    src={product.image || product.thumbnail} 
                    alt={product.title} 
                    style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                  />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '15px', fontWeight: 'bold', color: '#111', lineHeight: '1.4', height: '42px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {product.title}
                    </h4>
                    <p style={{ margin: '0 0 10px 0', color: '#007185', fontSize: '13px' }}>★ ★ ★ ★ ☆</p>
                  </div>

                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#B12704', marginBottom: '15px' }}>
                      ₹{product.price ? Number(product.price).toLocaleString('en-IN') : '0'}
                    </div>
                    
                    <button style={{
                      width: '100%',
                      padding: '8px 0',
                      background: '#ffd814',
                      border: '1px solid #fcd200',
                      borderRadius: '20px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}>
                      View Details
                    </button>
                  </div>
                </div>

              </div>
            ))
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              padding: '40px', 
              background: '#ffffff',
              borderRadius: '4px',
              color: '#565959',
              fontSize: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              No matching products found for "{searchQuery}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;