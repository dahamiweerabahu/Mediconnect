import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Assets placeholders & fallbacks
import doctorPlaceholder from './assets/doctor.jpg';
import AnushaImg from './assets/Anusha.jpg';
import SamanImg from './assets/Saman.jpg';
import SavanImg from './assets/Savan.jpg';
import RuwanImg from './assets/Ruwan.jpg';
import NirmaliImg from './assets/Nirmali.jpg';
import PriyanthaImg from './assets/Priyantha.jpg';
import DilhaniImg from './assets/Dilhani.jpg';

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Load doctors and initial states
  const [doctorsList, setDoctorsList] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Form intake state variables
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('04:30 PM - 05:00 PM');
  const [showModal, setShowModal] = useState(false);
  const [queueNo, setQueueNo] = useState(0);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Catalog search / filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');

  // Fetch doctors on mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get('http://localhost:3001/doctors');
        if (res.data && res.data.data) {
          setDoctorsList(res.data.data);
        }
      } catch (err) {
        console.log("Offline mode: Loading doctors registry from local storage...");
        const defaultDocs = [
          { id: 1, name: "Dr. Anusha Perera", specialty: "Cardiologist", hospital: "MediConnect Clinic, Colombo", fee: 2500, phone: "+94771234567", image_name: "Anusha.jpg" },
          { id: 2, name: "Dr. Saman Wijesinghe", specialty: "Pediatrician", hospital: "MediConnect Clinic, Kandy", fee: 2000, phone: "+94777654321", image_name: "Saman.jpg" },
          { id: 3, name: "Dr. Savan Wijesinghe", specialty: "Pediatrician", hospital: "MediConnect Clinic, Galle", fee: 2200, phone: "+94779998888", image_name: "Savan.jpg" },
          { id: 4, name: "Dr. Ruwan Jayawardena", specialty: "Neurologist", hospital: "MediConnect Clinic, Colombo", fee: 3000, phone: "+94772345678", image_name: "Ruwan.jpg" },
          { id: 5, name: "Dr. Nirmali Silva", specialty: "Dermatologist", hospital: "MediConnect Clinic, Colombo", fee: 2500, phone: "+94773456789", image_name: "Nirmali.jpg" },
          { id: 6, name: "Dr. Priyantha Gunawardena", specialty: "Orthopedic Surgeon", hospital: "MediConnect Clinic, Kandy", fee: 2800, phone: "+94774567890", image_name: "Priyantha.jpg" },
          { id: 7, name: "Dr. Dilhani Bandara", specialty: "Gynecologist", hospital: "MediConnect Clinic, Galle", fee: 2700, phone: "+94775678901", image_name: "Dilhani.jpg" }
        ];
        const cached = localStorage.getItem('mc_doctors');
        if (cached) {
          setDoctorsList(JSON.parse(cached));
        } else {
          localStorage.setItem('mc_doctors', JSON.stringify(defaultDocs));
          setDoctorsList(defaultDocs);
        }
      }
    };

    fetchDoctors();
  }, []);

  // Check if a doctor or search query was passed via React Router navigation state
  useEffect(() => {
    if (location.state) {
      if (location.state.name) {
        setSelectedDoctor(location.state);
      } else if (location.state.searchQuery) {
        setSearchQuery(location.state.searchQuery);
      }
    }
  }, [location.state]);

  // Dynamic resolver for doctor portraits
  const getDoctorImage = (imgName) => {
    if (!imgName) return doctorPlaceholder;
    if (imgName.startsWith('data:image/') || imgName.startsWith('http://') || imgName.startsWith('https://')) return imgName;
    if (imgName === "Anusha.jpg" || imgName === "Dr. Anusha Perera") return AnushaImg;
    if (imgName === "Saman.jpg" || imgName === "Dr. Saman Wijesinghe") return SamanImg;
    if (imgName === "Savan.jpg" || imgName === "Dr. Savan Wijesinghe") return SavanImg;
    if (imgName === "Ruwan.jpg" || imgName === "Dr. Ruwan Jayawardena") return RuwanImg;
    if (imgName === "Nirmali.jpg" || imgName === "Dr. Nirmali Silva") return NirmaliImg;
    if (imgName === "Priyantha.jpg" || imgName === "Dr. Priyantha Gunawardena") return PriyanthaImg;
    if (imgName === "Dilhani.jpg" || imgName === "Dr. Dilhani Bandara") return DilhaniImg;
    if (imgName.startsWith('doctor_')) {
      return `http://localhost:3001/uploads/${imgName}`;
    }
    return doctorPlaceholder;
  };

  // Filter Catalog Doctors
  const filteredDoctors = doctorsList.filter(doc => {
    const matchQuery = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        doc.hospital.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSpecialty = selectedSpecialty ? doc.specialty === selectedSpecialty : true;
    const matchHospital = selectedHospital ? doc.hospital.includes(selectedHospital) : true;
    return matchQuery && matchSpecialty && matchHospital;
  });

  const specialties = [...new Set(doctorsList.map(d => d.specialty))];
  const hospitals = [...new Set(doctorsList.map(d => d.hospital.split(',')[1]?.trim() || d.hospital))];

  // Submit dynamic booking intake
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!patientName || !phone || !email || !date) {
      alert("Please fill in all medical intake fields!");
      return;
    }
    
    setBookingLoading(true);
    const randomQueue = Math.floor(Math.random() * 18) + 3;
    const payload = {
      patient_name: patientName,
      patient_email: email,
      patient_phone: phone,
      doctor_name: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      date: date,
      time_slot: timeSlot,
      queue_no: randomQueue
    };

    try {
      const res = await axios.post('http://localhost:3001/appointments', payload);
      setQueueNo(res.data.queue_no || randomQueue);
      setBookingLoading(false);
      setShowModal(true);
    } catch (err) {
      console.log("Offline mode: saving appointment to local storage...");
      // Fetch cached appointments and add new
      let appointments = [];
      const cached = localStorage.getItem('mc_appointments');
      if (cached) {
        appointments = JSON.parse(cached);
      }
      const newApt = { id: Date.now(), ...payload, status: 'Confirmed' };
      appointments.push(newApt);
      localStorage.setItem('mc_appointments', JSON.stringify(appointments));
      
      setQueueNo(randomQueue);
      setBookingLoading(false);
      setShowModal(true);
    }
  };

  return (
    <div className="booking-page-container">
      {/* Dynamic Header */}
      <header className="booking-header">
        <div className="booking-brand" onClick={() => navigate('/')}>
          🩺 MEDICONNECT SRI LANKA
        </div>
        <div className="booking-header-actions">
          {selectedDoctor && (
            <button type="button" className="catalog-back-btn" onClick={() => setSelectedDoctor(null)}>
              ← Back to Catalog
            </button>
          )}
          <button type="button" className="back-home-btn" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </header>

      {/* RENDER MODE A: VIEW DOCTOR DIRECTORY/CATALOG */}
      {!selectedDoctor ? (
        <div className="catalog-wrapper animate-fade-in">
          <div className="catalog-hero-text">
            <h1>Browse Specialist Doctor Directory</h1>
            <p>Select your clinical consultant, examine hospital locations, and instantly confirm your session ticket.</p>
          </div>

          {/* Search/Filter Panel */}
          <div className="catalog-filters-card glass-card">
            <h3>🔍 Search & Filter Clinical Registry</h3>
            <div className="filters-row">
              <input 
                type="text" 
                placeholder="Search doctors by name, specialty, clinic region..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="filter-search-box"
              />
              <select value={selectedSpecialty} onChange={(e) => setSelectedSpecialty(e.target.value)} className="filter-select-dropdown">
                <option value="">All Specialties</option>
                {specialties.map((spec, i) => <option key={i} value={spec}>{spec}</option>)}
              </select>
              <select value={selectedHospital} onChange={(e) => setSelectedHospital(e.target.value)} className="filter-select-dropdown">
                <option value="">All Regions</option>
                {hospitals.map((hosp, i) => <option key={i} value={hosp}>{hosp}</option>)}
              </select>
            </div>
          </div>

          {/* Catalog grid */}
          <div className="catalog-doctors-grid">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doc, idx) => (
                <div key={idx} className="catalog-doctor-card animate-scale-up">
                  <div className="catalog-doc-image-wrapper">
                    <img src={getDoctorImage(doc.image_name)} alt={doc.name} className="catalog-doc-img" />
                    <span className="catalog-doc-spec-badge">{doc.specialty}</span>
                  </div>
                  <div className="catalog-doc-details">
                    <h3>{doc.name}</h3>
                    <p className="catalog-doc-hosp">🏥 {doc.hospital}</p>
                    <div className="catalog-divider"></div>
                    <div className="catalog-doc-meta-row">
                      <div>
                        <span className="meta-lbl">Session Fee</span>
                        <strong className="meta-val text-success">LKR {doc.fee.toLocaleString()}</strong>
                      </div>
                      <div>
                        <span className="meta-lbl">Rating</span>
                        <strong className="meta-val">⭐ 4.9 (48)</strong>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      className="catalog-book-btn-cta"
                      onClick={() => setSelectedDoctor(doc)}
                    >
                      Channel Specialist 🩺
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="catalog-empty-state">
                <span className="empty-catalog-icon">🔍</span>
                <h4>No Specialists Match Your Parameters</h4>
                <p>Try resetting the region filters or typing another search query.</p>
                <button type="button" className="reset-filters-btn" onClick={() => { setSearchQuery(''); setSelectedSpecialty(''); setSelectedHospital(''); }}>
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* RENDER MODE B: RENDER INTAKE FORM FOR SELECTED DOCTOR */
        <div className="booking-grid animate-fade-in">
          {/* Doctor Spotlight Panel */}
          <div className="doctor-spotlight-card">
            <div className="badge">Active Selection</div>
            <img src={selectedDoctor.image || getDoctorImage(selectedDoctor.image_name)} alt={selectedDoctor.name} className="booking-doc-img" />
            <h2>{selectedDoctor.name}</h2>
            <span className="doc-specialty">{selectedDoctor.specialty}</span>
            
            <div className="clinic-details-meta">
              <div className="meta-item">
                <span className="meta-label">🏥 Hospital / Room</span>
                <span className="meta-value">{selectedDoctor.hospital || "MediConnect Clinic, Room 04"}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">💵 Channeling Fee</span>
                <span className="meta-value">LKR {Number(selectedDoctor.fee || 2500).toLocaleString()}.00</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">⭐ Hospital Rating</span>
                <span className="meta-value">4.9 / 5.0 rating</span>
              </div>
            </div>
          </div>

          {/* Intake Form Panel */}
          <div className="intake-form-card">
            <h3>Clinical Intake Intake Form</h3>
            <p>Please enter the patient credentials below to generate an official hospital ticket.</p>
            
            <form onSubmit={handleBookingSubmit} className="booking-form">
              <div className="form-group">
                <label htmlFor="pname">Patient Full Name</label>
                <input 
                  id="pname"
                  type="text" 
                  placeholder="Enter patient's name" 
                  value={patientName} 
                  onChange={(e) => setPatientName(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="pphone">Mobile Phone Number</label>
                  <input 
                    id="pphone"
                    type="tel" 
                    placeholder="+94 XX XXX XXXX" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="pemail">Email Address</label>
                  <input 
                    id="pemail"
                    type="email" 
                    placeholder="name@gmail.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="pdate">Appointment Date</label>
                  <input 
                    id="pdate"
                    type="date" 
                    value={date} 
                    min={new Date().toISOString().split('T')[0]} 
                    onChange={(e) => setDate(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="pslot">Time Session Slot</label>
                  <select 
                    id="pslot"
                    value={timeSlot} 
                    onChange={(e) => setTimeSlot(e.target.value)}
                  >
                    <option value="04:30 PM - 05:00 PM">04:30 PM - 05:00 PM</option>
                    <option value="05:00 PM - 05:30 PM">05:00 PM - 05:30 PM</option>
                    <option value="05:30 PM - 06:00 PM">05:30 PM - 06:00 PM</option>
                    <option value="06:00 PM - 06:30 PM">06:00 PM - 06:30 PM</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="confirm-booking-btn" disabled={bookingLoading}>
                {bookingLoading ? "Processing intake details..." : `Confirm & Book Appointment - LKR ${Number(selectedDoctor.fee || 2500).toLocaleString()}`}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation & Invoice Receipt Modal */}
      {showModal && (
        <div className="invoice-modal-overlay">
          <div className="invoice-card animate-scale-up">
            <div className="invoice-status">🎉 Channeling Confirmed!</div>
            <div className="invoice-ticket-icon">🩺</div>
            <h2>Appointment Confirmed</h2>
            <p>Your session with <strong>{selectedDoctor?.name}</strong> has been successfully booked.</p>

            <div className="invoice-receipt-sheet">
              <div className="sheet-row">
                <span>Patient Name:</span>
                <strong>{patientName}</strong>
              </div>
              <div className="sheet-row">
                <span>Session Date:</span>
                <strong>{date}</strong>
              </div>
              <div className="sheet-row">
                <span>Session Session:</span>
                <strong>{timeSlot}</strong>
              </div>
              <div className="sheet-row">
                <span>Queue Number:</span>
                <span className="badge-queue">#{queueNo}</span>
              </div>
              <div className="sheet-row total-row">
                <span>Total Fee (Paid):</span>
                <strong>LKR {Number(selectedDoctor?.fee || 2500).toLocaleString()}.00</strong>
              </div>
            </div>

            <div className="invoice-actions">
              <button 
                type="button" 
                className="invoice-print-btn" 
                onClick={() => { alert("Printing invoice receipt ticket..."); }}
              >
                🖨️ Print Ticket Receipt
              </button>
              <button 
                type="button" 
                className="invoice-close-btn" 
                onClick={() => {
                  setShowModal(false);
                  navigate('/dashboard'); // Route back to patient wellness dashboard
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Embedded CSS specifically for catalog and premium layouts */}
      <style>{`
        .booking-page-container {
          min-height: 100vh;
          background: radial-gradient(circle at 50% 50%, #f1f7fc 0%, #e2eaf4 100%);
          font-family: 'Plus Jakarta Sans', 'Outfit', sans-serif;
          padding: 40px 6%;
          box-sizing: border-box;
        }

        .booking-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }

        .booking-brand {
          font-family: 'Outfit', sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: #0b2240;
          cursor: pointer;
        }

        .booking-header-actions {
          display: flex;
          gap: 15px;
        }

        .catalog-back-btn {
          background: #ebf5ff;
          border: 1px solid #007bff;
          color: #007bff;
          padding: 10px 20px;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
        }

        .catalog-back-btn:hover {
          background: #007bff;
          color: white;
        }

        .back-home-btn {
          background: white;
          border: 1.5px solid #cbd5e1;
          padding: 10px 20px;
          font-weight: 700;
          color: #475467;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .back-home-btn:hover {
          background: #f8fafc;
          border-color: #94a3b8;
        }

        /* --- CATALOG LAYOUT STYLES --- */
        .catalog-wrapper {
          max-width: 1200px;
          margin: 0 auto;
        }

        .catalog-hero-text {
          text-align: center;
          margin-bottom: 40px;
        }

        .catalog-hero-text h1 {
          font-family: 'Outfit', sans-serif;
          font-size: 42px;
          font-weight: 800;
          color: #0b2240;
          margin: 0 0 10px 0;
          letter-spacing: -1px;
        }

        .catalog-hero-text p {
          font-size: 16px;
          color: #637381;
          margin: 0;
        }

        .catalog-filters-card {
          padding: 24px 30px;
          border-radius: 18px;
          margin-bottom: 40px;
          text-align: left;
        }

        .catalog-filters-card h3 {
          font-size: 16px;
          font-weight: 800;
          color: #0b2240;
          margin: 0 0 16px 0;
        }

        .filters-row {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .filter-search-box {
          flex: 1.5;
          min-width: 250px;
          padding: 12px 18px;
          border: 1.5px solid #d0d5dd;
          border-radius: 10px;
          font-size: 14px;
        }

        .filter-select-dropdown {
          flex: 1;
          min-width: 180px;
          padding: 12px 16px;
          border: 1.5px solid #d0d5dd;
          border-radius: 10px;
          background: white;
          font-size: 14px;
          font-weight: 600;
          color: #475467;
        }

        /* Catalog grid list */
        .catalog-doctors-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
          margin-top: 20px;
        }

        @media (max-width: 1024px) {
          .catalog-doctors-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .catalog-doctors-grid {
            grid-template-columns: 1fr;
          }
        }

        .catalog-doctor-card {
          background: white;
          border-radius: 24px;
          border: 1px solid #e2e8f0;
          padding: 35px 25px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(11, 34, 64, 0.03);
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .catalog-doctor-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(11, 34, 64, 0.08);
          border-color: rgba(0, 123, 255, 0.2);
        }

        .catalog-doc-image-wrapper {
          position: relative;
          width: 150px;
          height: 150px;
          margin-bottom: 25px;
          background: transparent;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .catalog-doc-img {
          width: 150px;
          height: 150px;
          object-fit: cover;
          border-radius: 50%;
          border: 4px solid #ebf5ff;
          box-shadow: 0 8px 16px rgba(0, 123, 255, 0.06);
          image-rendering: -webkit-optimize-contrast;
        }

        .catalog-doc-spec-badge {
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          background: #007bff;
          color: white;
          font-size: 11px;
          font-weight: 800;
          padding: 4px 14px;
          border-radius: 50px;
          box-shadow: 0 4px 10px rgba(0, 123, 255, 0.25);
          white-space: nowrap;
        }

        .catalog-doc-details {
          padding: 0;
          text-align: center;
          width: 100%;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .catalog-doc-details h3 {
          font-size: 19px;
          font-weight: 800;
          color: #0b2240;
          margin: 10px 0 6px 0;
        }

        .catalog-doc-hosp {
          font-size: 13px;
          color: #637381;
          margin: 0 0 16px 0;
        }

        .catalog-divider {
          height: 1px;
          background: #f1f5f9;
          margin-bottom: 14px;
          width: 100%;
        }

        .catalog-doc-meta-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          width: 100%;
        }

        .meta-lbl {
          display: block;
          font-size: 10px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          margin-bottom: 2px;
        }

        .meta-val {
          font-size: 14px;
          font-weight: 800;
          color: #334155;
        }

        .text-success {
          color: #10b981;
        }

        .catalog-book-btn-cta {
          background: #007bff;
          color: white;
          border: none;
          width: 100%;
          padding: 13px;
          font-size: 14px;
          font-weight: 700;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 10px rgba(0, 123, 255, 0.15);
          margin-top: auto;
        }

        .catalog-book-btn-cta:hover {
          background: #0056b3;
          box-shadow: 0 6px 15px rgba(0, 123, 255, 0.25);
        }

        .catalog-empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 80px 20px;
        }

        .empty-catalog-icon {
          font-size: 54px;
          display: block;
          margin-bottom: 15px;
        }

        .catalog-empty-state h4 {
          font-size: 18px;
          font-weight: 800;
          color: #0b2240;
          margin: 0 0 6px 0;
        }

        .catalog-empty-state p {
          font-size: 14px;
          color: #637381;
          margin: 0 0 20px 0;
        }

        .reset-filters-btn {
          background: #0b2240;
          color: white;
          border: none;
          padding: 10px 24px;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
        }

        /* --- SINGLE DOCTOR BOOKING INTAKE LAYOUT --- */
        .booking-grid {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 40px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .doctor-spotlight-card,
        .intake-form-card {
          background: white;
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 20px 40px rgba(11, 34, 64, 0.04);
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-sizing: border-box;
        }

        .doctor-spotlight-card {
          text-align: center;
        }

        .booking-doc-img {
          width: 160px;
          height: 160px;
          object-fit: cover;
          border-radius: 50%;
          border: 5px solid #ebf5ff;
          margin: 20px 0;
          box-shadow: 0 8px 16px rgba(0, 123, 255, 0.06);
        }

        .doctor-spotlight-card h2 {
          font-size: 24px;
          font-weight: 800;
          color: #0b2240;
          margin: 0 0 6px 0;
        }

        .doc-specialty {
          font-size: 14px;
          font-weight: 700;
          color: #007bff;
          background: #ebf5ff;
          padding: 6px 16px;
          border-radius: 50px;
          display: inline-block;
          margin-bottom: 30px;
        }

        .clinic-details-meta {
          border-top: 1px solid #f1f5f9;
          padding-top: 25px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          text-align: left;
        }

        .meta-item {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
        }

        .meta-label {
          color: #637381;
          font-weight: 500;
        }

        .meta-value {
          color: #0b2240;
          font-weight: 700;
        }

        .intake-form-card h3 {
          font-size: 24px;
          font-weight: 800;
          color: #0b2240;
          margin: 0 0 8px 0;
        }

        .intake-form-card p {
          font-size: 14px;
          color: #637381;
          margin-bottom: 30px;
        }

        .booking-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          text-align: left;
        }

        .form-group label {
          font-size: 13px;
          font-weight: 700;
          color: #344054;
        }

        .form-group input,
        .form-group select {
          padding: 12px 16px;
          border: 1.5px solid #d0d5dd;
          border-radius: 10px;
          font-size: 15px;
          color: #1d2939;
          background: white;
          width: 100%;
          box-sizing: border-box;
          transition: all 0.2s ease;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.12);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .confirm-booking-btn {
          background: #007bff;
          color: white;
          border: none;
          padding: 16px;
          font-size: 16px;
          font-weight: 700;
          border-radius: 12px;
          cursor: pointer;
          margin-top: 15px;
          box-shadow: 0 8px 20px rgba(0, 123, 255, 0.2);
          transition: all 0.25s ease;
        }

        .confirm-booking-btn:hover {
          background: #0056b3;
          box-shadow: 0 10px 24px rgba(0, 123, 255, 0.3);
          transform: translateY(-1px);
        }

        /* --- MODAL BILL RECEIPT STYLES --- */
        .invoice-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(11, 34, 64, 0.5);
          backdrop-filter: blur(8px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
          padding: 20px;
        }

        .invoice-card {
          background: white;
          padding: 40px;
          border-radius: 28px;
          max-width: 480px;
          width: 100%;
          text-align: center;
          box-shadow: 0 30px 60px rgba(11, 34, 64, 0.2);
          box-sizing: border-box;
        }

        .invoice-status {
          color: #10b981;
          background: #ecfdf5;
          display: inline-block;
          padding: 6px 18px;
          font-weight: 800;
          font-size: 14px;
          border-radius: 50px;
          margin-bottom: 20px;
        }

        .invoice-ticket-icon {
          font-size: 48px;
          margin-bottom: 12px;
        }

        .invoice-card h2 {
          font-size: 26px;
          font-weight: 800;
          color: #0b2240;
          margin: 0 0 8px 0;
        }

        .invoice-card p {
          font-size: 15px;
          color: #637381;
          margin-bottom: 25px;
        }

        .invoice-receipt-sheet {
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
          padding: 20px;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 30px;
        }

        .sheet-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: #475467;
        }

        .badge-queue {
          background: #007bff;
          color: white;
          font-weight: 800;
          padding: 2px 10px;
          border-radius: 6px;
          font-size: 12px;
        }

        .total-row {
          border-top: 1px dashed #cbd5e1;
          padding-top: 12px;
          font-size: 16px;
          color: #0b2240;
        }

        .invoice-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .invoice-print-btn {
          background: white;
          border: 1.5px solid #007bff;
          color: #007bff;
          padding: 14px;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .invoice-print-btn:hover {
          background: #ebf5ff;
        }

        .invoice-close-btn {
          background: #0b2240;
          color: white;
          border: none;
          padding: 14px;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .invoice-close-btn:hover {
          background: #162a45;
        }

        /* --- COMMON UTILITIES --- */
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }

        .animate-scale-up {
          animation: scaleUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        @media (max-width: 900px) {
          .booking-grid {
            grid-template-columns: 1fr;
          }
          .booking-page-container {
            padding: 30px 4%;
          }
        }

        @media (max-width: 600px) {
          .form-row {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .doctor-spotlight-card,
          .intake-form-card {
            padding: 24px;
          }
          .catalog-filters-card {
            padding: 20px;
          }
          .filters-row {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingPage;
