import React from 'react';
import './DestinationDetail.css';
import TouristPointCard from '../../components/TouristPointCard/TouristPointCard';

const skarduTouristPoints = [
  {
    name: 'Shigar Fort',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600',
    description: 'A historic fort and hotel in Skardu.'
  },
  {
    name: 'Upper Kachura Lake',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600',
    description: 'A beautiful lake surrounded by mountains.'
  },
  {
    name: 'Deosai National Park',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600',
    description: 'The world’s second highest plateau.'
  }
];

const SkarduDetail = () => {
  return (
    <div className="destination-detail-container">
      <div className="destination-banner" style={{backgroundImage: `url('https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200')`}}>
        <h1 className="destination-banner-title">Skardu</h1>
      </div>
      <div className="tourist-points-section">
        <h2 className="tourist-points-title">Tourist Points - Skardu</h2>
        <div className="tourist-points-grid">
          {skarduTouristPoints.map((point, idx) => (
            <TouristPointCard key={idx} {...point} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkarduDetail;
