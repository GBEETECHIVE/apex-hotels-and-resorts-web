import React from 'react';
import BookingWidget from '../BookingWidget/BookingWidget';
import './Hero.css';

const Hero = ({ slides = [], activeSlide, setActiveSlide, title, phone, whatsapp }) => {
  const currentIndex = Math.max(0, Math.min(slides.length - 1, (activeSlide || 1) - 1));
  const currentImage = slides.length ? slides[currentIndex] : null;
  const heroTitle = title || 'CHECK IN TO THE\nTIME OF YOUR LIFE';
  const heroPhone = phone || '+923001234567';
  const heroWhatsapp = whatsapp || '923001234567';

  return (
    <section
      className="hero"
      style={currentImage ? { backgroundImage: `url(${currentImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
    >
      <div className="hero-container">
        <div className="hero-left">
          <h1>{heroTitle.split('\n').map((line, i) => <React.Fragment key={i}>{i > 0 && <br />}{line}</React.Fragment>)}</h1>
        </div>
        {/* Booking Widget - Right Side */}
        <BookingWidget />
      </div>

      {/* Carousel Navigation restored with numbers */}
      {slides.length > 1 && (
        <div className="carousel-nav">
          <div className="carousel-dots">
            {slides.map((_, idx) => (
              <button
                key={idx}
                className={`carousel-dot${currentIndex === idx ? ' active' : ''}`}
                onClick={() => setActiveSlide(idx + 1)}
                aria-label={`Go to slide ${idx + 1}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          <div className="carousel-progress">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`progress-segment${currentIndex === idx ? ' active' : ''}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Scroll Down Arrow */}
      <button className="scroll-down" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}></button>

      {/* Floating Action Buttons */}
      <div className="floating-actions">
        <a href={`tel:${heroPhone}`} className="floating-btn phone-btn">📞</a>
        <a href={`https://wa.me/${heroWhatsapp.replace(/[^0-9]/g, '')}`} className="floating-btn whatsapp-btn" target="_blank" rel="noopener noreferrer">💬</a>
      </div>
    </section>
  );
};

export default Hero;
