import React, { useState, useEffect } from 'react';
import './Home.css';
import Travel from '../../components/Travel/Travel';
import DineIn from '../../components/DineIn/DineIn';
import Locations from '../../components/Locations/Locations';
import OffersBanner from '../../components/OffersBanner/OffersBanner';
import AppSection from '../../components/AppSection/AppSection';
import ContactSection from '../../components/ContactSection/ContactSection';
import StickyBooking from '../../components/StickyBooking/StickyBooking';
import Hero from '../../components/Hero/Hero';
import { fetchCms } from '../../services/cmsApi';

/* Hardcoded fallbacks – used only while CMS data is loading or absent */
const defaultHeroSlides = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920',
  'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1920',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920',
];

const defaultDining = [
  { id: 1, name: 'SKY LIGHT', description: 'ROOMY SIGNATURE HOTEL, ISLAMABAD', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800' },
  { id: 2, name: 'THE ROOMY CAFE', description: 'THE ROOMY LODGE, MURREE', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800' },
  { id: 3, name: 'BURGERVILLE BY ROOMY', description: 'BATAKUNDI, NARAN VALLEY', image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800' },
];

const Home = () => {
  const [activeSlide, setActiveSlide] = useState(1);
  const [showStickyBooking, setShowStickyBooking] = useState(false);
  const [hp, setHp] = useState(null); // homePage from CMS

  useEffect(() => {
    fetchCms()
      .then((cms) => setHp(cms?.homePage || null))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowStickyBooking(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const heroSlides = hp?.hero?.slides?.length ? hp.hero.slides : defaultHeroSlides;
  const heroTitle = hp?.hero?.title || undefined;
  const heroPhone = hp?.hero?.phone || undefined;
  const heroWhatsapp = hp?.hero?.whatsapp || undefined;

  const diningItems = hp?.dining?.length ? hp.dining : defaultDining;
  const locations = hp?.locations?.length ? hp.locations : undefined;

  return (
    <div className="home">
      {showStickyBooking && <StickyBooking />}

      <Hero slides={heroSlides} activeSlide={activeSlide} setActiveSlide={setActiveSlide}
        title={heroTitle} phone={heroPhone} whatsapp={heroWhatsapp} />

      <Travel data={hp?.travel} />

      <Locations data={locations} />

      <DineIn items={diningItems} />

      <OffersBanner data={hp?.offersBanner} />

      <AppSection data={hp?.appSection} />

      <ContactSection data={hp?.contact} />
    </div>
  );
};

export default Home;
