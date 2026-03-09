import React from 'react';
import './DestinationDetail.css';
import TouristPointCard from '../../components/TouristPointCard/TouristPointCard';

const naranTouristPoints = [
  {
    name: 'Saif-ul-Malook Lake',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600',
    description: 'A famous alpine lake surrounded by mountains.'
  },
  {
    name: 'Babusar Top',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600',
    description: 'A high mountain pass with breathtaking views.'
  },
  {
    name: 'Lalazar',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
    description: 'A lush green meadow in Naran Valley.'
  }
];

const NaranDetail = () => {
  return (
    <div className="destination-detail-container">
      <div className="destination-banner" style={{backgroundImage: `url('https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200')`}}>
        <h1 className="destination-banner-title">Naran</h1>
      </div>
      <div className="tourist-points-section">
        <h2 className="tourist-points-title">Tourist Points - Naran</h2>
        <div className="tourist-points-grid">
          {naranTouristPoints.map((point, idx) => (
            <TouristPointCard key={idx} {...point} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NaranDetail;
