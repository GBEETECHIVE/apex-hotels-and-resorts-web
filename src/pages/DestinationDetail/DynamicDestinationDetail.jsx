import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Hero from '../../components/Hero/Hero';
import StickyBooking from '../../components/StickyBooking/StickyBooking';
import TouristPointTabs from '../../components/TouristPointTabs/TouristPointTabs';
import RoomList from '../../components/RoomCard/RoomList';
import ActivityGalleryCarousel from '../../components/ActivityGalleryCarousel/ActivityGalleryCarousel';
import BookingFormModal from '../../components/BookingFormModal/BookingFormModal';
import { fetchCms } from '../../services/cmsApi';
import './DestinationDetail.css';

const asLineList = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return value.split('\n');
  return [];
};

const cleanLineList = (value) => asLineList(value).map((line) => String(line || '').trim()).filter(Boolean);

const DynamicDestinationDetail = () => {
  const { destinationSlug, pointSlug } = useParams();
  const navigate = useNavigate();
  const heroRef = useRef(null);

  const [cms, setCms] = useState({ destinations: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  const [showStickyBooking, setShowStickyBooking] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingRoom, setBookingRoom] = useState(null);
  const [roomImagesModal, setRoomImagesModal] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCms();
        setCms(data);
      } catch (err) {
        setError(err.message || 'Unable to load destination content.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const heroRect = heroRef.current.getBoundingClientRect();
      const heroHeight = heroRect.height || 1;
      const scrolled = Math.max(0, -heroRect.top);
      setShowStickyBooking(scrolled > heroHeight * 0.4);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const destination = useMemo(() => {
    return (cms.destinations || []).find((item) => item.slug === destinationSlug);
  }, [cms, destinationSlug]);

  const selectedPoint = useMemo(() => {
    if (!destination) return null;
    if (pointSlug) {
      return (destination.points || []).find((point) => point.slug === pointSlug) || null;
    }
    return (destination.points || [])[0] || null;
  }, [destination, pointSlug]);

  useEffect(() => {
    if (!loading && destination && !pointSlug && selectedPoint) {
      navigate(`/destinations/${destination.slug}/${selectedPoint.slug}`, { replace: true });
    }
  }, [loading, destination, pointSlug, selectedPoint, navigate]);

  const heroSlides = selectedPoint?.heroSlides?.length
    ? cleanLineList(selectedPoint.heroSlides)
    : cleanLineList(destination?.heroSlides);

  const tabs = selectedPoint?.tabs || {};
  const infoBullets = cleanLineList(tabs.infoBullets);
  const infoGallery = cleanLineList(tabs.infoGallery);

  const roomCards = (tabs.rooms || []).map((room) => ({
    ...room,
    images: Array.isArray(room.images) ? room.images : (room.image ? [room.image] : []),
    onBook: () => {
      setBookingRoom(room);
      setShowBookingForm(true);
    },
    onGallery: (imgs) => setRoomImagesModal(imgs),
  }));

  if (loading) {
    return <div className="destination-detail-container">Loading destination content...</div>;
  }

  if (error) {
    return <div className="destination-detail-container">{error}</div>;
  }

  if (!destination || !selectedPoint) {
    return <div className="destination-detail-container">Destination not found.</div>;
  }

  return (
    <div className="destination-detail-container">
      {showStickyBooking && <StickyBooking />}
      <div ref={heroRef}>
        <Hero slides={heroSlides} activeSlide={activeSlide} setActiveSlide={setActiveSlide} />
      </div>

      <TouristPointTabs
        infoTitle={tabs.infoTitle || selectedPoint.name}
        infoDescription={
          <div className="tp-info-layout" style={{ display: 'flex', gap: '24px' }}>
            <div className="tp-info-left">
              <h1 className="tp-info-title">{tabs.infoTitle || selectedPoint.name}</h1>
              <p className="tp-info-desc">{tabs.infoDescription || 'No description available.'}</p>
              <ul className="tp-info-bullets">
                {infoBullets.map((item, idx) => (
                  <li key={idx}>✔ {item}</li>
                ))}
              </ul>
            </div>
            {infoGallery.length > 0 && (
              <div className="tp-info-gallery">
                <div className="tp-info-gallery-grid">
                  {infoGallery.slice(0, 3).map((image, idx) => (
                    <img
                      key={`${selectedPoint.id}-info-${idx}`}
                      src={image}
                      alt={`${selectedPoint.name}-${idx + 1}`}
                      className={`tp-info-gallery-img ${idx === 0 ? 'double' : 'single'}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        }
        roomsContent={
          <>
            <RoomList rooms={roomCards} />
            {showBookingForm && (
              <BookingFormModal
                room={bookingRoom}
                resort={destination.name}
                onClose={() => {
                  setShowBookingForm(false);
                  setBookingRoom(null);
                }}
              />
            )}
          </>
        }
        activitiesContent={
          <div>
            <ActivityGalleryCarousel slides={tabs.activities || []} />
          </div>
        }
        galleryTitle={tabs.galleryTitle || 'GALLERY & IMAGES'}
        galleryDescription={tabs.galleryDescription || 'Browse the best views and moments from our property and surroundings.'}
        galleryImages={tabs.galleryImages || []}
      />

      {/* Room Images Modal */}
      {roomImagesModal && (
        <div className="room-images-overlay" onClick={() => setRoomImagesModal(null)}>
          <div className="room-images-modal" onClick={(e) => e.stopPropagation()}>
            <button className="room-images-close" onClick={() => setRoomImagesModal(null)}>✕</button>
            <div className="room-images-grid">
              {roomImagesModal.map((url, idx) => (
                <img key={idx} src={url} alt={`Room ${idx + 1}`} className="room-images-item" />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicDestinationDetail;
