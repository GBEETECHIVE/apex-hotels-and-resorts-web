import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './PropertyDetail.css';

const PropertyDetail = () => {
  const [activeImage, setActiveImage] = useState(0);

  // Sample property data (in a real app, this would come from an API)
  const property = {
    id: 1,
    title: 'Spacious Room in DHA Phase 5',
    location: 'DHA Phase 5, Karachi',
    price: '25,000',
    type: 'Room',
    beds: 1,
    baths: 1,
    area: '150 sq ft',
    city: 'Karachi',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
      'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800'
    ],
    description: 'Beautiful and spacious room available for rent in the heart of DHA Phase 5. Perfect for students and young professionals. The room comes with all modern amenities and is located in a safe and secure neighborhood.',
    features: [
      'Fully Furnished',
      'Attached Bathroom',
      'AC & Heater',
      'High-Speed Internet',
      'Power Backup',
      'Parking Available',
      'Security 24/7',
      'Near Public Transport'
    ],
    amenities: [
      'Kitchen Access',
      'Laundry Service',
      'Common Area',
      'Gym',
      'Elevator'
    ],
    owner: {
      name: 'Ahmed Khan',
      phone: '+92 300 1234567',
      email: 'ahmed@example.com',
      memberSince: 'January 2024'
    },
    postedDate: '2 days ago',
    views: 245
  };

  const handleContact = () => {
    alert('Contact feature would open messaging or call functionality');
  };

  return (
    <div className="property-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/listings">Properties</Link>
          <span>/</span>
          <span>{property.title}</span>
        </div>

        {/* Image Gallery */}
        <div className="image-gallery">
          <div className="main-image">
            <img src={property.images[activeImage]} alt={property.title} />
          </div>
          <div className="thumbnail-images">
            {property.images.map((image, index) => (
              <div
                key={index}
                className={`thumbnail ${activeImage === index ? 'active' : ''}`}
                onClick={() => setActiveImage(index)}
              >
                <img src={image} alt={`View ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="detail-layout">
          {/* Main Content */}
          <div className="detail-content">
            <div className="property-header">
              <div>
                <span className="property-type-badge">{property.type}</span>
                <h1>{property.title}</h1>
                <p className="location">📍 {property.location}</p>
              </div>
              <div className="price-section">
                <div className="price">PKR {property.price}<span>/month</span></div>
              </div>
            </div>

            <div className="property-stats">
              <div className="stat">
                <span className="stat-icon">🛏️</span>
                <div>
                  <div className="stat-value">{property.beds}</div>
                  <div className="stat-label">Bedroom</div>
                </div>
              </div>
              <div className="stat">
                <span className="stat-icon">🚿</span>
                <div>
                  <div className="stat-value">{property.baths}</div>
                  <div className="stat-label">Bathroom</div>
                </div>
              </div>
              <div className="stat">
                <span className="stat-icon">📐</span>
                <div>
                  <div className="stat-value">{property.area}</div>
                  <div className="stat-label">Area</div>
                </div>
              </div>
              <div className="stat">
                <span className="stat-icon">👁️</span>
                <div>
                  <div className="stat-value">{property.views}</div>
                  <div className="stat-label">Views</div>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h2>Description</h2>
              <p>{property.description}</p>
            </div>

            <div className="detail-section">
              <h2>Features</h2>
              <div className="features-list">
                {property.features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <span className="checkmark">✓</span>
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h2>Amenities</h2>
              <div className="amenities-list">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="amenity-item">
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="detail-sidebar">
            <div className="contact-card">
              <h3>Contact Owner</h3>
              <div className="owner-info">
                <div className="owner-avatar">
                  {property.owner.name.charAt(0)}
                </div>
                <div>
                  <h4>{property.owner.name}</h4>
                  <p>Member since {property.owner.memberSince}</p>
                </div>
              </div>
              
              <button onClick={handleContact} className="btn-contact">
                📞 Call Now
              </button>
              <button onClick={handleContact} className="btn-message">
                💬 Send Message
              </button>
              
              <div className="contact-info">
                <p><strong>Phone:</strong> {property.owner.phone}</p>
                <p><strong>Email:</strong> {property.owner.email}</p>
              </div>
            </div>

            <div className="info-card">
              <h3>Property Information</h3>
              <div className="info-item">
                <span className="info-label">Type:</span>
                <span className="info-value">{property.type}</span>
              </div>
              <div className="info-item">
                <span className="info-label">City:</span>
                <span className="info-value">{property.city}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Posted:</span>
                <span className="info-value">{property.postedDate}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Property ID:</span>
                <span className="info-value">#{property.id}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
