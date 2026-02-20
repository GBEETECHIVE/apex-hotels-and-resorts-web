import React from 'react';
import { Link } from 'react-router-dom';
import './PropertyCard.css';

const PropertyCard = ({ property }) => {
  return (
    <Link to={`/property/${property.id}`} className="property-card">
      <div className="property-image" style={{ backgroundImage: `url(${property.image})` }}>
        <div className="property-badge">{property.type}</div>
      </div>
      <div className="property-details">
        <h3 className="property-title">{property.title}</h3>
        <p className="property-location">📍 {property.location}</p>
        
        <div className="property-features">
          <span>🛏️ {property.beds} Bed</span>
          <span>🚿 {property.baths} Bath</span>
          <span>📐 {property.area}</span>
        </div>

        <div className="property-footer">
          <div className="property-price">
            <span className="price-label">PKR</span>
            <span className="price-value">{property.price}</span>
            <span className="price-period">/month</span>
          </div>
          <button className="btn-details">View Details</button>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
