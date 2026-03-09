import React, { useRef, useState, useEffect } from 'react';
import './Locations.css';

import Slider from "react-slick";
import Hero from '../Hero/Hero';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };


const hotels = [
  {
    id: 1,
    name: 'NORTHRIDGE BY ROOMY',
    location: 'Batakundi, Naran Valley',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
    size: 'small'
  },
  {
    id: 2,
    name: 'ROOMY SIGNATURE HOTEL',
    location: 'Islamabad Capital Territory',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
    size: 'tall'
  },
  {
    id: 3,
    name: 'WALNUT HEIGHTS BY ROOMY',
    location: 'Kalam Valley, Khyber Pakhtunkhwa',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    size: 'medium'
  },
  {
    id: 4,
    name: 'THE ROYER BY ROOMY',
    location: 'Phander Valley',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
    size: 'medium'
  },
  {
    id: 5,
    name: 'THE ROOMY LODGE',
    location: 'Murree, Punjab',
    image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
    size: 'medium'
  },
  {
    id: 6,
    name: 'ZHULE BY ROOMY',
    location: 'Skardu',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    size: 'medium'
  },
  {
    id: 7,
    name: 'ROOMY MOUNTAIN TOP RESORT',
    location: 'Batakundi, Naran Valley',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
    size: 'wide'
  },
  {
    id: 8,
    name: 'ROOMY YURTS GULMIT',
    location: 'Gulmit, Hunza Valley',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    size: 'medium'
  }
];
const new_content = [
  {
    id: 1,
    name: 'NORTHRIDGE BY ROOM',
    location: 'Batakundi, Naran Valley',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
    size: 'small'
  },
  {
    id: 2,
    name: 'ROOMY SIGNATURE',
    location: 'Islamabad Capital Territory',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
    size: 'tall'
  },
  {
    id: 3,
    name: 'WALNUT  BY ROOMY',
    location: 'Kalam Valley, Khyber Pakhtunkhwa',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    size: 'medium'
  },
  {
    id: 4,
    name: 'THE ROYER  ROOMY',
    location: 'Phander Valley',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
    size: 'medium'
  },
  {
    id: 5,
    name: 'THE ROOMY LODGE',
    location: 'Murree, Punjab',
    image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
    size: 'medium'
  },
  {
    id: 6,
    name: 'ZHULE  ROOMY',
    location: 'Skardu',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    size: 'medium'
  },
  {
    id: 7,
    name: 'ROOMY  TOP RESORT',
    location: 'Batakundi, Naran Valley',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
    size: 'wide'
  },
  {
    id: 8,
    name: 'ROOMY YURTS GULMIT',
    location: '',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    size: 'medium'
  }
];

const Locations = () => {
  const sliderRef = useRef(null);
  const slickRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [items, setItems] = useState(hotels);
  const [currentDiv , setCurrentDiv]=useState(0)

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    const check = () => {
      setCanPrev(el.scrollLeft > 10);
      setCanNext(el.scrollLeft + el.clientWidth + 10 < el.scrollWidth);
    };
    check();
    el.addEventListener('scroll', check);
    window.addEventListener('resize', check);
    return () => {
      el.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, []);

  // Slide the horizontal container by one viewport width on arrow click
  const scrollByAmount = (direction = 1) => {
    const el = sliderRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth) * direction;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <>
    
      <section className="locations-section">
        <div className="container-custom">
          <div className="locations-header">
            <div className="locations-title-area">
              <h2 className="section-title">ROOMY HOTEL LOCATIONS</h2>
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
            <div>
              <div className="hotels-grid">
                {items.map(hotel => (
                  <div key={hotel.id} className={`hotel-card ${hotel.size}`}>
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
            <div>
              <div className="hotels-grid">
                {new_content.map(hotel => (
                  <div key={hotel.id} className={`hotel-card ${hotel.size}`}>
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
          </Slider>
        </div>
      </section>
    </>
  );
};

export default Locations;
