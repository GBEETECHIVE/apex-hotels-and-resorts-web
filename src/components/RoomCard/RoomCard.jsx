import React from 'react';
import './RoomCard.css';

const RoomCard = ({
  image,
  title,
  price,
  amenities = [],
  onBook,
  onGallery,
}) => (
  <div className="room-card">
    <div className="room-card-img-wrap">
      <img src={image} alt={title} className="room-card-img" />
      <button className="room-card-gallery-btn" onClick={onGallery}>
        <span role="img" aria-label="gallery">🖼️</span> View Gallery
      </button>
      <div className="room-card-price">Starts From PKR {price}</div>
    </div>
    <div className="room-card-title">{title}</div>
    <div className="room-card-amenities">
      {amenities.map((item, idx) => (
        <span key={idx} className="room-card-amenity">{item.icon} {item.label}</span>
      ))}
    </div>
    <button className="room-card-book-btn" onClick={onBook}>Book Now</button>
  </div>
);

export default RoomCard;
