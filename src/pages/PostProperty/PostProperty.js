import React, { useState } from 'react';
import './PostProperty.css';

const PostProperty = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: '',
    city: '',
    location: '',
    price: '',
    beds: '',
    baths: '',
    area: '',
    features: [],
    ownerName: '',
    ownerPhone: '',
    ownerEmail: ''
  });

  const featureOptions = [
    'Fully Furnished',
    'AC & Heater',
    'WiFi',
    'Parking',
    'Security',
    'Power Backup',
    'Elevator',
    'Gym'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFeatureToggle = (feature) => {
    const newFeatures = formData.features.includes(feature)
      ? formData.features.filter(f => f !== feature)
      : [...formData.features, feature];
    
    setFormData({
      ...formData,
      features: newFeatures
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Property posted successfully! (This is a demo)');
  };

  return (
    <div className="post-property-page">
      <div className="post-header">
        <div className="container">
          <h1>Post Your Property</h1>
          <p>List your property and connect with thousands of potential tenants</p>
        </div>
      </div>

      <div className="container">
        <div className="post-content">
          <form onSubmit={handleSubmit} className="post-form">
            {/* Property Details */}
            <div className="form-section">
              <h2>Property Details</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Property Title *</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g., Spacious Room in DHA"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    placeholder="Describe your property..."
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Property Type *</label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="room">Room</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="studio">Studio</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>City *</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select City</option>
                    <option value="karachi">Karachi</option>
                    <option value="lahore">Lahore</option>
                    <option value="islamabad">Islamabad</option>
                    <option value="rawalpindi">Rawalpindi</option>
                    <option value="faisalabad">Faisalabad</option>
                    <option value="multan">Multan</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Complete Address *</label>
                  <input
                    type="text"
                    name="location"
                    placeholder="e.g., DHA Phase 5, Street 12"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Monthly Rent (PKR) *</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="25000"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Area (sq ft) *</label>
                  <input
                    type="number"
                    name="area"
                    placeholder="150"
                    value={formData.area}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Bedrooms *</label>
                  <select
                    name="beds"
                    value={formData.beds}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5+</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Bathrooms *</label>
                  <select
                    name="baths"
                    value={formData.baths}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="form-section">
              <h2>Features & Amenities</h2>
              <div className="features-grid">
                {featureOptions.map((feature) => (
                  <label key={feature} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={() => handleFeatureToggle(feature)}
                    />
                    <span>{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="form-section">
              <h2>Contact Information</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Your Name *</label>
                  <input
                    type="text"
                    name="ownerName"
                    placeholder="Full Name"
                    value={formData.ownerName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="ownerPhone"
                    placeholder="+92 300 1234567"
                    value={formData.ownerPhone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="ownerEmail"
                    placeholder="your@email.com"
                    value={formData.ownerEmail}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn-submit">
              Post Property
            </button>
          </form>

          <aside className="post-sidebar">
            <div className="tips-card">
              <h3>Tips for a Great Listing</h3>
              <ul>
                <li>Use a clear and descriptive title</li>
                <li>Provide detailed description</li>
                <li>Be honest about the property condition</li>
                <li>Include accurate pricing</li>
                <li>Mention nearby facilities</li>
                <li>Add high-quality photos (coming soon)</li>
                <li>Respond quickly to inquiries</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PostProperty;
