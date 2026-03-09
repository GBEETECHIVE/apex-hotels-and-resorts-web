import React from 'react';
import './DestinationDetail.css';
import TouristPointCard from '../../components/TouristPointCard/TouristPointCard';

const phanderTouristPoints = [
  {
    name: 'Phander Lake',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600',
    description: 'A stunning turquoise lake in Phander Valley.'
  },
  {
    name: 'Phander Valley',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600',
    description: 'A lush valley with scenic beauty.'
  },
  {
    name: 'River Gilgit',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600',
    description: 'A river flowing through the valley.'
  }
];

const PhanderDetail = () => {
  return (
    <div className="destination-detail-container">
      <div className="destination-banner" style={{backgroundImage: `url('https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200')`}}>
        <h1 className="destination-banner-title">Phander</h1>
      </div>
      <div className="tourist-points-section">
        <h2 className="tourist-points-title">Tourist Points - Phander</h2>
        <div className="tourist-points-grid">
          {phanderTouristPoints.map((point, idx) => (
            <TouristPointCard key={idx} {...point} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhanderDetail;
