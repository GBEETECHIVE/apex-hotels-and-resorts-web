import React, { useState } from 'react';
import './Footer.css';

const customerReviews = [
  {
    name: 'Umair Jaswal',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    review: "Can't wait to revisit this beautiful lodge in Batakundi upper Naran. Thank you for your hospitality.",
  },
  {
    name: 'Humna Raza',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    review: 'Surrounding Roomy Mountain Top Resort are these beautiful view spots & there is a river flowing too; I wanted to stop and take a picture at every spot but also didn’t want to be that annoying person.',
  },
  {
    name: 'Eva Zu Beck',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    review: 'Slept here btw. Actually one of the few modern, pretty and affordable hotels in Islamabad.',
  },
];

const journalEntries = [
  {
    title: 'Informative, Upbeat And Aspirational!',
    avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
    date: '15 February',
  },
  {
    title: 'Roomy Has Introduced A 3 Step Fast Check-In Feature',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    date: '1 Month Ago',
  },
  {
    title: 'Roomy Aims To Help The Local Economy Thrive!',
    avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
    date: '3 Months Ago',
  },
];

const partnerLogos = [
  { src: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Unilever_Logo.svg', alt: 'Unilever' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Hum_Network_logo.png', alt: 'HUM' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Nando%27s_logo.svg', alt: "Nando's" },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/KFC_logo.svg', alt: 'KFC' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/GIZ-Logo.png', alt: 'giz' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Abacus_Consulting_logo.png', alt: 'ABACUS' },
];

const paymentLogos = [
  { src: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png', alt: 'Mastercard' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg', alt: 'Visa' },
  { src: 'https://seeklogo.com/images/H/hbl-pay-logo-6B1B2B7B2A-seeklogo.com.png', alt: 'HBL Pay' },
];

const socialLinks = [
  { href: 'https://twitter.com', icon: 'fa fa-twitter', color: '#1da1f2' },
  { href: 'https://wa.me', icon: 'fa fa-whatsapp', color: '#25d366' },
  { href: 'https://instagram.com', icon: 'fa fa-instagram', color: '#e1306c' },
  { href: 'https://facebook.com', icon: 'fa fa-facebook', color: '#1877f3' },
  { href: 'https://linkedin.com', icon: 'fa fa-linkedin', color: '#0077b5' },
];

const Footer = () => {
  const [activeReview, setActiveReview] = useState(0);

  return (
    <footer className="footer-v2">
      <div className="footer-main">
        <div className="footer-col reviews-col">
          <h3>CUSTOMER REVIEWS</h3>
          <div className="reviews-list">
            <div className="review-item">
              <img className="review-avatar" src={customerReviews[activeReview].avatar} alt={customerReviews[activeReview].name} />
              <div>
                <div className="reviewer-name">{customerReviews[activeReview].name}</div>
                <div className="review-text">{customerReviews[activeReview].review}</div>
              </div>
            </div>
          </div>
          <div className="reviews-dots">
            {customerReviews.map((_, idx) => (
              <span
                key={idx}
                className={`dot${activeReview === idx ? ' active' : ''}`}
                onClick={() => setActiveReview(idx)}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>
        </div>
        <div className="footer-col menu-col">
          <h3>MENU</h3>
          <ul>
            <li>ABOUT US</li>
            <li>OUR LOCATIONS</li>
            <li>DINE IN</li>
            <li>PRIVACY POLICY</li>
            <li>TERMS & CONDITIONS</li>
            <li>CONTACT US</li>
          </ul>
        </div>
        <div className="footer-col journal-col">
          <h3>JOURNAL</h3>
          <div className="journal-list">
            {journalEntries.map((j, i) => (
              <div className="journal-item" key={i}>
                <img className="journal-avatar" src={j.avatar} alt={j.title} />
                <div>
                  <div className="journal-title">{j.title}</div>
                  <div className="journal-date">{j.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="footer-col host-col">
          <div className="footer-host-brand">
            <div className="footer-host-logo">
              <svg width="46" height="46" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="6" width="48" height="48" rx="8" fill="#2d3e50"/>
                <text x="30" y="38" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#fff">Apex</text>
              </svg>
              <span className="footer-host-logo-text">Hotel & Resorts</span>
            </div>
          </div>
          <h3>WE ALSO HOST</h3>
          <div className="host-logos">
            {partnerLogos.map((p, i) => (
              <img className="host-logo" src={p.src} alt={p.alt} key={i} />
            ))}
          </div>
          <div className="host-social-block">
            <span>FOLLOW US</span>
            <div className="footer-social-icons">
              {socialLinks.map((s, i) => (
                <a href={s.href} key={i} target="_blank" rel="noopener noreferrer" style={{ color: s.color }}>
                  <i className={s.icon}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="footer-social-row">
        <div className="footer-payments">
          {paymentLogos.map((p, i) => (
            <img className="payment-logo" src={p.src} alt={p.alt} key={i} />
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
