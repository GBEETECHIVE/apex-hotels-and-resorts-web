import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../../components/Hero/Hero';
import ExploreCard from '../../components/ExploreCard/ExploreCard';
import { fetchCms } from '../../services/cmsApi';
import './Destinations.css';

const Destinations = () => {
  const navigate = useNavigate();
  const [cms, setCms] = useState({ destinations: [] });
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCms();
        setCms(data);
      } catch (err) {
        setError(err.message || 'Failed to load explore cards.');
      }
    };

    load();
  }, []);

  const cards = useMemo(() => {
    const destinations = cms.destinations || [];
    if (!destinations.length) {
      return [];
    }

    return destinations.map((destination) => ({
      title: destination.name,
      image: destination.cardImage,
      explorePath: `/destinations/${destination.slug}`,
      hotels: (destination.points || []).map((point) => ({
        name: point.name,
        image: point.cardImage,
        link: `/destinations/${destination.slug}/${point.slug}`,
      })),
    }));
  }, [cms]);

  return (
    <>
      <Hero />
      <section className="destinations-explore-section">
        <div className='explore-title'>EXPLORE DESTINATIONS</div>

        {error && <p>{error}</p>}

        <div className="destinations-explore-grid">
          {cards.map((card) => (
            <ExploreCard
              key={card.title}
              title={card.title}
              image={card.image}
              hotels={card.hotels}
              onExplore={() => navigate(card.explorePath)}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default Destinations;
