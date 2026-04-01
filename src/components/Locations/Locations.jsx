import React, { useRef, useState, useEffect } from 'react';
import './Locations.css';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

var settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
};

const defaultHotels = [
  { id: 1, name: 'NORTHRIDGE BY APEX', location: 'Batakundi, Naran Valley', image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800', size: 'small' },
  { id: 2, name: 'APEX SIGNATURE HOTEL', location: 'Islamabad Capital Territory', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800', size: 'tall' },
  { id: 3, name: 'WALNUT HEIGHTS BY APEX', location: 'Kalam Valley, Khyber Pakhtunkhwa', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', size: 'medium' },
  { id: 4, name: 'THE ROYER BY APEX', location: 'Phander Valley', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800', size: 'medium' },
  { id: 5, name: 'THE APEX LODGE', location: 'Murree, Punjab', image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800', size: 'medium' },
  { id: 6, name: 'ZHULE BY APEX', location: 'Skardu', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', size: 'medium' },
  { id: 7, name: 'APEX MOUNTAIN TOP RESORT', location: 'Batakundi, Naran Valley', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800', size: 'wide' },
  { id: 8, name: 'APEX YURTS GULMIT', location: 'Gulmit, Hunza Valley', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', size: 'medium' },
];

const Locations = ({ data }) => {
  const slickRef = useRef(null);

  const items = data && data.length > 0 ? data : defaultHotels;

  // Auto-assign size based on position within each group of 8
  // Pattern: small, tall(2-row), medium, medium, medium, medium, wide(2-col), medium
  const sizePattern = ['small', 'tall', 'medium', 'medium', 'medium', 'medium', 'wide', 'medium'];
  const getSize = (index) => sizePattern[index % 8] || 'medium';

  // Split items into slides of 8
  const slides = [];
  for (let i = 0; i < items.length; i += 8) {
    slides.push(items.slice(i, i + 8));
  }
  // If only one slide, duplicate it so the slider works
  if (slides.length < 2) slides.push(slides[0]);

  return (
    <section className="locations-section">
      <div className="container-custom">
        <div className="locations-header">
          <div className="locations-title-area">
            <h2 className="section-title">APEX HOTEL LOCATIONS</h2>
            <p className="section-subtitle">Unlock new memories with us</p>
          </div>
          <div className="locations-nav">
            <span className="view-more-text">VIEW MORE</span>
            <div className="nav-arrows">
              <button
                className="nav-arrow prev"
                onClick={() => slickRef.current && slickRef.current.slickPrev()}
                aria-label="Previous"
              >←</button>
              <button
                className="nav-arrow next"
                onClick={() => slickRef.current && slickRef.current.slickNext()}
                aria-label="Next"
              >→</button>
            </div>
          </div>
        </div>
        <Slider {...settings} ref={slickRef}>
          {slides.map((slideItems, sIdx) => (
            <div key={sIdx}>
              <div className="hotels-grid">
                {slideItems.map((hotel, idx) => (
                  <div key={hotel.id || idx} className={`hotel-card ${getSize(idx)}`}>
                    <div className="hotel-image" style={{ backgroundImage: `url(${hotel.image})` }}>
                      <div className="hotel-info">
                        <h3>{hotel.name}</h3>
                        <p>{hotel.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Locations;
