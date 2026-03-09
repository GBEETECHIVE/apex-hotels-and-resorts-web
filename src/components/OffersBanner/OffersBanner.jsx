import React from 'react';
import './OffersBanner.css';

const OffersBanner = () => {
  return (
    <section className="offers-banner">
      <div className="offers-content">
        <div className="offers-text">
          <h3>See the<br/><span className="highlight">offers & deals</span></h3>
          <p>Get exclusive offers on stays & deals to make new memories with us</p>
        </div>
        <button className="btn-premium">Premium Deal</button>
      </div>
    </section>
  );
};

export default OffersBanner;
