import React from 'react';
import './StickyBooking.css';

const StickyBooking = () => {
  return (
    <div className="sticky-booking-bar">
      <div className="sticky-booking-content">
        <div className="sticky-booking-field">
          <label>Location</label>
          <span>Where Are You Going?</span>
        </div>
        <div className="sticky-booking-field">
          <label>Check In / Out</label>
          <span>Add Dates</span>
        </div>
        <div className="sticky-booking-field">
          <label>No. Of Rooms</label>
          <span>Add Rooms</span>
        </div>
        <button className="sticky-book-btn">BOOK NOW</button>
      </div>
    </div>
  );
};

export default StickyBooking;
