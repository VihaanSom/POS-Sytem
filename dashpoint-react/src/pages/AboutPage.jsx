import React from 'react';
import { ArrowRight, ShieldCheck, Zap, HeartHandshake, MapPin, Users, Award } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function AboutPage({ onNavigate }) {
  return (
    <div className="landing-page">
      <Navbar onNavigate={onNavigate} currentPage="about" />

      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            <span>About DashPoint POS</span>
          </div>
          <h1>Built by Restaurant Lovers, Engineered for Speed</h1>
          <p>
            DashPoint is an intelligent, high-speed point-of-sale platform built to empower
            hospitality teams with zero-latency table billing, kitchen management, and real-time insights.
          </p>
        </div>
      </section>

      {/* Story & Ahmedabad Innovation Hub */}
      <section className="about-section-container">
        <div className="about-grid-two">
          <div className="about-story-card">
            <span className="badge badge-primary">Our Story</span>
            <h2>From Frustration to Frictionless Service</h2>
            <p>
              Traditional POS hardware is bulky, painfully slow, and prone to breaking during Friday night rushes.
              We founded DashPoint to solve that exact problem: building a modern cloud POS that feels like a
              native tablet application—responsive, elegant, and crash-proof.
            </p>
            <p>
              Whether handling 20 busy tables, splitting complex checks, or firing courses to the kitchen,
              DashPoint stays fast, clean, and reliable.
            </p>
          </div>

          <div className="about-location-card">
            <div className="about-location-badge">
              <MapPin size={20} color="var(--primary)" />
              <span>Headquartered in Ahmedabad</span>
            </div>
            <h3>Regional Hub &amp; Technology Center</h3>
            <p>
              Our primary development and operations center operates out of Ahmedabad, Gujarat—one of India's
              most vibrant tech and culinary hubs. From here, our engineering team continuously innovates, tests,
              and deploys updates to restaurants worldwide.
            </p>
            <div className="about-stats-grid">
              <div className="about-stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Restaurants Powered</span>
              </div>
              <div className="about-stat-item">
                <span className="stat-number">&lt; 50ms</span>
                <span className="stat-label">Order Latency</span>
              </div>
              <div className="about-stat-item">
                <span className="stat-number">99.99%</span>
                <span className="stat-label">System Uptime</span>
              </div>
              <div className="about-stat-item">
                <span className="stat-number">1.2M+</span>
                <span className="stat-label">Monthly Orders</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="about-values-section">
        <div className="section-title-wrap">
          <h2>Why Restaurants Choose DashPoint</h2>
          <p>Our core engineering principles keep staff happy and tables turning faster</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrap">
              <Zap size={24} />
            </div>
            <h3>Lightning Touch Interface</h3>
            <p>
              Designed for fast-paced floor service. Add items, apply modifiers, and split bills in just a couple of taps.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrap">
              <ShieldCheck size={24} />
            </div>
            <h3>Secure Role-Based Access</h3>
            <p>
              Keep your financial data protected. POS registers and management reporting are strictly accessible via authorized credentials.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrap">
              <HeartHandshake size={24} />
            </div>
            <h3>Dedicated Local Support</h3>
            <p>
              Direct phone and online support from our Ahmedabad and regional engineering teams whenever your managers need assistance.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="about-cta-section">
        <div className="about-cta-card">
          <h2>Get In Touch With Our Team</h2>
          <p>Have questions about DashPoint POS or want a demo for your restaurant?</p>
          <div className="about-cta-buttons">
            <button onClick={() => onNavigate('contact')} className="btn btn-primary btn-lg">
              Contact Our Ahmedabad Team <ArrowRight size={18} />
            </button>
            <button onClick={() => onNavigate('landing')} className="btn btn-outline btn-lg" style={{ background: '#fff', color: '#1e293b' }}>
              View Features
            </button>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
