import React from 'react';
import './DestinationDetail.css';
import TouristPointCard from '../../components/TouristPointCard/TouristPointCard';

const hunzaTouristPoints = [
  {
    name: 'Baltit Fort',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
    description: 'A 700-year-old fort in Hunza Valley.'
  },
  {
    name: 'Altit Fort',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
    description: 'A historic fort with beautiful views.'
  },
  {
    name: 'Eagle’s Nest',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
    description: 'A famous viewpoint in Hunza.'
  }
];

const HunzaDetail = () => {
  return (
    <div className="destination-detail-container">
      <div className="destination-banner" style={{backgroundImage: `url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200')`}}>
        <h1 className="destination-banner-title">Hunza</h1>
      </div>
      <div className="tourist-points-section">
        <h2 className="tourist-points-title">Tourist Points - Hunza</h2>
        <div className="tourist-points-grid">
          {hunzaTouristPoints.map((point, idx) => (
            <TouristPointCard key={idx} {...point} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HunzaDetail;
