import React from 'react';
import './Travel.css';

const Travel = () => {
  return (
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
  );
};

export default Travel;
