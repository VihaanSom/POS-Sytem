import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { usePos } from '../context/PosContext';

export default function ContactPage({ onNavigate }) {
  const { showToast } = usePos();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    showToast('Message sent! Our support team will get back to you shortly.', 'success');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="landing-page">
      <Navbar onNavigate={onNavigate} currentPage="contact" />

      <div style={{ maxWidth: '1000px', margin: '3rem auto 5rem', padding: '0 2rem', flex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Get In Touch With Us</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Have questions about DashPoint POS hardware or enterprise plans?
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2.5rem' }}>
          {/* Contact Details */}
          <div className="card" style={{ height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Restaurant Support HQ
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <MapPin size={20} color="var(--primary)" />
                <div>
                  <strong>Location</strong>
                  <p style={{ color: 'var(--text-muted)' }}>742 Evergreen Terrace, Suite 400</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <Phone size={20} color="var(--primary)" />
                <div>
                  <strong>Phone Support</strong>
                  <p style={{ color: 'var(--text-muted)' }}>+1 (800) 555-DASH</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <Mail size={20} color="var(--primary)" />
                <div>
                  <strong>Email</strong>
                  <p style={{ color: 'var(--text-muted)' }}>support@dashpointpos.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Send Us a Message
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Your Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Easton Cox"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Email Address *</label>
                  <input
                    type="email"
                    placeholder="easton@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  placeholder="POS Hardware &amp; Printer Inquiry"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Message *</label>
                <textarea
                  rows="4"
                  placeholder="Tell us about your restaurant setup..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <Send size={16} /> Send Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
