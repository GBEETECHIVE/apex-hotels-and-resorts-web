import React from 'react';
import './DestinationDetail.css';
import TouristPointCard from '../../components/TouristPointCard/TouristPointCard';
import { islamabadTouristPoints, lahoreTouristPoints, karachiTouristPoints } from '../../components/TouristPointCard/touristPointsData';
import { useNavigate } from 'react-router-dom';

// Example data for tourist points (replace with real data as needed)
const murreeTouristPoints = [
  {
    name: 'Mall Road',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
    description: 'The main shopping street in Murree, lined with shops, cafes, and local vendors.'
  },
  {
    name: 'Patriata (New Murree)',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=600',
    description: 'A popular hill station with chair lifts, cable cars, and panoramic views.'
  },
  {
    name: 'Pindi Point',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=600',
    description: 'A scenic viewpoint offering breathtaking views of the surrounding hills and valleys.'
  }
];

const DestinationDetail = () => {
  const navigate = useNavigate();
  const handleCardClick = (city, name) => {
    // Custom slug mapping for known tourist points
    const slugMap = {
      'Mall Road': 'mall-road',
      'Patriata (New Murree)': 'patriata-new-murree',
      'Pindi Point': 'pindi-point',
      'Badshahi Mosque': 'badshahi-mosque',
      'Lahore Fort': 'lahore-fort',
      'Shalimar Gardens': 'shalimar-gardens',
      'Quaid-e-Azam Mausoleum': 'quaid-e-azam-mausoleum',
      'Clifton Beach': 'clifton-beach',
      'Mohatta Palace': 'mohatta-palace',
      'Faisal Mosque': 'faisal-mosque',
      'Daman-e-Koh': 'daman-e-koh',
      'Pakistan Monument': 'pakistan-monument',
      // Add more as needed
    };
    const slug = slugMap[name] || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    navigate(`/destinations/${city}/${slug}`);
  };
  return (
    <div className="destination-detail-container">
      <div className="destination-banner" style={{backgroundImage: `url('https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200')`}}>
        <h1 className="destination-banner-title">Murree</h1>
      </div>
      <div className="tourist-points-section">
        <h2 className="tourist-points-title">Tourist Points - Murree</h2>
        <div className="tourist-points-grid">
          {murreeTouristPoints.map((point, idx) => (
            <TouristPointCard key={idx} {...point} onClick={() => handleCardClick('murree', point.name)} />
          ))}
        </div>
      </div>
      <div className="tourist-points-section">
        <h2 className="tourist-points-title">Tourist Points - Islamabad</h2>
        <div className="tourist-points-grid">
          {islamabadTouristPoints.map((point, idx) => (
            <TouristPointCard key={idx} {...point} onClick={() => handleCardClick('islamabad', point.name)} />
          ))}
        </div>
      </div>
      <div className="tourist-points-section">
        <h2 className="tourist-points-title">Tourist Points - Lahore</h2>
        <div className="tourist-points-grid">
          {lahoreTouristPoints.map((point, idx) => (
            <TouristPointCard key={idx} {...point} onClick={() => handleCardClick('lahore', point.name)} />
          ))}
        </div>
      </div>
      <div className="tourist-points-section">
        <h2 className="tourist-points-title">Tourist Points - Karachi</h2>
        <div className="tourist-points-grid">
          {karachiTouristPoints.map((point, idx) => (
            <TouristPointCard key={idx} {...point} onClick={() => handleCardClick('karachi', point.name)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;
