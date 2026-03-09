import React, { useState, useEffect } from 'react';
import './BookingWidget.css';

const BookingWidget = ({ onSearch }) => {
  const locations = ['Islamabad', 'Murree', 'Naran Valley', 'Bata Kundi', 'Lahore'];
  const formatDate = (d) => d.toISOString().slice(0, 10);
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

  const [location, setLocation] = useState(locations[0]);
  const [checkIn, setCheckIn] = useState(formatDate(today));
  const [checkOut, setCheckOut] = useState(formatDate(tomorrow));
  const [rooms, setRooms] = useState(1);

  // Controls to reveal individual inputs when label clicked
  const [showLocation, setShowLocation] = useState(false);
  const [showDates, setShowDates] = useState(false);
  const [showRooms, setShowRooms] = useState(false);

  useEffect(() => {
    if (new Date(checkOut) <= new Date(checkIn)) {
      const next = new Date(new Date(checkIn).getTime() + 24 * 60 * 60 * 1000);
      setCheckOut(formatDate(next));
    }
  }, [checkIn]);

  const incrementRooms = () => setRooms((r) => Math.min(10, r + 1));
  const decrementRooms = () => setRooms((r) => Math.max(1, r - 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { location, checkIn, checkOut, rooms };
    if (onSearch) onSearch(payload);
    alert(`Searching: ${location} ${checkIn} → ${checkOut} • ${rooms} room(s)`);
  };

  return (
    <div className="booking-widget card">
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <div className="booking-field card-field" onClick={() => setShowLocation(true)}>
          <label>Location</label>
          {!showLocation ? (
            <div className="card-value">{location}</div>
          ) : (
            <select value={location} onChange={(e) => setLocation(e.target.value)} onBlur={() => setShowLocation(false)}>
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          )}
        </div>

        <div className="booking-field card-field" onClick={() => setShowDates(true)}>
          <label>Check In / Out</label>
          {!showDates ? (
            <div className="card-value">{checkIn} — {checkOut}</div>
          ) : (
            <div className="date-row">
              <input type="date" value={checkIn} min={formatDate(today)} onChange={(e) => setCheckIn(e.target.value)} />
              <span className="date-sep">—</span>
              <input type="date" value={checkOut} min={formatDate(new Date(new Date(checkIn).getTime() + 24 * 60 * 60 * 1000))} onChange={(e) => setCheckOut(e.target.value)} />
            </div>
          )}
        </div>

        <div className="booking-field card-field" onClick={() => setShowRooms(true)}>
          <label>No. Of Rooms</label>
          {!showRooms ? (
            <div className="card-value">{rooms} Room{rooms > 1 ? 's' : ''}</div>
          ) : (
            <div className="rooms-counter">
              <button type="button" className="rooms-btn" onClick={decrementRooms}>−</button>
              <div className="rooms-value">{rooms}</div>
              <button type="button" className="rooms-btn" onClick={incrementRooms}>+</button>
            </div>
          )}
        </div>

        <div style={{ marginTop: '0.5rem' }}>
          <button type="submit" className="btn-check-availability">
            <span>CHECK AVAILABILITY</span>
            <span className="search-icon">🔍</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingWidget;
