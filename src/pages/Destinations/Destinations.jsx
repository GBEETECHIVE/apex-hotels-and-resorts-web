import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../../components/Hero/Hero';
import ExploreCard from '../../components/ExploreCard/ExploreCard';
import './Destinations.css';

const Destinations = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'ISLAMABAD',
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200',
      explorePath: '/destinations/islamabad',
      hotels: [
        { name: 'FAISAL MOSQUE', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400', link: '/destinations/islamabad/faisal-mosque' },
        { name: 'DAMAN E KOH', image: 'https://images.unsplash.com/photo-1542042161-df930d084576?w=400', link: '/destinations/islamabad/daman-e-koh' },
        { name: 'PAKISTAN MONUMENT', image: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=400', link: '/destinations/islamabad/pakistan-monument' },
      ],
    },
    {
      title: 'MURREE',
      image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200',
      explorePath: '/destinations/murree',
      hotels: [
        { name: 'PATRIATA', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400', link: '/destinations/murree/patriata-new-murree' },
        { name: 'PINDI POINT', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400', link: '/destinations/murree/pindi-point' },
        { name: 'MALL ROAD', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400', link: '/destinations/murree/mall-road' },
      ],
    },
    {
      title: 'SKARDU',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200',
      explorePath: '/destinations/skardu',
      hotels: [
        { name: 'SHIGAR FORT', image: 'https://images.unsplash.com/photo-1597499216184-3cca17b66e88?w=400', link: '/destinations/skardu' },
        { name: 'UPPER KACHURA', image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400', link: '/destinations/skardu' },
        { name: 'DEOSAI', image: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=400', link: '/destinations/skardu' },
      ],
    },
    {
      title: 'NARAN',
      image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200',
      explorePath: '/destinations/naran',
      hotels: [
        { name: 'SAIF UL MALOOK', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400', link: '/destinations/naran' },
        { name: 'LULUSAR LAKE', image: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?w=400', link: '/destinations/naran' },
        { name: 'BATAKUNDI', image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=400', link: '/destinations/naran' },
      ],
    },
    {
      title: 'HUNZA',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
      explorePath: '/destinations/hunza',
      hotels: [
        { name: 'ATTABAD LAKE', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400', link: '/destinations/hunza' },
        { name: 'PASSU CONES', image: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400', link: '/destinations/hunza' },
        { name: 'ALTIT FORT', image: 'https://images.unsplash.com/photo-1482192505345-5655af888cc4?w=400', link: '/destinations/hunza' },
      ],
    },
    {
      title: 'PHANDER',
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200',
      explorePath: '/destinations/phander',
      hotels: [
        { name: 'PHANDER LAKE', image: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=400', link: '/destinations/phander' },
        { name: 'GHIZER VALLEY', image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=400', link: '/destinations/phander' },
        { name: 'SHANDOOR', image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=400', link: '/destinations/phander' },
      ],
    },
  ];

  return (
    <>
      <Hero />
      <section className="destinations-explore-section">
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
