import React, { useMemo, useState } from 'react';
import './ExploreCard.css';

const ExploreCard = ({ title, image, hotels = [], onExplore }) => {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 2;
  const hasMultiple = hotels.length > visibleCount;

  const visibleHotels = useMemo(() => {
    if (!hotels.length) return [];
    const count = Math.min(visibleCount, hotels.length);
    return Array.from({ length: count }, (_, index) => hotels[(startIndex + index) % hotels.length]);
  }, [hotels, startIndex]);

  const handlePrev = () => {
    if (!hotels.length) return;
    setStartIndex((prev) => (prev - 1 + hotels.length) % hotels.length);
  };

  const handleNext = () => {
    if (!hotels.length) return;
    setStartIndex((prev) => (prev + 1) % hotels.length);
  };

  const handleHotelClick = (hotel) => {
    if (hotel.onClick) {
      hotel.onClick();
      return;
    }
    if (hotel.link) {
      window.location.href = hotel.link;
    }
  };

  return (
    <div className="explore-card" style={{ position: 'relative' }}>
      <div
        className="explore-card-gradient-bg"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(45, 48, 56, 0.5) 0%, rgba(118, 123, 138, 0.85) 100%), url(${image})`,
        }}
      />
      <div className="explore-card-overlay">
        <div className="explore-card-title-center">
          <h2 className="explore-card-title">{title}</h2>
        </div>
        <div className="explore-card-btn-center">
          <button className="explore-card-btn" onClick={onExplore}>EXPLORE</button>
        </div>
        <div className="explore-card-hotels-wrapper">
          {hasMultiple && (
            <button type="button" className="explore-mini-nav left" onClick={handlePrev} aria-label="Previous small cards">
              &#8592;
            </button>
          )}
          <div className="explore-card-hotels-row">
            {visibleHotels.map((hotel, idx) => (
              <button
                key={`${hotel.name}-${idx}`}
                type="button"
                className="explore-card-hotel-outer"
                onClick={() => handleHotelClick(hotel)}
              >
                <div className="explore-card-hotel">
                  <img src={hotel.image} alt={hotel.name} className="explore-card-hotel-img" />
                  <div className="explore-card-hotel-name">{hotel.name}</div>
                </div>
              </button>
            ))}
          </div>
          {hasMultiple && (
            <button type="button" className="explore-mini-nav right" onClick={handleNext} aria-label="Next small cards">
              &#8594;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExploreCard;
