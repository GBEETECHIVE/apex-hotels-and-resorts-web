import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-wrapper">
        <Link to="/" className="logo">
          <div className="logo-icon">🏨</div>
          <span className="logo-text">APEX HOTEL AND RESORTS</span>
        </Link>
        
        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={() => setIsMenuOpen(false)}>HOME</Link>
          <Link to="/destinations" onClick={() => setIsMenuOpen(false)}>HOTELS</Link>
          <Link to="/listings" onClick={() => setIsMenuOpen(false)}>DESTINATIONS</Link>
          {/* <Link to="/about" onClick={() => setIsMenuOpen(false)}>EVENTS</Link> */}
          <Link to="/contact" onClick={() => setIsMenuOpen(false)}>GETAWAYS</Link>
        </div>

        <div className="nav-actions">
          <button className="btn-login"><span className="user-icon">👤</span> SIGN IN</button>
          <button className="btn-call">CALL US</button>
        </div>

        <div className="hamburger" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
