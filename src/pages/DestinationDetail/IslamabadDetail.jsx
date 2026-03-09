import React from 'react';
import './DestinationDetail.css';
import TouristPointCard from '../../components/TouristPointCard/TouristPointCard';
import { islamabadTouristPoints } from '../../components/TouristPointCard/touristPointsData';

import { useNavigate } from 'react-router-dom';

const IslamabadDetail = () => {
  const navigate = useNavigate();
  const handleCardClick = (name) => {
    if (name === 'Faisal Mosque') navigate('/destinations/islamabad/faisal-mosque');
    else if (name === 'Daman-e-Koh') navigate('/destinations/islamabad/daman-e-koh');
    else if (name === 'Pakistan Monument') navigate('/destinations/islamabad/pakistan-monument');
  };
  return (
    <div className="destination-detail-container">
      <div className="destination-banner" style={{backgroundImage: `url('https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200')`}}>
        <h1 className="destination-banner-title">Islamabad</h1>
      </div>
      <div className="tourist-points-section">
        <h2 className="tourist-points-title">Tourist Points - Islamabad</h2>
        <div className="tourist-points-grid">
          {islamabadTouristPoints.map((point, idx) => (
            <TouristPointCard key={idx} {...point} onClick={() => handleCardClick(point.name)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default IslamabadDetail;
