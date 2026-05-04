import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import usePortfolioContent from '../hooks/usePortfolioContent';
import './ServiceDetail.css';

const slugify = (value) => String(value || '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

const ServiceDetail = () => {
  const { slug } = useParams();
  const content = usePortfolioContent();
  const [isContactChooserOpen, setIsContactChooserOpen] = useState(false);

  const service = useMemo(
    () => (content.homeServices || []).find((item) => slugify(item.title) === slug),
    [content.homeServices, slug]
  );

  const packages = useMemo(() => {
    if (!service?.title) return [];
    return content.homeServicePackages?.[service.title] || [];
  }, [content.homeServicePackages, service?.title]);

  if (!service) {
    return (
      <section className="service-detail-page common-section">
        <div className="service-detail-container">
          <h1>Service not found</h1>
          <p>This service has not been configured yet.</p>
          <Link to="/">Back to Home</Link>
        </div>
      </section>
    );
  }

  const Icon = service.icon;
  const contact = content.contact || {};

  return (
    <div className="service-detail-page">
      <section className="common-section service-detail-hero">
        <div className="service-detail-container">
          <div className="service-detail-head">
            {Icon && <Icon className="service-detail-icon" />}
            <h1>{service.title}</h1>
          </div>
          <p>{service.description}</p>
        </div>
      </section>

      <section className="common-section service-detail-packages">
        <div className="service-detail-container">
          <h2>Service Packages</h2>
          <div className="service-package-grid">
            {packages.map((pack) => (
              <article className="service-package-item card" key={`${service.title}-${pack.name}`}>
                <h3>{pack.name}</h3>
                <p>{pack.details}</p>
                <button type="button" className="service-cta-btn" onClick={() => setIsContactChooserOpen(true)}>
                  {pack.cta || 'Contact Me'}
                </button>
              </article>
            ))}
            {packages.length === 0 && <p>No package entries yet for this service.</p>}
          </div>
        </div>
      </section>

      {isContactChooserOpen && (
        <div
          className="contact-chooser-overlay"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) setIsContactChooserOpen(false);
          }}
        >
          <div className="contact-chooser-modal" role="dialog" aria-modal="true" aria-label="Choose contact method">
            <div className="contact-chooser-header">
              <h3>Choose Contact Method</h3>
              <button type="button" onClick={() => setIsContactChooserOpen(false)} aria-label="Close contact method chooser">x</button>
            </div>
            <p className="contact-chooser-subtitle">Select how you want to reach me for this service.</p>
            <div className="contact-chooser-grid">
              {contact?.socialLinks?.whatsapp && (
                <a href={contact.socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="contact-chooser-item">
                  <span>WhatsApp</span>
                  <small>Fast response</small>
                </a>
              )}
              {contact?.email && (
                <a href={`mailto:${contact.email}`} className="contact-chooser-item">
                  <span>Email</span>
                  <small>{contact.email}</small>
                </a>
              )}
              {contact?.phone && (
                <a href={`tel:${contact.phone}`} className="contact-chooser-item">
                  <span>Phone Call</span>
                  <small>{contact.phone}</small>
                </a>
              )}
              <Link to="/contact" className="contact-chooser-item" onClick={() => setIsContactChooserOpen(false)}>
                <span>Open Contact Form</span>
                <small>Write detailed message</small>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetail;
