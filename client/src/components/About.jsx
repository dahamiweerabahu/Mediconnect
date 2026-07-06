import React from 'react';
// පින්තූරය import කරන්න. 'office.jpg' කියන්නේ ඔබ assets එකට දැමූ පින්තූරයේ නමයි.
import aboutImage from '../assets/office.jpg'; 

const About = () => {
  return (
    <section className="about-section">
      <div className="about-wrapper">
        <div className="about-content">
          <h2>About Us</h2>
          <p>
            MediConnect Sri Lanka is a state-of-the-art healthcare channeling and clinic management platform. We aim to bridge the gap between patients and specialized clinical consultants, providing instant booking and digital health coordination.
          </p>
          <h3>Mission</h3>
          <p>
            At MediConnect Sri Lanka, our mission is to build a reliable, accessible, and digitized healthcare ecosystem that empowers patients to manage appointments and clinical records seamlessly.
          </p>
          <h3>Purpose</h3>
          <p>
            We are dedicated to improving the clinical workflow in Sri Lanka. By introducing real-time queue tracking, digital prescriptions, and online health reports, we make medical consultation stress-free for both doctors and patients.
          </p>
        </div>
        <div className="about-image">
          {/* මෙන්න පින්තූරය දාන තැන */}
          <img src={aboutImage} alt="MediConnect Office" />
        </div>
      </div>
    </section>
  );
};

export default About;