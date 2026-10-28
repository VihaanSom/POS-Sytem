import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Zap, LayoutGrid, Receipt, MapPin, ShieldCheck, HeartHandshake } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function LandingPage({ onNavigate }) {
  // Carousel State
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      badge: 'POS Terminal',
      title: 'Fast Touch Ordering',
      desc: 'Quickly take orders, customize items, adjust modifiers, and process table tickets with zero latency.',
      img: '/assets/pos-dashboard.png',
      ctaText: 'Sign In to Terminal'
    },
    {
      badge: 'Floor Management',
      title: 'Live Table Layout & Booking',
      desc: 'Easily view available, occupied, and reserved dining tables in real-time across your restaurant floor.',
      img: '/assets/pos-dashboard.png',
      ctaText: 'Sign In to Floor Plan'
    },
    {
      badge: 'Analytics',
      title: 'Clear Business Reports & Insights',
      desc: 'Track daily gross revenue, top-selling dishes, and staff ticket sizes at a single glance.',
      img: '/assets/pos-dashboard.png',
      ctaText: 'Sign In to Reports'
    }
  ];

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="landing-page">
      <Navbar onNavigate={onNavigate} currentPage="landing" />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            <span>DashPoint &bull; Cloud POS Suite</span>
          </div>
          <h1>Empower Your Restaurant with DashPoint</h1>
          <p>
            The lightning-fast, intuitive, and elegant point of sale system designed to
            streamline your operations from kitchen to checkout.
          </p>
          <div className="hero-actions">
            <button onClick={() => onNavigate('about')} className="btn btn-primary btn-lg">
              About DashPoint <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Showcase Interactive Carousel */}
      <section className="showcase-section">
        <div className="section-title-wrap">
          <h2>Explore DashPoint In Action</h2>
          <p>Discover how our simplified workflow boosts service speed</p>
        </div>

        <div className="react-carousel">
          <div className="carousel-slide-content">
            <div className="slide-info">
              <span className="badge badge-primary">{slides[activeSlide].badge}</span>
              <h3>{slides[activeSlide].title}</h3>
              <p>{slides[activeSlide].desc}</p>
            </div>

            <div className="slide-img-wrap">
              <img
                src={slides[activeSlide].img}
                alt={slides[activeSlide].title}
                onError={(e) => {
                  e.target.src =
                    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80';
                }}
              />
            </div>
          </div>

          <div className="carousel-controls">
            <div className="carousel-dots">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  className={`carousel-dot ${activeSlide === idx ? 'active' : ''}`}
                  onClick={() => setActiveSlide(idx)}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="icon-btn" onClick={prevSlide} title="Previous slide">
                <ChevronLeft size={20} />
              </button>
              <button className="icon-btn" onClick={nextSlide} title="Next slide">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <div className="section-title-wrap">
          <h2>Engineered For Hospitality Speed</h2>
          <p>Everything your staff needs to serve guests without delay</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrap">
              <Zap size={24} />
            </div>
            <h3>Lightning Touch Ordering</h3>
            <p>
              Instantly punch items, split tickets, and fire orders directly to the kitchen
              display without lag.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrap">
              <LayoutGrid size={24} />
            </div>
            <h3>Visual Floor Map</h3>
            <p>
              Color-coded 20-table dining floor view showing vacant, occupied, and reserved
              tables in real-time.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrap">
              <Receipt size={24} />
            </div>
            <h3>Dynamic Split Billing</h3>
            <p>
              Configurable tax percentages, promotional discounts, and payment methods with
              instant printable receipts.
            </p>
          </div>
        </div>
      </section>

      {/* About Section on Landing Page */}
      <section id="about" className="landing-about-section">
        <div className="section-title-wrap">
          <h2>About DashPoint &amp; Our Team</h2>
          <p>Headquartered in Ahmedabad, building modern tools for modern hospitality</p>
        </div>

        <div className="landing-about-container">
          <div className="about-preview-card">
            <div className="about-preview-badge">
              <MapPin size={18} color="var(--primary)" />
              <span>Ahmedabad, Gujarat &bull; Operations Hub</span>
            </div>
            <h3>Crafted with Pride in Ahmedabad</h3>
            <p>
              DashPoint was created to replace clunky legacy cash registers with a modern, cloud-first
              solution. From our tech center in Ahmedabad, India, our team develops ultra-reliable,
              touch-friendly software trusted by restaurants and cafes.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'center' }}>
              <button onClick={() => onNavigate('about')} className="btn btn-primary">
                Read Full Story &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
