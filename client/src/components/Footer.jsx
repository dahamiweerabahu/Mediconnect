import React from 'react';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-grid">
        
        {/* Brand Information */}
        <div className="footer-brand">
          <h3>🩺 MEDICONNECT</h3>
          <p>
            The leading healthcare and channeling ecosystem in Sri Lanka, dedicated to matching patient queries with specialized doctors instantly.
          </p>
          <div className="social-links">
            <div className="social-icon">🔵</div>
            <div className="social-icon">📸</div>
            <div className="social-icon">💼</div>
            <div className="social-icon">🐦</div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home Overview</li>
            <li onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>How It Works</li>
            <li onClick={() => document.getElementById('doctors')?.scrollIntoView({ behavior: 'smooth' })}>Our Specialists</li>
            <li onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>Company Mission</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-contact">
          <h4>Get In Touch</h4>
          <p>📍 Colombo Road, Rajagiriya, Sri Lanka</p>
          <p>📞 +94 11 234 5678</p>
          <p>✉️ support@mediconnect.lk</p>
          <p>⏰ Open 24/7 for Emergencies</p>
        </div>

        {/* Newsletter Subscription */}
        <div className="footer-newsletter">
          <h4>Stay Updated</h4>
          <p>Subscribe to our wellness newsletter for direct health advice from qualified specialists.</p>
          <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert("Thank you for subscribing!"); }}>
            <input 
              type="email" 
              placeholder="Your email address" 
              className="newsletter-input" 
              required 
            />
            <button type="submit" className="newsletter-btn">Join</button>
          </form>
        </div>

      </div>

      {/* Footer Bottom copyright notes */}
      <div className="footer-bottom">
        <p>&copy; 2026 MediConnect Sri Lanka Ltd. All Rights Reserved.</p>
        <div className="footer-bottom-links">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Cookie preferences</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;