import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    alert('Thank you for contacting us! We will get back to you soon. (This is a demo)');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <div className="container">
          <h1>Contact Us</h1>
          <p>We're here to help! Reach out to us for any questions or support</p>
        </div>
      </div>

      <div className="container">
        <div className="contact-layout">
          {/* Contact Form */}
          <div className="contact-form-section">
            <h2>Send us a Message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label>Your Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+92 300 1234567"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Subject *</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="What is this regarding?"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Message *</label>
                <textarea
                  name="message"
                  placeholder="Type your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  required
                />
              </div>

              <button type="submit" className="btn-submit">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <aside className="contact-info-section">
            <div className="info-card">
              <h3>Get in Touch</h3>
              <p>Have questions? We'd love to hear from you.</p>
            </div>

            <div className="info-card">
              <div className="info-icon">📧</div>
              <h4>Email</h4>
              <p>info@roomy.pk</p>
              <p>support@roomy.pk</p>
            </div>

            <div className="info-card">
              <div className="info-icon">📞</div>
              <h4>Phone</h4>
              <p>+92 300 1234567</p>
              <p>+92 321 7654321</p>
            </div>

            <div className="info-card">
              <div className="info-icon">📍</div>
              <h4>Office</h4>
              <p>Karachi, Pakistan</p>
              <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
            </div>

            <div className="info-card">
              <div className="info-icon">💬</div>
              <h4>Social Media</h4>
              <p>Follow us on social media for updates</p>
              <div className="social-links">
                <a href="#facebook">Facebook</a>
                <a href="#twitter">Twitter</a>
                <a href="#instagram">Instagram</a>
              </div>
            </div>
          </aside>
        </div>

        {/* FAQ Section */}
        <section className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>How do I post a property?</h4>
              <p>Click on "Post Property" in the navigation menu and fill out the form with your property details.</p>
            </div>

            <div className="faq-item">
              <h4>Is it free to search properties?</h4>
              <p>Yes! Searching and browsing properties is completely free. No hidden charges.</p>
            </div>

            <div className="faq-item">
              <h4>How can I contact property owners?</h4>
              <p>Click on a property listing to view contact details of the owner.</p>
            </div>

            <div className="faq-item">
              <h4>Are the properties verified?</h4>
              <p>We verify all listings to ensure quality and authenticity for your safety.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
