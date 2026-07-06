import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import heroImage from './1.jpeg'; 
import HowItWorks from './components/HowItWorks';
import DoctorsList from './components/DoctorsList';
import Stats from './components/Stats'; 
import About from './components/About';
import Footer from './components/Footer';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery) {
      navigate('/booking');
    } else {
      navigate('/booking', { state: { searchQuery } });
    }
  };

  return (
    <div className="home-container">
      {/* Sticky Premium Navbar */}
      <nav className="navbar">
        <div className="logo-section" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="logo-brand-icon">🩺</span>
          <span className="logo-name">MediConnect</span>
        </div>
        
        <ul className="nav-links">
          <li onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</li>
          <li onClick={() => navigate('/services')}>Services</li>
          <li onClick={() => scrollToSection('doctors')}>Doctors</li>
          <li onClick={() => scrollToSection('about')}>About Us</li>
          <li onClick={() => scrollToSection('contact')}>Contact</li>
        </ul>

        <div className="nav-actions">
          <button 
            type="button" 
            className="navbar-login-link" 
            onClick={() => navigate('/login')}
          >
            Login / Register
          </button>
          <button 
            type="button" 
            className="nav-cta-btn" 
            onClick={() => navigate('/booking')}
          >
            Channel Now 🩺
          </button>
        </div>
      </nav>

      {/* Hero Section with Integrated Live Search */}
      <section className="hero-section">
        <div className="hero-content animate-fade-in">
          <div className="badge">✨ 24/7 Channeling Platform</div>
          <h1>Your Health, Our Priority: Expert Healthcare at Your Fingertips</h1>
          <p>Connect instantly with top-rated medical specialists and manage your appointments seamlessly from home.</p>
          
          {/* Integrated Hero Quick Search Bar */}
          <form onSubmit={handleHeroSearchSubmit} className="hero-search-bar-form">
            <input 
              type="text" 
              placeholder="Search by Specialty (e.g. Cardiologist) or Doctor name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="hero-search-input"
            />
            <button type="submit" className="hero-search-btn">
              Search Doctors 🔍
            </button>
          </form>

          <div className="hero-buttons">
            <button 
              type="button" 
              className="hero-btn-primary" 
              onClick={() => navigate('/booking')}
            >
              Book Your Appointment Now
            </button>
            <button 
              type="button" 
              className="hero-btn-secondary" 
              onClick={() => scrollToSection('doctors')}
            >
              Meet Our Doctors
            </button>
          </div>
        </div>
        <div className="hero-image-wrapper">
          <img src={heroImage} alt="Doctor smiling" className="hero-main-img" />
          <div className="hero-floating-card">
            <span className="card-icon">⚡</span>
            <div>
              <h4>Instant Booking</h4>
              <p>Confirmed in 2 mins</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <Stats />

      {/* Services Section */}
      <div id="services">
        <HowItWorks />
      </div>

      {/* Doctors Grid Section */}
      <div id="doctors" className="doctors-section-wrapper">
        <div className="section-header">
          <h2>Our Specialist Doctors</h2>
          <p>Book a private physical session or virtual consultation with our highly verified clinical experts.</p>
        </div>
        <DoctorsList />
      </div>
      
      {/* About Section */}
      <div id="about">
        <About />
      </div>

      {/* Footer Section */}
      <div id="contact">
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;