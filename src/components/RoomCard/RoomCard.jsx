import React from 'react';
import './RoomCard.css';

const RoomCard = ({
  image,
  images,
  title,
  price,
  amenities = [],
  onBook,
  onViewDetail,
  onGallery,
  isAvailable = true,
}) => {
  const imgList = Array.isArray(images) && images.length > 0 ? images : (image ? [image] : []);
  const mainImg = imgList[0] || '';

  const statusLabel = isAvailable ? 'Available' : 'Not Available';

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
              <span>{statusLabel}</span>
            </div>
          </div>
        )}
        <div className="room-card-price">Starts From PKR {price}</div>
      </div>
      <div className="room-card-title-row">
        <div className="room-card-title">{title}</div>
        <div className={`room-card-status-badge${isAvailable ? ' available' : ' unavailable'}`}>
          {statusLabel}
        </div>
      </div>
      <div className="room-card-amenities">
        {amenities.map((item, idx) => (
          <span key={idx} className="room-card-amenity">{item.icon} {item.label}</span>
        ))}
      </div>
      <div className="room-card-actions">
        {typeof onViewDetail === 'function' && (
          <button
            className="room-card-view-btn"
            onClick={onViewDetail}
          >
            View Details
          </button>
        )}
        {isAvailable && (
          <button
            className="room-card-book-btn"
            onClick={onBook}
          >
            Book Now
          </button>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
