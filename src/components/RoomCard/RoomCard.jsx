import React from 'react';
import './RoomCard.css';

const RoomCard = ({
  image,
  images,
  title,
  price,
  amenities = [],
  onBook,
  onGallery,
  isAvailable = true,
}) => {
  const imgList = Array.isArray(images) && images.length > 0 ? images : (image ? [image] : []);
  const mainImg = imgList[0] || '';

  return (
    <div className={`room-card${!isAvailable ? ' room-card--unavailable' : ''}`}>
      <div className="room-card-img-wrap">
        {mainImg && <img src={mainImg} alt={title} className="room-card-img" />}
        {imgList.length > 0 && (
          <button className="room-card-gallery-btn" onClick={() => onGallery && onGallery(imgList)}>
            <span role="img" aria-label="gallery">🖼️</span> View Images {imgList.length > 1 && `(${imgList.length})`}
          </button>
        )}
        {!isAvailable && (
          <div className="room-card-unavailable-overlay">
            <div className="room-card-unavailable-badge">
              <span className="room-card-unavailable-icon">🔒</span>
              <span>NOT AVAILABLE</span>
            </div>
          </div>
        )}
        <div className="room-card-price">Starts From PKR {price}</div>
      </div>
      <div className="room-card-title">{title}</div>
      <div className="room-card-amenities">
        {amenities.map((item, idx) => (
          <span key={idx} className="room-card-amenity">{item.icon} {item.label}</span>
        ))}
      </div>
      <button
        className={`room-card-book-btn${!isAvailable ? ' unavailable' : ''}`}
        onClick={onBook}
        disabled={!isAvailable}
      >
        {isAvailable ? 'Book Now' : '🔒 Room Not Available'}
      </button>
    </div>
  );
};

export default RoomCard;
