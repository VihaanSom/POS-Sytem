import React from 'react';
import { MapPin, Mail, Phone, ExternalLink } from 'lucide-react';

export default function Footer({ onNavigate }) {
  // Ahmedabad OpenStreetMap embed URL with marker at Lat 23.0225, Lon 72.5714
  const osmEmbedUrl =
    'https://www.openstreetmap.org/export/embed.html?bbox=72.4800%2C22.9600%2C72.6600%2C23.0800&layer=mapnik&marker=23.0225%2C72.5714';
  const osmLargeMapUrl =
    'https://www.openstreetmap.org/?mlat=23.0225&mlon=72.5714#map=13/23.0225/72.5714';

  return (
    <footer className="landing-footer">
      <div className="footer-container">
        {/* Column 1: Brand Info */}
        <div className="footer-col footer-brand">
          <div className="nav-logo" style={{ marginBottom: '0.75rem' }}>
            <img
              src="/assets/logo.png"
              alt="DashPoint"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/38x38/2563eb/ffffff?text=DP';
              }}
            />
            <span>DashPoint</span>
          </div>
          <p className="footer-desc">
            Lightning-fast, intuitive cloud point of sale engineered for modern
            restaurants, cafes, and bars. Serving tables, kitchens, and guests seamlessly.
          </p>
          <div className="footer-contact-item">
            <MapPin size={16} className="footer-icon" />
            <span>Ahmedabad, Gujarat, India</span>
          </div>
          <div className="footer-contact-item">
            <Mail size={16} className="footer-icon" />
            <span>contact@dashpointpos.com</span>
          </div>
          <div className="footer-contact-item">
            <Phone size={16} className="footer-icon" />
            <span>+91 79 4000 DASH</span>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-col">
          <h4 className="footer-title">Navigation</h4>
          <ul className="footer-links">
            <li>
              <button
                type="button"
                onClick={() => (onNavigate ? onNavigate('landing') : null)}
                className="footer-link-btn"
              >
                Features &amp; Highlights
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => (onNavigate ? onNavigate('about') : null)}
                className="footer-link-btn"
              >
                About Us
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => (onNavigate ? onNavigate('contact') : null)}
                className="footer-link-btn"
              >
                Contact &amp; Support
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => (onNavigate ? onNavigate('login') : null)}
                className="footer-link-btn"
              >
                Staff Login
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: OpenStreetMap of Ahmedabad */}
        <div className="footer-col footer-map-col">
          <h4 className="footer-title">
            <MapPin size={16} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '6px' }} />
            Location: Ahmedabad, India
          </h4>
          <p className="footer-map-sub">
            Visit our regional operations and technology centre in Ahmedabad:
          </p>

          <div className="osm-map-wrapper">
            <iframe
              title="OpenStreetMap Ahmedabad Location"
              className="osm-iframe"
              src={osmEmbedUrl}
              loading="lazy"
            />
            <div className="osm-caption">
              <a
                href={osmLargeMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="osm-external-link"
              >
                <span>View Ahmedabad on OpenStreetMap</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} DashPoint Cloud POS Suite &bull; Ahmedabad, India. Built with React.</p>
      </div>
    </footer>
  );
}
