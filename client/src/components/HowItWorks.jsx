import React from 'react';
import selectIcon from '../assets/Select.png';
import calendarIcon from '../assets/Calander.png';
import confirmIcon from '../assets/Comfirm.png';

const HowItWorks = () => {
  return (
    <section className="how-it-works">
      <h2>How It Works</h2>
      <div className="steps-container">
        
        <div className="step-card">
          <img src={selectIcon} alt="Select Doctor" className="step-image" />
          <h3>Select a Doctor</h3>
        </div>

        <div className="step-card">
          <img src={calendarIcon} alt="Book Date" className="step-image" />
          <h3>Book Date & Time</h3>
        </div>

        <div className="step-card">
          <img src={confirmIcon} alt="Get Confirmed" className="step-image" />
          <h3>Get Confirmed</h3>
        </div>

      </div>
    </section>
  );
};
export default HowItWorks;