import React, { useState, useEffect } from 'react';
import './Home.css';
// import DineInThreeColumn from '../../components/DineInThreeColumn';

const Home = () => {
  const [activeSlide, setActiveSlide] = useState(1);
  const [activeDining, setActiveDining] = useState(0);
  const [showStickyBooking, setShowStickyBooking] = useState(false);
  const totalSlides = 6;
  const hotels = [
    {
      id: 1,
      name: 'NORTHRIDGE BY ROOMY',
      location: 'Batakundi, Naran Valley',
      image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
      size: 'small'
    },
    {
      id: 2,
      name: 'ROOMY SIGNATURE HOTEL',
      location: 'Islamabad Capital Territory',
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
      size: 'tall'
    },
    {
      id: 3,
      name: 'WALNUT HEIGHTS BY ROOMY',
      location: 'Kalam Valley, Khyber Pakhtunkhwa',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      size: 'medium'
    },
    {
      id: 4,
      name: 'THE ROYER BY ROOMY',
      location: 'Phander Valley',
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
      size: 'medium'
    },
    {
      id: 5,
      name: 'THE ROOMY LODGE',
      location: 'Murree, Punjab',
      image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
      size: 'medium'
    },
    {
      id: 6,
      name: 'ZHULE BY ROOMY',
      location: 'Skardu',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      size: 'medium'
    },
    {
      id: 7,
      name: 'ROOMY MOUNTAIN TOP RESORT',
      location: 'Batakundi, Naran Valley',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
      size: 'wide'
    },
    {
      id: 8,
      name: 'ROOMY YURTS GULMIT',
      location: 'Gulmit, Hunza Valley',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      size: 'medium'
    }
  ];

  const diningOptions = [
    {
      id: 1,
      name: 'SKY LIGHT',
      description: 'ROOMY SIGNATURE HOTEL, ISLAMABAD',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800'
    },
    {
      id: 2,
      name: 'THE ROOMY CAFE',
      description: 'THE ROOMY LODGE, MURREE',
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800'
    },
    {
      id: 3,
      name: 'BURGERVILLE BY ROOMY',
      description: 'BATAKUNDI, NARAN VALLEY',
      image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600) {
        setShowStickyBooking(true);
      } else {
        setShowStickyBooking(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const nextDining = () => {
    setActiveDining((prev) => (prev + 1) % diningOptions.length);
  };

  const prevDining = () => {
    setActiveDining((prev) => (prev - 1 + diningOptions.length) % diningOptions.length);
  };

  return (
    <div className="home">
      {/* Sticky Booking Bar */}
      {showStickyBooking && (
        <div className="sticky-booking-bar">
          <div className="sticky-booking-content">
            <div className="sticky-booking-field">
              <label>Location</label>
              <span>Where Are You Going?</span>
            </div>
            <div className="sticky-booking-field">
              <label>Check In / Out</label>
              <span>Add Dates</span>
            </div>
            <div className="sticky-booking-field">
              <label>No. Of Rooms</label>
              <span>Add Rooms</span>
            </div>
            <button className="sticky-book-btn">BOOK NOW</button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-left">
            <h1>CHECK IN TO THE<br/>TIME OF YOUR LIFE</h1>
          </div>
          
          {/* Booking Widget - Right Side */}
          <div className="booking-widget">
            <div className="booking-field">
              <label>Location</label>
              <p className="field-value">Where Are You Going?</p>
            </div>
            <div className="booking-field">
              <label>Check In / Out</label>
              <p className="field-value">18 Feb - 04 Mar</p>
            </div>
            <div className="booking-field">
              <label>No. Of Rooms</label>
              <p className="field-value">1 Room</p>
            </div>
            <button className="btn-check-availability">
              <span>CHECK AVAILABILITY</span>
              <span className="search-icon">🔍</span>
            </button>
          </div>
        </div>

        {/* Carousel Navigation */}
        <div className="carousel-nav">
          <div className="carousel-dots">
            {[1, 2, 3, 4, 5, 6].map(num => (
              <button 
                key={num} 
                className={`carousel-dot ${activeSlide === num ? 'active' : ''}`}
                onClick={() => setActiveSlide(num)}
              >
                {num < 10 ? `0${num}` : num}
              </button>
            ))}
          </div>
          <div className="carousel-progress">
            {[1, 2, 3, 4, 5, 6].map(num => (
              <div 
                key={num} 
                className={`progress-segment ${activeSlide === num ? 'active' : ''}`}
              ></div>
            ))}
          </div>
        </div>

        {/* Scroll Down Arrow */}
        <button className="scroll-down" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}></button>

        {/* Floating Action Buttons */}
        <div className="floating-actions">
          <a href="tel:+923001234567" className="floating-btn phone-btn">📞</a>
          <a href="https://wa.me/923001234567" className="floating-btn whatsapp-btn" target="_blank" rel="noopener noreferrer">💬</a>
        </div>
      </section>

      {/* Travel Section */}
      <section className="travel-section">
        <div className="container-custom">
          <div className="travel-content">
            <div className="travel-image">
              <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800" alt="Travel" />
            </div>
            <div className="travel-text">
              <h2>TRAVEL LIKE<br/>NEVER BEFORE</h2>
              <p>At Roomy Hotels, we believe hotels should be more than just a place to rest your head at night. We're passionate about creating experiences that reimagine hospitality, the authentic that values experience as absolute.</p>
              <button className="btn-cta">TRY THE APP</button>
            </div>
          </div>
        </div>
      </section>

      {/* Hotel Locations */}
      <section className="locations-section">
        <div className="container-custom">
          <div className="locations-header">
            <div className="locations-title-area">
              <h2 className="section-title">ROOMY HOTEL LOCATIONS</h2>
              <p className="section-subtitle">Unlock new memories with us</p>
            </div>
            <div className="locations-nav">
              <span className="view-more-text">VIEW MORE</span>
              <div className="nav-arrows">
                <button className="nav-arrow prev">←</button>
                <button className="nav-arrow next">→</button>
              </div>
            </div>
          </div>
          
          <div className="hotels-grid">
            {hotels.map(hotel => (
              <div key={hotel.id} className={`hotel-card ${hotel.size}`}>
                <div className="hotel-image" style={{ backgroundImage: `url(${hotel.image})` }}>
                  <div className="hotel-info">
                    <h3>{hotel.name}</h3>
                    <p>{hotel.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dine-In Section */}
        {/* Dine-In Section */}
        {/* ...original Dine-In section code here... */}

      {/* Offers Banner */}
      <section className="offers-banner">
        <div className="offers-content">
          <div className="offers-text">
            <h3>See the<br/><span className="highlight">offers & deals</span></h3>
            <p>Get exclusive offers on stays & deals to make new memories with us</p>
          </div>
          <button className="btn-premium">Premium Deal</button>
        </div>
      </section>

      {/* App Section */}
      <section className="app-section">
        <div className="container-custom">
          <div className="app-content">
            <div className="app-image">
              <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600" alt="Mobile App" />
            </div>
            <div className="app-text">
              <h2>FAST CHECK IN APP</h2>
              <p>Check-in from the comfort of your home and spend the Roomy Holiday right from the point you arrive.</p>
              <div className="app-buttons">
                <a href="#google" className="app-btn">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" />
                </a>
                <a href="#apple" className="app-btn">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container-custom">
          <h2>CONTACT US</h2>
          <form className="contact-form">
            <div className="form-row">
              <input type="text" placeholder="Name" />
              <input type="email" placeholder="Email" />
            </div>
            <div className="form-row">
              <input type="tel" placeholder="Phone" />
              <textarea placeholder="Message" rows="4"></textarea>
            </div>
            <button type="submit" className="btn-submit">Send Message</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
