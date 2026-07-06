import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ServicesPage.css';

const ServicesPage = () => {
  const navigate = useNavigate();

  // Mock Doctors for Queue Simulator
  const doctors = [
    { name: "Dr. Anusha Perera", specialty: "Cardiologist", currentToken: 14, nextToken: 15, waitTime: "25 mins" },
    { name: "Dr. Saman Wijesinghe", specialty: "Pediatrician", currentToken: 8, nextToken: 9, waitTime: "10 mins" },
    { name: "Dr. Savan Wijesinghe", specialty: "Pediatrician", currentToken: 22, nextToken: 23, waitTime: "45 mins" },
    { name: "Dr. Ruwan Jayawardena", specialty: "Neurologist", currentToken: 5, nextToken: 6, waitTime: "15 mins" },
    { name: "Dr. Nirmali Silva", specialty: "Dermatologist", currentToken: 11, nextToken: 12, waitTime: "30 mins" },
    { name: "Dr. Priyantha Gunawardena", specialty: "Orthopedic Surgeon", currentToken: 19, nextToken: 20, waitTime: "40 mins" },
    { name: "Dr. Dilhani Bandara", specialty: "Gynecologist", currentToken: 3, nextToken: 4, waitTime: "5 mins" }
  ];

  // Simulator States
  const [selectedQueueDoc, setSelectedQueueDoc] = useState(doctors[0]);
  const [rxQuery, setRxQuery] = useState('');
  const [rxResult, setRxResult] = useState(null);
  const [labQuery, setLabQuery] = useState('');
  const [labResult, setLabResult] = useState(null);

  // Quick Prescription Simulator
  const handleRxSearch = (e) => {
    e.preventDefault();
    if (!rxQuery) return;
    
    // Fallback search result
    setRxResult({
      rxId: rxQuery.toUpperCase(),
      doctor: "Dr. Anusha Perera",
      specialty: "Cardiologist",
      date: "2026-07-03",
      medicines: [
        { name: "Atorvastatin 20mg", dosage: "1 tab daily (Night)", duration: "30 Days" },
        { name: "Aspirin 75mg", dosage: "1 tab daily (Morning - after food)", duration: "60 Days" },
        { name: "Metoprolol 25mg", dosage: "1/2 tab twice daily", duration: "30 Days" }
      ],
      instructions: "Avoid oily foods. Monitor blood pressure weekly."
    });
  };

  // Quick Lab Report Simulator
  const handleLabSearch = (e) => {
    e.preventDefault();
    if (!labQuery) return;

    setLabResult({
      labId: labQuery.toUpperCase(),
      patient: "Dahami Perera",
      age: "24",
      gender: "Female",
      testName: "Full Blood Count (FBC)",
      date: "2026-07-01",
      results: [
        { parameter: "White Blood Cells (WBC)", value: "7.4 x10^9 / L", range: "4.0 - 11.0", status: "Normal" },
        { parameter: "Red Blood Cells (RBC)", value: "4.6 x10^12 / L", range: "3.8 - 4.8", status: "Normal" },
        { parameter: "Hemoglobin (Hb)", value: "11.2 g/dL", range: "11.5 - 15.0", status: "Low" },
        { parameter: "Platelet Count", value: "280 x10^9 / L", range: "150 - 450", status: "Normal" }
      ],
      comment: "Mild microcytic anemia indicated. Recommend iron supplement diet."
    });
  };

  return (
    <div className="services-page-container">
      {/* Header section */}
      <header className="services-header">
        <div className="services-brand-logo" onClick={() => navigate('/')}>
          <span>🩺</span> MediConnect Services
        </div>
        <button type="button" className="btn-back-home" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
      </header>

      {/* Hero Header */}
      <section className="services-hero">
        <div className="badge">✨ Integrated Healthcare System</div>
        <h1>Complete Doctor Channeling & Clinic Management Suite</h1>
        <p>
          We provide a comprehensive digital infrastructure for patients, doctors, and clinics. Explore our services below and try our live clinic simulators.
        </p>
      </section>

      {/* Core Services Grid */}
      <section className="core-services-section">
        <div className="services-grid-container">
          <div className="service-card-premium">
            <span className="srv-card-icon">📅</span>
            <h3>E-Channeling & Booking</h3>
            <p>Search over 50+ medical specialist consultants, examine clinic schedules, and reserve your consultation token in under two minutes.</p>
            <button type="button" className="srv-action-btn" onClick={() => navigate('/booking')}>Channel Now</button>
          </div>

          <div className="service-card-premium">
            <span className="srv-card-icon">⚡</span>
            <h3>Live Clinic Queue Tracker</h3>
            <p>Monitor live room statuses, current active tokens, and estimated consultation waiting times directly from your smartphone.</p>
            <a href="#queue-simulator" className="srv-action-link">Try Live Simulator →</a>
          </div>

          <div className="service-card-premium">
            <span className="srv-card-icon">📋</span>
            <h3>Digital Prescriptions</h3>
            <p>Access your prescriptions securely. Print or share prescriptions immediately with allied pharmacies for doorstep medicine delivery.</p>
            <a href="#prescription-simulator" className="srv-action-link">Lookup Rx Code →</a>
          </div>

          <div className="service-card-premium">
            <span className="srv-card-icon">🔬</span>
            <h3>Online Laboratory Reports</h3>
            <p>Retrieve, store, and share clinical lab reports. All reports are verified and uploaded directly from our partner laboratories.</p>
            <a href="#lab-simulator" className="srv-action-link">Check Lab Results →</a>
          </div>

          <div className="service-card-premium">
            <span className="srv-card-icon">💾</span>
            <h3>Electronic Health Records (EHR)</h3>
            <p>Centralized health dashboard for historical medical reports, diagnoses, and allergies, protected by industry-grade encryption.</p>
            <button type="button" className="srv-action-btn" onClick={() => navigate('/login')}>Login Dashboard</button>
          </div>

          <div className="service-card-premium">
            <span className="srv-card-icon">💬</span>
            <h3>AI Symptom Analyzer</h3>
            <p>Struggling to find the right doctor? Chat with our virtual symptom assistant to get direct specialist recommendations instantly.</p>
            <button type="button" className="srv-action-btn" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>Open AI Bot</button>
          </div>
        </div>
      </section>

      {/* Simulator Section */}
      <section className="simulators-divider">
        <h2>Interactive Service Simulators</h2>
        <p className="subtitle">Experience how our clinic management system facilitates real-time data flow.</p>

        <div className="simulators-grid">
          
          {/* Simulator A: Live Queue Tracker */}
          <div id="queue-simulator" className="simulator-card glass-card">
            <h3>⚡ Live Queue Monitor</h3>
            <p>Select an active consultation room below to check real-time queue metrics.</p>
            
            <div className="form-group-srv">
              <label>Choose Doctor Room:</label>
              <select 
                className="srv-input-field" 
                value={selectedQueueDoc.name}
                onChange={(e) => {
                  const doc = doctors.find(d => d.name === e.target.value);
                  if (doc) setSelectedQueueDoc(doc);
                }}
              >
                {doctors.map((d, i) => (
                  <option key={i} value={d.name}>{d.name} ({d.specialty})</option>
                ))}
              </select>
            </div>

            <div className="queue-status-dashboard">
              <div className="q-metric">
                <span className="metric-lbl">Active Token</span>
                <span className="metric-val text-primary">#{selectedQueueDoc.currentToken}</span>
              </div>
              <div className="q-metric">
                <span className="metric-lbl">Next Token</span>
                <span className="metric-val text-secondary">#{selectedQueueDoc.nextToken}</span>
              </div>
              <div className="q-metric">
                <span className="metric-lbl">Estimated Delay</span>
                <span className="metric-val text-warning">{selectedQueueDoc.waitTime}</span>
              </div>
            </div>

            <div className="live-badge-glow">
              <span className="glow-dot"></span> Live updates synchronized with clinic terminal
            </div>
          </div>

          {/* Simulator B: Rx Lookup */}
          <div id="prescription-simulator" className="simulator-card glass-card">
            <h3>📋 Digital Prescription Retrieval</h3>
            <p>Query a mock prescription ID to view prescribed medication and clinical intake guides.</p>
            
            <form onSubmit={handleRxSearch} className="simulator-search-form">
              <input 
                type="text" 
                placeholder="Enter Rx Code (e.g. RX-9921)"
                value={rxQuery}
                onChange={(e) => setRxQuery(e.target.value)}
                className="srv-input-field search"
                required
              />
              <button type="submit" className="srv-submit-btn">Retrieve</button>
            </form>

            {rxResult ? (
              <div className="simulator-result-card animate-scale-up">
                <div className="result-header">
                  <div>
                    <strong>Code: {rxResult.rxId}</strong>
                    <p>{rxResult.date}</p>
                  </div>
                  <span className="status-pill verified">Verified</span>
                </div>
                <div className="result-body">
                  <p><strong>Consultant:</strong> {rxResult.doctor} ({rxResult.specialty})</p>
                  <div className="med-list">
                    {rxResult.medicines.map((m, idx) => (
                      <div key={idx} className="med-item">
                        <span>💊 {m.name} - <em>{m.dosage}</em></span>
                        <small>Duration: {m.duration}</small>
                      </div>
                    ))}
                  </div>
                  <p className="instructions">📝 {rxResult.instructions}</p>
                </div>
                <button type="button" className="order-pharmacy-btn" onClick={() => alert("Forwarding prescription to MediConnect Delivery Partner...")}>
                  Order Pharmacy Delivery 🛵
                </button>
              </div>
            ) : (
              <div className="simulator-placeholder">
                <p>Try searching for "RX-9921" or custom codes to load prescription preview sheets.</p>
              </div>
            )}
          </div>

          {/* Simulator C: Lab Report Retrieval */}
          <div id="lab-simulator" className="simulator-card glass-card">
            <h3>🔬 Lab Report Download</h3>
            <p>Input a diagnostic patient ID to load CBC / lab metrics dashboard.</p>

            <form onSubmit={handleLabSearch} className="simulator-search-form">
              <input 
                type="text" 
                placeholder="Enter Patient ID (e.g. LAB-4049)"
                value={labQuery}
                onChange={(e) => setLabQuery(e.target.value)}
                className="srv-input-field search"
                required
              />
              <button type="submit" className="srv-submit-btn">Search</button>
            </form>

            {labResult ? (
              <div className="simulator-result-card animate-scale-up">
                <div className="result-header">
                  <div>
                    <strong>Report: {labResult.testName}</strong>
                    <p>Patient: {labResult.patient} | Age: {labResult.age}</p>
                  </div>
                  <span className="status-pill verified">Signed</span>
                </div>
                <table className="lab-result-table">
                  <thead>
                    <tr>
                      <th>Test Item</th>
                      <th>Value</th>
                      <th>Reference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labResult.results.map((r, idx) => (
                      <tr key={idx}>
                        <td>{r.parameter}</td>
                        <td className={r.status === 'Low' ? 'text-danger font-bold' : ''}>{r.value}</td>
                        <td>{r.range}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="lab-comment"><strong>Lab Comment:</strong> {labResult.comment}</p>
                <button type="button" className="btn-print-lab" onClick={() => window.print()}>
                  Print Report Document 🖨️
                </button>
              </div>
            ) : (
              <div className="simulator-placeholder">
                <p>Try entering "LAB-4049" to access simulated clinical blood results.</p>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Services Footer */}
      <footer className="services-footer-note">
        <p>&copy; 2026 MediConnect Healthcare Systems Sri Lanka. Fully encrypted HL7 health exchange compliant.</p>
      </footer>
    </div>
  );
};

export default ServicesPage;
