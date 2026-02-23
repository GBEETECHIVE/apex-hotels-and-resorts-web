import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <div className="logo-icon">🏨</div>
              <span className="logo-text">ROOMY</span>
            </div>
            <div className="payment-methods">
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="Mastercard" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" />
            </div>
          </div>

          <div className="footer-section">
            <h4>CUSTOMER REVIEWS</h4>
            <div className="reviews">
              <div className="review-item">
                <div className="reviewer-avatar">A</div>
                <div className="review-text">
                  <strong>John Smith</strong>
                  <p>Amazing experience! The hotel was perfect.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-section">
            <h4>MENU</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/listings">Find Hotels</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>GENERAL</h4>
            <ul>
              <li><Link to="/listings">Locations</Link></li>
              <li><Link to="/about">Careers</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>WE ALSO VISIT</h4>
            <div className="partner-logos">
              <div className="partner-logo">🏨</div>
              <div className="partner-logo">🏨</div>
              <div className="partner-logo">🏨</div>
            </div>
          </div>

          <div className="footer-section">
            <h4>SOCIAL MEDIA US</h4>
            <div className="social-icons">
              <a href="https://facebook.com" className="social-icon" target="_blank" rel="noopener noreferrer">🔵</a>
              <a href="https://twitter.com" className="social-icon" target="_blank" rel="noopener noreferrer">🐦</a>
              <a href="https://instagram.com" className="social-icon" target="_blank" rel="noopener noreferrer">📷</a>
              <a href="https://youtube.com" className="social-icon" target="_blank" rel="noopener noreferrer">▶️</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Roomy Hotels. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
