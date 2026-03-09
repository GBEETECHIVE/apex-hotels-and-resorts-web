import React, { useState } from 'react';
import './TouristPointTabs.css';
import ActivitiesSlider from '../ActivitiesSlider/ActivitiesSlider';
import ActivityGalleryCarousel from '../ActivityGalleryCarousel/ActivityGalleryCarousel';

const tabList = [
  { key: 'info', label: 'Information' },
  { key: 'rooms', label: 'Rooms' },
  { key: 'activities', label: 'Activities' },
  { key: 'gallery', label: 'Gallery & Images' },
];

const TouristPointTabs = ({
  infoTitle,
  infoDescription,
  infoBullets = [],
  roomsContent,
  activitiesContent,
  galleryImages = [],
}) => {
  const [activeTab, setActiveTab] = useState('info');

  return (
    <div className="tp-tabs-container">
      <div className="tp-tabs-bar">
        {tabList.map(tab => (
          <button
            key={tab.key}
            className={`tp-tab-btn${activeTab === tab.key ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tp-tabs-content">
        {activeTab === 'info' && (
          <div className="tp-info-tab">
            <h1 className="tp-info-title">{infoTitle}</h1>
            <p className="tp-info-desc">{infoDescription}</p>
            <ul className="tp-info-bullets">
              {infoBullets.map((item, idx) => (
                <li key={idx}>✔ {item}</li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === 'rooms' && (
          <div className="tp-rooms-tab">{roomsContent || <em>No room info yet.</em>}</div>
        )}
        {activeTab === 'activities' && (
          <div className="tp-activities-tab">
            <ActivitiesSlider
              slides={[
                {
                  title: 'ACTIVITIES NEARBY',
                  description: 'Go on an adventure experiencing the cable car system at Patriata experiencing the thick, lush green forests, or explore the popular Kashmir point, one of the highest viewpoints in Murree Hills. You can also go to Changla Gali which offers hiking trails and heavily forested hills for a much truer immersion into nature.',
                  images: [
                    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=600',
                    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=601',
                    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=602',
                    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=603',
                    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=604',
                  ],
                },
                {
                  title: 'CABLE CAR ADVENTURE',
                  description: 'Experience the thrill of the cable car system at Patriata, offering panoramic views and lush green forests.',
                  images: [
                    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=605',
                    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=606',
                    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=607',
                    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=608',
                    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=609',
                  ],
                },
                {
                  title: 'NATURE WALKS & HIKING',
                  description: 'Explore hiking trails and heavily forested hills for a true immersion into nature at Changla Gali.',
                  images: [
                    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=610',
                    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=611',
                    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=612',
                    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=613',
                    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=614',
                  ],
                },
              ]}
            />
          </div>
        )}
        {activeTab === 'gallery' && (
          <div className="tp-gallery-tab">
            {/* Use new carousel design for gallery tab */}
            <ActivityGalleryCarousel
              slides={[{
                title: 'GALLERY & IMAGES',
                description: 'Browse the best views and moments from our property and surroundings.',
                images: galleryImages,
              }]}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TouristPointTabs;
