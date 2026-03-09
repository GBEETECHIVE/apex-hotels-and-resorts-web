import React from 'react';
import './ContactSection.css';



const ContactSection = () => {
  return (
    <section className="contact-section">
      <div className="contact-section-bg-bar" />
      <div className="contact-columns contact-section-inner">
        <div className="contact-info-col">
          <h2 className="contact-info-title">CONTACT US</h2>
          <div className="contact-info-details">
            <div className="contact-info-phone">Phone: <a href="tel:+923111444100">+92-3-111-444-100</a></div>
            <div className="contact-info-email">Email: <a href="mailto:reservations@roomy.pk">reservations@roomy.pk</a></div>
          </div>
          <div className="contact-blue-bar" />
        </div>
        <div className="contact-form-card contact-form-card-large">
          <form className="contact-form">
            <h3 className="contact-form-heading">WE'RE HERE TO HELP YOU</h3>
            <div className="form-row form-row-2col">
              <div className="form-group">
                <label>Name <span className="required">*</span></label>
                <input type="text" placeholder="Name" className="contact-input" />
              </div>
              <div className="form-group">
                <label>Email <span className="required">*</span></label>
                <input type="email" placeholder="Email" className="contact-input" />
              </div>
            </div>
            <div className="form-row form-row-2col">
              <div className="form-group">
                <label>Phone <span className="required">*</span></label>
                <input type="tel" placeholder="+92 3xx-xxxxxxx" className="contact-input" />
              </div>
              <div className="form-group">
                <label>Subject <span className="required">*</span></label>
                <input type="text" placeholder="Subject" className="contact-input" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Message <span className="required">*</span></label>
                <textarea placeholder="Message" rows="3" className="contact-input"></textarea>
              </div>
            </div>
            <div className="form-row">
              <button type="submit" className="btn-submit btn-blue">Send Message</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
