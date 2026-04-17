import React, { useEffect, useState } from 'react';
import './Contact.css';
import BannerSection from '../../components/BannerSection/BannerSection';
import ContactSection from '../../components/ContactSection/ContactSection';
import { fetchCms } from '../../services/cmsApi';

const Contact = () => {
  const [hp, setHp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadContact = async () => {
      try {
        const cms = await fetchCms();
        setHp(cms?.homePage || {});
      } catch (err) {
        setError(err.message || 'Unable to load contact settings.');
      } finally {
        setLoading(false);
      }
    };

    loadContact();
  }, []);

  return (
    <div className="contact-page">
      <BannerSection
        title={hp?.contact?.bannerTitle || 'Contact Us'}
        subtitle={hp?.contact?.bannerSubtitle || 'We are here to help — reach out for any questions or support.'}
      />

      {loading ? (
        <div className="container"><p>Loading contact details...</p></div>
      ) : error ? (
        <div className="container"><p>{error}</p></div>
      ) : (
        <ContactSection data={hp?.contact} />
      )}
    </div>
  );
};

export default Contact;
