import React, { useState, useEffect } from 'react';
import './Home.css';
// import DineInThreeColumn from '../../components/DineInThreeColumn';
import Travel from '../../components/Travel/Travel';
import DineIn from '../../components/DineIn/DineIn';
import Locations from '../../components/Locations/Locations';
import OffersBanner from '../../components/OffersBanner/OffersBanner';
import AppSection from '../../components/AppSection/AppSection';
import ContactSection from '../../components/ContactSection/ContactSection';
import StickyBooking from '../../components/StickyBooking/StickyBooking';
import Hero from '../../components/Hero/Hero';

const Home = () => {
  const [activeSlide, setActiveSlide] = useState(1);
  const [activeDining, setActiveDining] = useState(0);
  const [showStickyBooking, setShowStickyBooking] = useState(false);
  const totalSlides = 6;
  const heroSlides = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1920',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920',
    'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1920',
    'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=1920',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920'
  ];

  const diningOptions = [
    {
      id: 1,
      name: 'SKY LIGHT',
      description: 'ROOMY SIGNATURE HOTEL, ISLAMABAD',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800'
    },
    {
      id: 2,
      name: 'THE ROOMY CAFE',
      description: 'THE ROOMY LODGE, MURREE',
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800'
    },
    {
      id: 3,
      name: 'BURGERVILLE BY ROOMY',
      description: 'BATAKUNDI, NARAN VALLEY',
      image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600) {
        setShowStickyBooking(true);
      } else {
        setShowStickyBooking(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const nextDining = () => {
    setActiveDining((prev) => (prev + 1) % diningOptions.length);
  };

  const prevDining = () => {
    setActiveDining((prev) => (prev - 1 + diningOptions.length) % diningOptions.length);
  };

  return (
    <div className="home">
      {/* Sticky Booking Bar */}
      {showStickyBooking && <StickyBooking />}

      <Hero slides={heroSlides} activeSlide={activeSlide} setActiveSlide={setActiveSlide} />

      <Travel />

      <Locations />

      <DineIn items={diningOptions} />

      <OffersBanner />

      <AppSection />

      <ContactSection />
      
    </div>
  );
};

export default Home;
