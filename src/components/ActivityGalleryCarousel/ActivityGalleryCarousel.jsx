import React, { useState } from 'react';
import './ActivityGalleryCarousel.css';

const ActivityGalleryCarousel = ({ slides }) => {
  const [imgIndex, setImgIndex] = useState(0);
  if (!slides?.length || !slides[0]?.images?.length) {
    return null;
  }
  const images = slides[0].images;
  const totalImages = images.length;

  const handlePrev = () => {
    setImgIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };
  const handleNext = () => {
    setImgIndex((prev) => (prev + 1) % totalImages);
  };

  const currentImage = images[imgIndex];
  const { title, description } = slides[0];

  return (
    <div className="activity-gallery-carousel">
      <div className="activity-gallery-columns">
        <div className="activity-gallery-image-panel">
          <button className="activity-arrow activity-arrow-left" onClick={handlePrev} aria-label="Previous image">
            &larr;
          </button>
          <img src={currentImage} alt="Gallery" className="activity-gallery-main-image" />
          <button className="activity-arrow activity-arrow-right" onClick={handleNext} aria-label="Next image">
            &rarr;
          </button>
        </div>
        <div className="activity-gallery-info-panel">
          <h2 className="activity-gallery-title">{title}</h2>
          <p className="activity-gallery-desc">{description}</p>
        </div>
          </div>
    </div>
  );
};

export default ActivityGalleryCarousel;
