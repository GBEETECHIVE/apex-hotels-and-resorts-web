import React from "react";
import "./ContactUs.css";

const ContactUs = () => (
  <section id="contact-us">
    <div className="contactus-main-container">
      <div className="contactus-main-row">
        <div className="contactus-second-row">
          <div className="image-text">
            <h1>CONTACT US</h1>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <h2>Phone:</h2>
              <a href="tel:+923111444100" style={{ textDecoration: 'none' }}>
                <p style={{ marginBottom: 0 }}>+92-3-111-444-100</p>
              </a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <h2>Email:</h2>
              <a href="mailto:reservations@roomy.pk" style={{ textDecoration: 'none' }}>
                <p style={{ marginBottom: 0 }}>reservations@roomy.pk</p>
              </a>
            </div>
          </div>
          <div className="contactus-content-div">
            <h1 className="contact-us-heading">WE'RE HERE TO HELP YOU</h1>
            <form className="contactus">
              <div className="form-group">
                <label className="required-label form-label" htmlFor="formName">Name</label>
                <input placeholder="" type="text" id="formName" className="form-control" />
              </div>
              <div className="form-one-line">
                <div className="form-email-row-2">
                  <div className="form-group">
                    <label className="required-label form-label" htmlFor="formEmail"> Email </label>
                    <input placeholder="" type="email" id="formEmail" className="form-control" />
                  </div>
                </div>
                <div className="form-phone-row-2">
                  <div className="form-group">
                    <label className="required-label form-label" htmlFor="formPhone"> Phone</label>
                    <input placeholder="+92 3xx-xxxxxxx" type="tel" id="formPhone" className="form-control" />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="required-label form-label" htmlFor="formSubject"> Subject</label>
                <input placeholder="" type="text" id="formSubject" className="form-control" />
              </div>
              <div className="form-group" style={{ height: 'auto' }}>
                <label className="required-label form-label" htmlFor="formMessage"> Message</label>
                <textarea rows={1} placeholder="" id="formMessage" className="form-control"></textarea>
              </div>
              <div className="form-last-row">
                <div className="form-message-row"></div>
                <button type="submit" className="btn btn-primary">Send Message</button>
              </div>
            </form>
          </div>
          <div className="contactus-blue-bar-row"></div>
        </div>
      </div>
    </div>
  </section>
);

export default ContactUs;
