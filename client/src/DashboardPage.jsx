import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- COMMON GLOBAL STATE & PERSISTENCE ---
  const [doctorsList, setDoctorsList] = useState([]);
  const [appointmentsList, setAppointmentsList] = useState([]);
  const [patientsList, setPatientsList] = useState([]);
  const [availabilitiesList, setAvailabilitiesList] = useState([]);
  const [recordsList, setRecordsList] = useState([]);

  // Check login session
  useEffect(() => {
    const loggedUser = localStorage.getItem('user');
    if (!loggedUser) {
      alert("Please login first to view your dashboard!");
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(loggedUser);
    setUser(parsedUser);
    setLoading(false);
  }, [navigate]);

  // Load backend data or initialize fallback local storage data
  useEffect(() => {
    if (!user) return;

    const fetchAllData = async () => {
      try {
        // Fetch Doctors
        const docRes = await axios.get('http://localhost:3001/doctors');
        setDoctorsList(docRes.data.data);
      } catch (err) {
        console.log("Offline mode: loading doctors from local mock database...");
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

      try {
        // Fetch Appointments
        const aptRes = await axios.get('http://localhost:3001/appointments');
        setAppointmentsList(aptRes.data.data);
      } catch (err) {
        console.log("Offline mode: loading appointments from local storage...");
        const defaultApts = [
          {
            id: 101,
            patient_name: "Dahami Perera",
            patient_email: "dahami.p@gmail.com",
            patient_phone: "+94778123456",
            doctor_name: "Dr. Anusha Perera",
            specialty: "Cardiologist",
            date: "2026-06-02",
            time_slot: "04:30 PM - 05:00 PM",
            status: "Confirmed",
            queue_no: 12
          },
          {
            id: 102,
            patient_name: "John Doe",
            patient_email: "john@gmail.com",
            patient_phone: "+94771112222",
            doctor_name: "Dr. Saman Wijesinghe",
            specialty: "Pediatrician",
            date: "2026-05-30",
            time_slot: "05:00 PM - 05:30 PM",
            status: "Confirmed",
            queue_no: 5
          }
        ];
        const cached = localStorage.getItem('mc_appointments');
        if (cached) {
          setAppointmentsList(JSON.parse(cached));
        } else {
          localStorage.setItem('mc_appointments', JSON.stringify(defaultApts));
          setAppointmentsList(defaultApts);
        }
      }

      try {
        // Fetch Availabilities
        const avRes = await axios.get('http://localhost:3001/availabilities');
        setAvailabilitiesList(avRes.data.data);
      } catch (err) {
        console.log("Offline mode: loading availabilities...");
        const defaultAvail = [
          { id: 1, doctor_name: "Dr. Anusha Perera", date: "2026-06-02", time_slot: "04:30 PM - 05:00 PM" },
          { id: 2, doctor_name: "Dr. Anusha Perera", date: "2026-06-02", time_slot: "05:00 PM - 05:30 PM" },
          { id: 3, doctor_name: "Dr. Saman Wijesinghe", date: "2026-06-03", time_slot: "04:30 PM - 05:00 PM" }
        ];
        const cached = localStorage.getItem('mc_availabilities');
        if (cached) {
          setAvailabilitiesList(JSON.parse(cached));
        } else {
          localStorage.setItem('mc_availabilities', JSON.stringify(defaultAvail));
          setAvailabilitiesList(defaultAvail);
        }
      }

      try {
        // Fetch Patient Records
        const recRes = await axios.get('http://localhost:3001/patient-records');
        setRecordsList(recRes.data.data);
      } catch (err) {
        console.log("Offline mode: loading patient records...");
        const defaultRecs = [
          { id: 1, patient_name: "Dahami Perera", doctor_name: "Dr. Anusha Perera", date: "2026-05-15", notes: "Patient reported mild chest pressure during light cardio. ECG showed stable sinus rhythm. Prescribed mild beta-blocker and advised a follow-up in 2 weeks." },
          { id: 2, patient_name: "John Doe", doctor_name: "Dr. Saman Wijesinghe", date: "2026-04-20", notes: "Routine immunization dose completed. No allergies reported. Healthy growth metrics." }
        ];
        const cached = localStorage.getItem('mc_records');
        if (cached) {
          setRecordsList(JSON.parse(cached));
        } else {
          localStorage.setItem('mc_records', JSON.stringify(defaultRecs));
          setRecordsList(defaultRecs);
        }
      }

      try {
        // Fetch Patients (Users list)
        const patRes = await axios.get('http://localhost:3001/patients');
        setPatientsList(patRes.data.data);
      } catch (err) {
        console.log("Offline mode: loading patients list...");
        const defaultPatients = [
          { id: 777, username: "Dahami Perera", email: "dahami.p@gmail.com", role: "patient", created_at: "2026-05-01" },
          { id: 778, username: "John Doe", email: "john@gmail.com", role: "patient", created_at: "2026-05-10" }
        ];
        const cached = localStorage.getItem('mc_patients');
        if (cached) {
          setPatientsList(JSON.parse(cached));
        } else {
          localStorage.setItem('mc_patients', JSON.stringify(defaultPatients));
          setPatientsList(defaultPatients);
        }
      }
    };

    fetchAllData();
  }, [user]);

  // Sync state helpers back to localstorage in case of offline updates
  const syncLocalDoctors = (updated) => {
    setDoctorsList(updated);
    localStorage.setItem('mc_doctors', JSON.stringify(updated));
  };
  const syncLocalAppointments = (updated) => {
    setAppointmentsList(updated);
    localStorage.setItem('mc_appointments', JSON.stringify(updated));
  };
  const syncLocalAvailabilities = (updated) => {
    setAvailabilitiesList(updated);
    localStorage.setItem('mc_availabilities', JSON.stringify(updated));
  };
  const syncLocalRecords = (updated) => {
    setRecordsList(updated);
    localStorage.setItem('mc_records', JSON.stringify(updated));
  };

  const handleSignOut = () => {
    localStorage.removeItem('user');
    alert("Signing out... Thank you for using MediConnect!");
    navigate('/');
  };

  if (loading || !user) {
    return (
      <div className="db-loading-screen">
        <div className="spinner">🩺</div>
        <p>Loading your medical panel...</p>
      </div>
    );
  }

  // --- DYNAMIC RESOLVER FOR SPECIALIST IMAGE ---
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

  // Helper to check if a date is today or in the future (ignores time component timezone bugs)
  const isTodayOrFuture = (dateVal) => {
    if (!dateVal) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let d;
    if (dateVal instanceof Date) {
      d = new Date(dateVal.getFullYear(), dateVal.getMonth(), dateVal.getDate());
    } else {
      const dateStr = String(dateVal).split('T')[0];
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      } else {
        d = new Date(dateVal);
        d.setHours(0, 0, 0, 0);
      }
    }
    return d.getTime() >= today.getTime();
  };

  // ==========================================
  // 1. PATIENT DASHBOARD COMPONENT
  // ==========================================
  const PatientDashboard = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterSpecialty, setFilterSpecialty] = useState('');
    const [filterHospital, setFilterHospital] = useState('');

    // Fetch user appointments specifically
    const myAppointments = appointmentsList.filter(apt => 
      apt.patient_name.toLowerCase() === user.username.toLowerCase() ||
      apt.patient_email.toLowerCase() === user.email.toLowerCase()
    );

    // Fetch booking history (past appointments - e.g. status was Completed or dates in the past)
    const bookingHistory = myAppointments.filter(apt => 
      !isTodayOrFuture(apt.date) || apt.status === 'Cancelled'
    );

    const activeAppointments = myAppointments.filter(apt => 
      isTodayOrFuture(apt.date) && apt.status !== 'Cancelled'
    );

    // Filter doctors list
    const filteredDoctors = doctorsList.filter(doc => {
      const matchQuery = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.hospital.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSpecialty = filterSpecialty ? doc.specialty === filterSpecialty : true;
      const matchHospital = filterHospital ? doc.hospital.includes(filterHospital) : true;
      return matchQuery && matchSpecialty && matchHospital;
    });

    const specialties = [...new Set(doctorsList.map(d => d.specialty))];
    const hospitals = [...new Set(doctorsList.map(d => d.hospital.split(',')[1]?.trim() || d.hospital))];

    const handleCancelAppointment = async (aptId) => {
      if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
      try {
        await axios.patch(`http://localhost:3001/appointments/${aptId}`, { status: 'Cancelled' });
        // Update live state
        setAppointmentsList(prev => prev.map(a => a.id === aptId ? { ...a, status: 'Cancelled' } : a));
        alert("Appointment Cancelled successfully!");
      } catch (err) {
        // Fallback
        const updated = appointmentsList.map(a => a.id === aptId ? { ...a, status: 'Cancelled' } : a);
        syncLocalAppointments(updated);
        alert("Appointment Cancelled (Offline Mode)!");
      }
    };

    const handleQuickBook = (doc) => {
      navigate('/booking', { 
        state: { 
          name: doc.name, 
          specialty: doc.specialty, 
          image_name: doc.image_name,
          image: getDoctorImage(doc.image_name) || doctorPlaceholder,
          fee: doc.fee,
          hospital: doc.hospital
        } 
      });
    };

    return (
      <div className="role-dashboard">
        <header className="db-main-header">
          <div>
            <h1>Patient Wellness Panel</h1>
            <p className="welcome-sub">Welcome back, <strong>{user.username}</strong>! Manage your clinical channeling seamlessly.</p>
          </div>
          <span className="current-date">🗓️ Active Session: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </header>

        {/* 1. Stat cards */}
        <div className="db-stats-grid">
          <div className="db-stat-card border-left-primary">
            <span className="stat-icon bg-primary-light">📅</span>
            <div>
              <h3>{activeAppointments.length} Active</h3>
              <p>Upcoming Bookings</p>
            </div>
          </div>
          <div className="db-stat-card border-left-secondary">
            <span className="stat-icon bg-secondary-light">📂</span>
            <div>
              <h3>{bookingHistory.length} Sessions</h3>
              <p>Completed History</p>
            </div>
          </div>
          <div className="db-stat-card border-left-success">
            <span className="stat-icon bg-success-light">💳</span>
            <div>
              <h3>LKR {(myAppointments.length * 2500).toLocaleString()}</h3>
              <p>Total Channel Fees</p>
            </div>
          </div>
        </div>

        {/* 2. Doctor Search and Specialty Filters */}
        <section className="db-section glass-card">
          <div className="section-title-row">
            <h3>🔍 Advanced Doctor Specialist Search</h3>
            <button className="primary-btn" onClick={() => navigate('/booking')}>Browse Full Catalog →</button>
          </div>
          
          <div className="filter-panel-row">
            <input 
              type="text" 
              placeholder="Search by Doctor Name, Specialty, or Hospital..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input-box"
            />
            <select value={filterSpecialty} onChange={(e) => setFilterSpecialty(e.target.value)} className="filter-select">
              <option value="">All Specialties</option>
              {specialties.map((spec, i) => <option key={i} value={spec}>{spec}</option>)}
            </select>
            <select value={filterHospital} onChange={(e) => setFilterHospital(e.target.value)} className="filter-select">
              <option value="">All Regions</option>
              {hospitals.map((hosp, i) => <option key={i} value={hosp}>{hosp}</option>)}
            </select>
          </div>

          <div className="search-results-grid">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doc, idx) => (
                <div key={idx} className="mini-doctor-search-card">
                  <img src={getDoctorImage(doc.image_name)} alt={doc.name} className="search-doc-img" />
                  <div className="search-doc-info">
                    <h4>{doc.name}</h4>
                    <span className="badge-spec">{doc.specialty}</span>
                    <p className="search-doc-hosp">🏥 {doc.hospital}</p>
                    <p className="search-doc-fee">💵 LKR {doc.fee.toLocaleString()}</p>
                  </div>
                  <button className="book-inline-btn" onClick={() => handleQuickBook(doc)}>Book Now</button>
                </div>
              ))
            ) : (
              <p className="no-records-msg">No doctors found matching the search filters.</p>
            )}
          </div>
        </section>

        {/* 3. My Active Appointments */}
        <section className="db-section">
          <h3>📅 My Upcoming Appointments</h3>
          {activeAppointments.length > 0 ? (
            <div className="table-responsive">
              <table className="db-table">
                <thead>
                  <tr>
                    <th>Ref ID</th>
                    <th>Consultant Specialist</th>
                    <th>Specialty</th>
                    <th>Appointment Date & Time</th>
                    <th>Queue Reference</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {activeAppointments.map((apt, index) => (
                    <tr key={index}>
                      <td><strong>#MC-{apt.id}</strong></td>
                      <td>{apt.doctor_name}</td>
                      <td><span className="badge-spec">{apt.specialty}</span></td>
                      <td>📅 {apt.date} at 🕒 {apt.time_slot}</td>
                      <td><span className="badge-q">#{apt.queue_no}</span></td>
                      <td>
                        <span className={`badge-pill ${apt.status?.toLowerCase() === 'confirmed' ? 'badge-completed' : 'badge-cancelled'}`}>
                          {apt.status}
                        </span>
                      </td>
                      <td>
                        <button className="cancel-icon-btn" onClick={() => handleCancelAppointment(apt.id)}>Cancel ✖</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-panel">
              <span className="empty-emoji">🗓️</span>
              <p>You have no active upcoming appointments scheduled. Need immediate medical counsel?</p>
              <button className="secondary-btn" onClick={() => navigate('/booking')}>Channel a Doctor Now</button>
            </div>
          )}
        </section>

        {/* 4. Booking History & Quick Book panel */}
        <div className="db-two-column">
          <section className="db-section flex-1">
            <h3>📁 Booking History & Clinical Archive</h3>
            {bookingHistory.length > 0 ? (
              <div className="simple-list">
                {bookingHistory.map((apt, idx) => (
                  <div key={idx} className="simple-list-item">
                    <div>
                      <h4>{apt.doctor_name}</h4>
                      <p>{apt.specialty} | {apt.date}</p>
                    </div>
                    <span className={`badge-pill ${apt.status?.toLowerCase() === 'cancelled' ? 'badge-cancelled' : 'badge-completed'}`}>
                      {apt.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-records-msg">No past appointments in medical log history.</p>
            )}
          </section>

          <section className="db-section flex-1">
            <h3>⚡ Quick Book Specialists</h3>
            <p className="section-sub-desc">Instantly set up a slot with doctors you visit frequently:</p>
            <div className="quick-book-flex">
              {doctorsList.slice(0, 3).map((doc, idx) => (
                <div key={idx} className="quick-book-card" onClick={() => handleQuickBook(doc)}>
                  <img src={getDoctorImage(doc.image_name)} alt={doc.name} className="qb-avatar" />
                  <div>
                    <h5>{doc.name}</h5>
                    <p>{doc.specialty}</p>
                  </div>
                  <span className="qb-arrow">⚡</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  };

  // ==========================================
  // 2. DOCTOR DASHBOARD COMPONENT
  // ==========================================
  const DoctorDashboard = () => {
    // Find matching doctor record from doctor list
    const doctorObj = doctorsList.find(d => {
      if (d.user_id !== null && d.user_id !== undefined) {
        return d.user_id === user.id;
      }
      const uName = user.username?.toLowerCase() || '';
      const fullName = user.name?.toLowerCase() || '';
      const docName = d.name?.toLowerCase() || '';
      
      const matchUsername = uName && docName.includes(uName);
      const matchFullName = fullName && docName.includes(fullName);
      
      return matchUsername || matchFullName;
    }) || {
      name: user.name || "Dr. " + user.username.charAt(0).toUpperCase() + user.username.slice(1),
      specialty: "General Physician",
      hospital: "MediConnect Clinic, Colombo",
      fee: 2500,
      phone: "+94 77 123 4567"
    };

    const [doctorName, setDoctorName] = useState(doctorObj.name);
    const [specialty, setSpecialty] = useState(doctorObj.specialty);
    const [hospital, setHospital] = useState(doctorObj.hospital);
    const [fee, setFee] = useState(doctorObj.fee);
    const [phone, setPhone] = useState(doctorObj.phone);

    // Manage availability states
    const [newSlotDate, setNewSlotDate] = useState('');
    const [newSlotTime, setNewSlotTime] = useState('04:30 PM - 05:00 PM');

    // Medical records state
    const [selectedPatientName, setSelectedPatientName] = useState('');
    const [diagnosisNotes, setDiagnosisNotes] = useState('');
    const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0]);

    // Filter appointments for this doctor specifically
    const docAppointments = appointmentsList.filter(apt => {
      const aptDocName = apt.doctor_name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const currentDocName = doctorObj.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      return aptDocName.includes(currentDocName) || currentDocName.includes(aptDocName);
    });

    const upcomingAppointments = docAppointments.filter(apt => 
      isTodayOrFuture(apt.date) && apt.status !== 'Cancelled'
    );

    const mySlots = availabilitiesList.filter(slot => {
      const slotDocName = slot.doctor_name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const currentDocName = doctorObj.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      return slotDocName.includes(currentDocName) || currentDocName.includes(slotDocName);
    });

    const myPatientRecords = recordsList.filter(rec => {
      const recDocName = rec.doctor_name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const currentDocName = doctorObj.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      return recDocName.includes(currentDocName) || currentDocName.includes(recDocName);
    });

    const handleSaveProfile = (e) => {
      e.preventDefault();
      // Update doctor record
      const updatedDocs = doctorsList.map(d => 
        d.id === doctorObj.id ? { ...d, name: doctorName, specialty, hospital, fee: Number(fee), phone } : d
      );
      syncLocalDoctors(updatedDocs);
      alert("Specialist Profile successfully updated!");
    };

    const handleAddAvailability = async (e) => {
      e.preventDefault();
      if (!newSlotDate || !newSlotTime) {
        alert("Please provide date and session slot details!");
        return;
      }
      try {
        const payload = { doctor_name: doctorObj.name, date: newSlotDate, time_slot: newSlotTime };
        const res = await axios.post('http://localhost:3001/availabilities', payload);
        setAvailabilitiesList(prev => [...prev, { id: res.data.id, ...payload }]);
        alert("Availability Slot registered successfully!");
      } catch (err) {
        // Fallback
        const payload = { id: Date.now(), doctor_name: doctorObj.name, date: newSlotDate, time_slot: newSlotTime };
        syncLocalAvailabilities([...availabilitiesList, payload]);
        alert("Slot Registered (Offline Fallback Mode)!");
      }
      setNewSlotDate('');
    };

    const handleDeleteSlot = async (slotId) => {
      if (!window.confirm("Delete this availability slot?")) return;
      try {
        await axios.delete(`http://localhost:3001/availabilities/${slotId}`);
        setAvailabilitiesList(prev => prev.filter(s => s.id !== slotId));
      } catch (err) {
        syncLocalAvailabilities(availabilitiesList.filter(s => s.id !== slotId));
        alert("Slot Deleted (Offline Mode)!");
      }
    };

    const handleAddPatientRecord = async (e) => {
      e.preventDefault();
      if (!selectedPatientName || !diagnosisNotes) {
        alert("Please fill in the patient name and medical notes!");
        return;
      }
      try {
        const payload = { patient_name: selectedPatientName, doctor_name: doctorObj.name, date: recordDate, notes: diagnosisNotes };
        const res = await axios.post('http://localhost:3001/patient-records', payload);
        setRecordsList(prev => [...prev, { id: res.data.id, ...payload }]);
        alert("Patient Clinical Record registered successfully!");
      } catch (err) {
        // Fallback
        const payload = { id: Date.now(), patient_name: selectedPatientName, doctor_name: doctorObj.name, date: recordDate, notes: diagnosisNotes };
        syncLocalRecords([...recordsList, payload]);
        alert("Clinical Record added (Offline Mode)!");
      }
      setSelectedPatientName('');
      setDiagnosisNotes('');
    };

    const handleUpdateAppointmentStatus = async (aptId, newStatus) => {
      try {
        await axios.patch(`http://localhost:3001/appointments/${aptId}`, { status: newStatus });
        setAppointmentsList(prev => prev.map(a => a.id === aptId ? { ...a, status: newStatus } : a));
        alert(`Appointment status updated to ${newStatus}!`);
      } catch (err) {
        const updated = appointmentsList.map(a => a.id === aptId ? { ...a, status: newStatus } : a);
        syncLocalAppointments(updated);
        alert(`Status updated to ${newStatus} (Offline Mode)!`);
      }
    };

    return (
      <div className="role-dashboard">
        <header className="db-main-header">
          <div>
            <h1>Specialist Doctor Console</h1>
            <p className="welcome-sub">Welcome back, <strong>{doctorObj.name}</strong>! Review your upcoming patients, clinical agenda, and availability.</p>
          </div>
          <span className="current-date">🩺 Room Reference: Room 04, Level 2</span>
        </header>

        {/* Stats Section */}
        <div className="db-stats-grid">
          <div className="db-stat-card border-left-primary">
            <span className="stat-icon bg-primary-light">👥</span>
            <div>
              <h3>{upcomingAppointments.length} Patients</h3>
              <p>Upcoming Appointments</p>
            </div>
          </div>
          <div className="db-stat-card border-left-secondary">
            <span className="stat-icon bg-secondary-light">⏲️</span>
            <div>
              <h3>{mySlots.length} Slots</h3>
              <p>Availability Sessions</p>
            </div>
          </div>
          <div className="db-stat-card border-left-success">
            <span className="stat-icon bg-success-light">📄</span>
            <div>
              <h3>{myPatientRecords.length} Records</h3>
              <p>Saved Clinical Folders</p>
            </div>
          </div>
        </div>

        {/* Upcoming appointments list */}
        <section className="db-section">
          <h3>📅 Upcoming Consultations Agenda</h3>
          {upcomingAppointments.length > 0 ? (
            <div className="table-responsive">
              <table className="db-table">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Email Address</th>
                    <th>Mobile Phone</th>
                    <th>Scheduled Date</th>
                    <th>Time Slot</th>
                    <th>Queue ID</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingAppointments.map((apt, index) => (
                    <tr key={index}>
                      <td><strong>{apt.patient_name}</strong></td>
                      <td>{apt.patient_email}</td>
                      <td>{apt.patient_phone}</td>
                      <td>{apt.date}</td>
                      <td><span className="badge-q">{apt.time_slot}</span></td>
                      <td><strong>#{apt.queue_no}</strong></td>
                      <td>
                        <span className={`badge-pill ${apt.status?.toLowerCase() === 'confirmed' ? 'badge-completed' : 'badge-cancelled'}`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button className="complete-btn" onClick={() => handleUpdateAppointmentStatus(apt.id, 'Confirmed')}>Approve ✓</button>
                        <button className="cancel-inline-btn" onClick={() => handleUpdateAppointmentStatus(apt.id, 'Cancelled')}>Cancel ✖</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-records-msg">No upcoming consultations booked for your panel currently.</p>
          )}
        </section>

        {/* Manage Availability & Patient Records columns */}
        <div className="db-two-column">
          {/* Availability manager */}
          <section className="db-section flex-1 glass-card">
            <h3>⏰ Manage Availability Sessions</h3>
            <form onSubmit={handleAddAvailability} className="inline-add-form">
              <div className="form-group">
                <label>Active Date</label>
                <input 
                  type="date" 
                  value={newSlotDate} 
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setNewSlotDate(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Time Slot Session</label>
                <select value={newSlotTime} onChange={(e) => setNewSlotTime(e.target.value)}>
                  <option value="04:30 PM - 05:00 PM">04:30 PM - 05:00 PM</option>
                  <option value="05:00 PM - 05:30 PM">05:00 PM - 05:30 PM</option>
                  <option value="05:30 PM - 06:00 PM">05:30 PM - 06:00 PM</option>
                  <option value="06:00 PM - 06:30 PM">06:00 PM - 06:30 PM</option>
                </select>
              </div>
              <button type="submit" className="add-btn-primary">Add Available Slot</button>
            </form>

            <div className="slots-scroller">
              <h4>Active Availability Slots</h4>
              {mySlots.length > 0 ? (
                <div className="slots-grid-pane">
                  {mySlots.map((slot, index) => (
                    <div key={index} className="slot-badge-item">
                      <span>{slot.date} | {slot.time_slot}</span>
                      <button type="button" className="slot-del-btn" onClick={() => handleDeleteSlot(slot.id)}>✖</button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-records-msg">No active availability slots registered. Please add a slot above.</p>
              )}
            </div>
          </section>

          {/* Add patient record */}
          <section className="db-section flex-1 glass-card">
            <h3>📝 New Patient Medical Intake Record</h3>
            <form onSubmit={handleAddPatientRecord} className="vertical-form">
              <div className="form-group">
                <label>Patient Full Name</label>
                <input 
                  type="text" 
                  placeholder="Enter patient name (e.g. John Doe)" 
                  value={selectedPatientName} 
                  onChange={(e) => setSelectedPatientName(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label>Diagnosis Date</label>
                  <input 
                    type="date" 
                    value={recordDate} 
                    onChange={(e) => setRecordDate(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Intake Diagnosis Notes & Treatment Prescriptions</label>
                <textarea 
                  rows="4" 
                  placeholder="Describe patient condition, clinical metrics, prescribed medications..."
                  value={diagnosisNotes} 
                  onChange={(e) => setDiagnosisNotes(e.target.value)}
                  required
                ></textarea>
              </div>
              <button type="submit" className="add-btn-primary">Add Patient Clinical Folder</button>
            </form>
          </section>
        </div>

        {/* Patient records log & Profile settings columns */}
        <div className="db-two-column">
          <section className="db-section flex-1">
            <h3>📂 Historic Clinical Archive Records</h3>
            {myPatientRecords.length > 0 ? (
              <div className="records-feed">
                {myPatientRecords.map((rec, idx) => (
                  <div key={idx} className="record-feed-card">
                    <div className="rfc-header">
                      <h5>👤 Patient: {rec.patient_name}</h5>
                      <span className="rfc-date">📅 {rec.date}</span>
                    </div>
                    <p className="rfc-notes">{rec.notes}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-records-msg">No past clinical treatment records logged in database.</p>
            )}
          </section>

          <section className="db-section flex-1 glass-card">
            <h3>⚙️ Specialist Clinical Settings Profile</h3>
            <form onSubmit={handleSaveProfile} className="vertical-form">
              <div className="form-group">
                <label>Doctor Full Name</label>
                <input type="text" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} required />
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label>Medical Specialty</label>
                  <input type="text" value={specialty} onChange={(e) => setSpecialty(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Channeling LKR Fee</label>
                  <input type="number" value={fee} onChange={(e) => setFee(e.target.value)} required />
                </div>
              </div>
              <div className="form-group">
                <label>Primary Clinic Location / Hospital</label>
                <input type="text" value={hospital} onChange={(e) => setHospital(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Clinic Mobile Phone</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <button type="submit" className="save-btn">Update Clinical Settings</button>
            </form>
          </section>
        </div>
      </div>
    );
  };

  // ==========================================
  // 3. ADMIN DASHBOARD COMPONENT
  // ==========================================
  const AdminDashboard = () => {
    // Admin Add Doctor States
    const [newDocName, setNewDocName] = useState('');
    const [newDocSpec, setNewDocSpec] = useState('Cardiologist');
    const [newDocHosp, setNewDocHosp] = useState('MediConnect Clinic, Colombo');
    const [newDocFee, setNewDocFee] = useState(2500);
    const [newDocPhone, setNewDocPhone] = useState('');
    const [uploadedImgData, setUploadedImgData] = useState('');
    const [uploadedImgName, setUploadedImgName] = useState('');

    // Search query for general bookings
    const [adminAptSearch, setAdminAptSearch] = useState('');

    // System statistical computations
    const totalDoctors = doctorsList.length;
    const totalPatients = patientsList.length;
    const totalBookings = appointmentsList.length;
    const activeConfirmedApts = appointmentsList.filter(a => a.status === 'Confirmed');
    const totalEarnings = activeConfirmedApts.reduce((sum, current) => sum + 2500, 0);

    const handleAddDoctor = async (e) => {
      e.preventDefault();
      if (!newDocName || !newDocSpec || !newDocHosp || !newDocFee) {
        alert("Please fill out all doctor profile settings fields!");
        return;
      }
      const payload = {
        name: newDocName,
        specialty: newDocSpec,
        hospital: newDocHosp,
        fee: Number(newDocFee),
        phone: newDocPhone,
        image_name: uploadedImgName || 'doctor.jpg',
        image_data: uploadedImgData || null
      };

      try {
        const res = await axios.post('http://localhost:3001/doctors', payload);
        const savedImageName = res.data.image_name || payload.image_name;
        setDoctorsList(prev => [...prev, { id: res.data.id, ...payload, image_name: savedImageName }]);
        alert("Specialist Doctor registered successfully in the system database!");
      } catch (err) {
        // Fallback
        const offlinePayload = { 
          id: Date.now(), 
          ...payload, 
          image_name: payload.image_data || payload.image_name 
        };
        syncLocalDoctors([...doctorsList, offlinePayload]);
        alert("Specialist Doctor registered (Offline Mode)!");
      }
      // Reset forms
      setNewDocName('');
      setNewDocPhone('');
      setUploadedImgData('');
      setUploadedImgName('');
    };

    const handleRemoveDoctor = async (docId) => {
      if (!window.confirm("Are you sure you want to remove this doctor from the clinic registry?")) return;
      try {
        await axios.delete(`http://localhost:3001/doctors/${docId}`);
        setDoctorsList(prev => prev.filter(d => d.id !== docId));
        alert("Doctor profile removed successfully!");
      } catch (err) {
        syncLocalDoctors(doctorsList.filter(d => d.id !== docId));
        alert("Doctor profile removed (Offline Mode)!");
      }
    };

    const handleUpdateAptStatusAdmin = async (aptId, newStatus) => {
      try {
        await axios.patch(`http://localhost:3001/appointments/${aptId}`, { status: newStatus });
        setAppointmentsList(prev => prev.map(a => a.id === aptId ? { ...a, status: newStatus } : a));
        alert(`Booking status modified to ${newStatus}!`);
      } catch (err) {
        const updated = appointmentsList.map(a => a.id === aptId ? { ...a, status: newStatus } : a);
        syncLocalAppointments(updated);
        alert(`Booking modified (Offline Mode)!`);
      }
    };

    const filteredAdminApts = appointmentsList.filter(apt => 
      apt.patient_name.toLowerCase().includes(adminAptSearch.toLowerCase()) ||
      apt.doctor_name.toLowerCase().includes(adminAptSearch.toLowerCase()) ||
      apt.specialty.toLowerCase().includes(adminAptSearch.toLowerCase())
    );

    return (
      <div className="role-dashboard">
        <header className="db-main-header">
          <div>
            <h1>MediConnect System Administrator</h1>
            <p className="welcome-sub">Global administrative console. Review clinical metrics, manage registry configurations, and oversee channeling operations.</p>
          </div>
          <span className="current-date">⚙️ Global Status: Active & Operational</span>
        </header>

        {/* Global Statistics Cards */}
        <div className="db-stats-grid">
          <div className="db-stat-card border-left-primary">
            <span className="stat-icon bg-primary-light">👨‍⚕️</span>
            <div>
              <h3>{totalDoctors} Doctors</h3>
              <p>Registered Specialists</p>
            </div>
          </div>
          <div className="db-stat-card border-left-secondary">
            <span className="stat-icon bg-secondary-light">👤</span>
            <div>
              <h3>{totalPatients} Patients</h3>
              <p>Registered Accounts</p>
            </div>
          </div>
          <div className="db-stat-card border-left-warning">
            <span className="stat-icon bg-warning-light">🎫</span>
            <div>
              <h3>{totalBookings} Tickets</h3>
              <p>Total Scheduled Appointments</p>
            </div>
          </div>
          <div className="db-stat-card border-left-success">
            <span className="stat-icon bg-success-light">💰</span>
            <div>
              <h3>LKR {totalEarnings.toLocaleString()}</h3>
              <p>Total Revenue (Paid)</p>
            </div>
          </div>
        </div>

        {/* Doctor Management Section */}
        <div className="db-two-column">
          {/* Add Doctor form */}
          <section className="db-section flex-1 glass-card">
            <h3>➕ Register New Clinic Doctor Specialist</h3>
            <form onSubmit={handleAddDoctor} className="vertical-form">
              <div className="form-group">
                <label>Doctor Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Dr. Anura Gunawardena" 
                  value={newDocName} 
                  onChange={(e) => setNewDocName(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label>Clinical Specialty</label>
                  <select value={newDocSpec} onChange={(e) => setNewDocSpec(e.target.value)}>
                    <option value="Cardiologist">Cardiologist (හෘද රෝග)</option>
                    <option value="Pediatrician">Pediatrician (ළමා රෝග)</option>
                    <option value="Dermatologist">Dermatologist (සර්ම රෝග)</option>
                    <option value="Neurologist">Neurologist (ස්නායු රෝග)</option>
                    <option value="Orthopedic">Orthopedic Specialist</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Channeling LKR Fee</label>
                  <input 
                    type="number" 
                    value={newDocFee} 
                    onChange={(e) => setNewDocFee(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Primary Hospital Location</label>
                <input 
                  type="text" 
                  value={newDocHosp} 
                  onChange={(e) => setNewDocHosp(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label>Contact Mobile</label>
                  <input 
                    type="text" 
                    placeholder="+94 XX XXX XXXX" 
                    value={newDocPhone} 
                    onChange={(e) => setNewDocPhone(e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label>Avatar Sharp Image</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setUploadedImgData(reader.result);
                          setUploadedImgName(file.name);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{ 
                      display: 'block', 
                      width: '100%', 
                      padding: '8px', 
                      borderRadius: '8px', 
                      border: '1px solid #ccc', 
                      background: 'rgba(255, 255, 255, 0.05)', 
                      color: 'inherit' 
                    }}
                  />
                  {uploadedImgData && (
                    <div className="uploaded-preview-container" style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={uploadedImgData} alt="Preview" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #0056b3' }} />
                      <span style={{ fontSize: '12px', opacity: 0.8 }}>{uploadedImgName}</span>
                    </div>
                  )}
                </div>
              </div>
              <button type="submit" className="save-btn">Complete Clinic Registration</button>
            </form>
          </section>

          {/* Doctor Registry List */}
          <section className="db-section flex-1">
            <h3>📋 Clinic Registered Doctors Registry</h3>
            <div className="doctors-mini-scroller">
              {doctorsList.map((doc, idx) => (
                <div key={idx} className="registry-doctor-card">
                  <img src={getDoctorImage(doc.image_name)} alt={doc.name} className="reg-doc-avatar" />
                  <div className="reg-doc-info">
                    <h5>{doc.name}</h5>
                    <span className="badge-spec">{doc.specialty}</span>
                    <p>🏥 {doc.hospital} | LKR {doc.fee.toLocaleString()}</p>
                  </div>
                  <button type="button" className="del-btn-inline" onClick={() => handleRemoveDoctor(doc.id)}>Remove ✖</button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Global Appointment oversight and Patient Management */}
        <section className="db-section">
          <div className="section-title-row">
            <h3>🎫 Master Channeling Appointment Log</h3>
            <input 
              type="text" 
              placeholder="Search appointments by Patient, Doctor or Specialty..." 
              value={adminAptSearch}
              onChange={(e) => setAdminAptSearch(e.target.value)}
              className="admin-search-bar"
            />
          </div>
          {filteredAdminApts.length > 0 ? (
            <div className="table-responsive">
              <table className="db-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Patient Client</th>
                    <th>Consultant Doctor</th>
                    <th>Specialty</th>
                    <th>Date & Time</th>
                    <th>Queue No</th>
                    <th>Status</th>
                    <th>Oversight Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdminApts.map((apt, idx) => (
                    <tr key={idx}>
                      <td><strong>#MC-{apt.id}</strong></td>
                      <td>
                        <strong>{apt.patient_name}</strong>
                        <div className="sub-td-desc">{apt.patient_email} | {apt.patient_phone}</div>
                      </td>
                      <td>{apt.doctor_name}</td>
                      <td><span className="badge-spec">{apt.specialty}</span></td>
                      <td>📅 {apt.date} at 🕒 {apt.time_slot}</td>
                      <td><span className="badge-q">#{apt.queue_no}</span></td>
                      <td>
                        <span className={`badge-pill ${apt.status?.toLowerCase() === 'confirmed' ? 'badge-completed' : 'badge-cancelled'}`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button className="complete-btn" onClick={() => handleUpdateAptStatusAdmin(apt.id, 'Confirmed')}>Approve</button>
                        <button className="cancel-inline-btn" onClick={() => handleUpdateAptStatusAdmin(apt.id, 'Cancelled')}>Cancel</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-records-msg">No appointments matched search parameters.</p>
          )}
        </section>

        {/* Patients oversight registry */}
        <section className="db-section">
          <h3>👥 Registered Patients Registry</h3>
          {patientsList.length > 0 ? (
            <div className="table-responsive">
              <table className="db-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Username</th>
                    <th>Email Address</th>
                    <th>System Role</th>
                    <th>Join Date Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {patientsList.map((p, idx) => (
                    <tr key={idx}>
                      <td><strong>#PAT-{p.id}</strong></td>
                      <td><strong>{p.username}</strong></td>
                      <td>{p.email}</td>
                      <td><span className="badge-spec">Patient</span></td>
                      <td>{p.created_at ? new Date(p.created_at).toLocaleDateString() : 'Active Member'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-records-msg">No registered patients in system memory.</p>
          )}
        </section>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation Panel */}
      <aside className="db-sidebar">
        <div className="sidebar-brand" onClick={() => navigate('/')}>
          🩺 MEDICONNECT
        </div>
        <div className="user-profile-badge">
          <div className="user-avatar">
            {user.username.substring(0, 2).toUpperCase()}
          </div>
          <h3>{user.username}</h3>
          <span className="user-role-label">{user.role.toUpperCase()} SESSION</span>
        </div>
        <ul className="sidebar-menu">
          <li className="active">📊 Dynamic Overview</li>
          <li onClick={() => navigate('/booking')}>📅 Doctor Directory</li>
          <li onClick={() => navigate('/')}>🏠 Homepage</li>
        </ul>
        <button type="button" className="logout-btn" onClick={handleSignOut}>
          🚪 Sign Out Session
        </button>
      </aside>

      {/* Main Panel Content Render */}
      <main className="db-main">
        {user.role === 'admin' && <AdminDashboard />}
        {user.role === 'doctor' && <DoctorDashboard />}
        {user.role === 'patient' && <PatientDashboard />}
      </main>

      {/* Premium Integrated Dashboard Stylesheet */}
      <style>{`
        .dashboard-container {
          display: flex;
          min-height: 100vh;
          background: #f4f7fa;
          font-family: 'Plus Jakarta Sans', 'Outfit', sans-serif;
          color: #1d2939;
        }

        .db-loading-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: #f8fafc;
          font-family: 'Outfit', sans-serif;
        }

        .spinner {
          font-size: 54px;
          animation: beat 1.5s infinite ease-in-out;
          margin-bottom: 20px;
        }

        @keyframes beat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }

        /* Sidebar Panels */
        .db-sidebar {
          width: 280px;
          background: #0b2240;
          color: white;
          padding: 40px 24px;
          display: flex;
          flex-direction: column;
          box-shadow: 4px 0 20px rgba(0,0,0,0.05);
        }

        .sidebar-brand {
          font-family: 'Outfit', sans-serif;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: 1px;
          margin-bottom: 40px;
          text-align: center;
          cursor: pointer;
        }

        .user-profile-badge {
          background: rgba(255,255,255,0.05);
          padding: 20px;
          border-radius: 16px;
          text-align: center;
          margin-bottom: 30px;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .user-avatar {
          width: 54px;
          height: 54px;
          background: #007bff;
          color: white;
          font-size: 18px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          margin: 0 auto 12px;
          box-shadow: 0 4px 10px rgba(0, 123, 255, 0.3);
        }

        .user-profile-badge h3 {
          font-size: 16px;
          font-weight: 700;
          margin: 0 0 4px 0;
          color: #f8fafc;
        }

        .user-role-label {
          font-size: 11px;
          letter-spacing: 1px;
          color: #2dd4bf;
          font-weight: 800;
        }

        .sidebar-menu {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .sidebar-menu li {
          padding: 14px 18px;
          font-size: 15px;
          font-weight: 700;
          color: #94a3b8;
          cursor: pointer;
          border-radius: 10px;
          transition: all 0.2s ease;
        }

        .sidebar-menu li:hover,
        .sidebar-menu li.active {
          background: rgba(255,255,255,0.08);
          color: white;
        }

        .sidebar-menu li.active {
          background: #007bff;
          color: white;
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
        }

        .logout-btn {
          margin-top: auto;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
          padding: 12px;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .logout-btn:hover {
          background: #ef4444;
          color: white;
        }

        /* Main panels styles */
        .db-main {
          flex: 1;
          padding: 40px;
          overflow-y: auto;
          box-sizing: border-box;
        }

        .role-dashboard {
          animation: fade-in-db 0.35s ease-out;
        }

        @keyframes fade-in-db {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .db-main-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .db-main-header h1 {
          font-family: 'Outfit', sans-serif;
          font-size: 32px;
          font-weight: 800;
          color: #0b2240;
          margin: 0;
        }

        .welcome-sub {
          font-size: 14px;
          color: #637381;
          margin: 4px 0 0 0;
        }

        .current-date {
          font-size: 13px;
          color: #475467;
          background: white;
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          font-weight: 700;
        }

        /* Stats Section grids */
        .db-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .db-stat-card {
          background: white;
          padding: 24px;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 20px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.01);
        }

        .border-left-primary { border-left: 5px solid #007bff; }
        .border-left-secondary { border-left: 5px solid #14b8a6; }
        .border-left-success { border-left: 5px solid #10b981; }
        .border-left-warning { border-left: 5px solid #f59e0b; }

        .stat-icon {
          font-size: 28px;
          padding: 10px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
        }

        .bg-primary-light { background: #ebf5ff; }
        .bg-secondary-light { background: #e6fcf5; }
        .bg-success-light { background: #ecfdf5; }
        .bg-warning-light { background: #fffbeb; }

        .db-stat-card h3 {
          font-size: 22px;
          font-weight: 800;
          color: #0b2240;
          margin: 0;
        }

        .db-stat-card p {
          font-size: 13px;
          color: #637381;
          margin: 2px 0 0 0;
          font-weight: 500;
        }

        /* Sections and containers */
        .db-section {
          background: white;
          border-radius: 20px;
          padding: 30px;
          border: 1px solid #e2e8f0;
          margin-bottom: 30px;
        }

        .db-section h3 {
          font-family: 'Outfit', sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: #0b2240;
          margin: 0 0 20px 0;
        }

        .section-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .section-title-row h3 {
          margin: 0;
        }

        /* Filter layouts */
        .filter-panel-row {
          display: flex;
          gap: 20px;
          margin-bottom: 25px;
          flex-wrap: wrap;
        }

        .search-input-box {
          flex: 1;
          min-width: 250px;
          padding: 12px 18px;
          border: 1.5px solid #d0d5dd;
          border-radius: 10px;
          font-size: 14px;
        }

        .filter-select {
          padding: 12px 16px;
          border: 1.5px solid #d0d5dd;
          border-radius: 10px;
          background: white;
          font-size: 14px;
          font-weight: 600;
          color: #475467;
        }

        /* Doctor search grids */
        .search-results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .mini-doctor-search-card {
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          border-radius: 16px;
          padding: 18px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.2s ease;
        }

        .mini-doctor-search-card:hover {
          transform: translateY(-2px);
          background: white;
          box-shadow: 0 6px 15px rgba(0,0,0,0.03);
          border-color: #007bff;
        }

        .search-doc-img {
          width: 74px;
          height: 74px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #ebf5ff;
        }

        .search-doc-info {
          flex: 1;
        }

        .search-doc-info h4 {
          font-size: 15px;
          font-weight: 800;
          color: #0b2240;
          margin: 0 0 3px 0;
        }

        .badge-spec {
          background: #ebf5ff;
          color: #007bff;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
          display: inline-block;
          margin-bottom: 4px;
        }

        .search-doc-hosp {
          font-size: 11px;
          color: #637381;
          margin: 0 0 2px 0;
        }

        .search-doc-fee {
          font-size: 12px;
          font-weight: 700;
          color: #10b981;
          margin: 0;
        }

        .book-inline-btn {
          background: #007bff;
          color: white;
          border: none;
          padding: 8px 14px;
          font-size: 12px;
          font-weight: 700;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .book-inline-btn:hover {
          background: #0056b3;
        }

        /* Two column layout */
        .db-two-column {
          display: flex;
          gap: 30px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }

        .flex-1 {
          flex: 1;
          min-width: 320px;
        }

        /* List Items */
        .simple-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .simple-list-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #f1f5f9;
        }

        .simple-list-item h4 {
          font-size: 14px;
          font-weight: 700;
          color: #0b2240;
          margin: 0 0 2px 0;
        }

        .simple-list-item p {
          font-size: 12px;
          color: #637381;
          margin: 0;
        }

        .badge-pill {
          font-size: 11px;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 50px;
        }

        .badge-completed { background: #ecfdf5; color: #10b981; }
        .badge-cancelled { background: #fef2f2; color: #ef4444; }

        /* Quick book section */
        .quick-book-flex {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .quick-book-card {
          display: flex;
          align-items: center;
          gap: 14px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 12px 18px;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .quick-book-card:hover {
          background: white;
          border-color: #007bff;
          transform: translateY(-1.5px);
          box-shadow: 0 4px 10px rgba(0, 123, 255, 0.05);
        }

        .qb-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #ebf5ff;
        }

        .quick-book-card h5 {
          font-size: 13px;
          font-weight: 800;
          color: #0b2240;
          margin: 0 0 2px 0;
        }

        .quick-book-card p {
          font-size: 11px;
          color: #637381;
          margin: 0;
        }

        .qb-arrow {
          margin-left: auto;
          color: #007bff;
          font-size: 14px;
        }

        /* Tables */
        .table-responsive {
          overflow-x: auto;
        }

        .db-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .db-table th {
          background: #f8fafc;
          padding: 14px;
          font-size: 13px;
          font-weight: 700;
          color: #637381;
          border-bottom: 1.5px solid #e2e8f0;
        }

        .db-table td {
          padding: 16px 14px;
          font-size: 14px;
          border-bottom: 1px solid #f1f5f9;
        }

        .sub-td-desc {
          font-size: 11px;
          color: #637381;
          margin-top: 2px;
        }

        .badge-q {
          background: #ebf5ff;
          color: #007bff;
          padding: 3px 8px;
          border-radius: 6px;
          font-weight: 800;
          font-size: 12px;
        }

        .badge-status-confirmed {
          background: #ecfdf5;
          color: #10b981;
          padding: 4px 10px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 12px;
        }

        .cancel-icon-btn {
          background: none;
          border: none;
          color: #ef4444;
          font-weight: 700;
          font-size: 12px;
          cursor: pointer;
        }

        .cancel-icon-btn:hover {
          text-decoration: underline;
        }

        /* Forms Layout */
        .inline-add-form {
          display: flex;
          gap: 15px;
          align-items: flex-end;
          margin-bottom: 25px;
          flex-wrap: wrap;
        }

        .vertical-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          text-align: left;
          flex: 1;
        }

        .form-group label {
          font-size: 12px;
          font-weight: 700;
          color: #344054;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 11px 14px;
          border: 1.5px solid #d0d5dd;
          border-radius: 8px;
          font-size: 14px;
          width: 100%;
          background: white;
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .add-btn-primary {
          background: #007bff;
          color: white;
          border: none;
          padding: 12px 20px;
          font-weight: 700;
          font-size: 13px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          align-self: flex-end;
        }

        .add-btn-primary:hover {
          background: #0056b3;
        }

        .save-btn {
          background: #0b2240;
          color: white;
          border: none;
          padding: 13px;
          font-weight: 700;
          font-size: 14px;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 10px;
        }

        .save-btn:hover {
          background: #1d2939;
        }

        /* Slots Grid Manager */
        .slots-scroller {
          border-top: 1px solid #f1f5f9;
          padding-top: 20px;
        }

        .slots-scroller h4 {
          font-size: 14px;
          font-weight: 800;
          margin-bottom: 12px;
          color: #0b2240;
        }

        .slots-grid-pane {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .slot-badge-item {
          background: #ebf5ff;
          color: #007bff;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 700;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .slot-del-btn {
          background: none;
          border: none;
          color: #ef4444;
          font-weight: 800;
          font-size: 11px;
          cursor: pointer;
        }

        /* Patient medical records feed */
        .records-feed {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .record-feed-card {
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          padding: 20px;
          border-radius: 16px;
        }

        .rfc-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }

        .rfc-header h5 {
          font-size: 14px;
          font-weight: 800;
          color: #0b2240;
          margin: 0;
        }

        .rfc-date {
          font-size: 11px;
          color: #637381;
          font-weight: 700;
        }

        .rfc-notes {
          font-size: 13px;
          color: #475467;
          margin: 0;
          text-align: left;
          line-height: 1.6;
        }

        /* Actions cell and buttons */
        .actions-cell {
          display: flex;
          gap: 8px;
        }

        .complete-btn {
          background: #ecfdf5;
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.2);
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 700;
          border-radius: 6px;
          cursor: pointer;
        }

        .complete-btn:hover {
          background: #10b981;
          color: white;
        }

        .cancel-inline-btn {
          background: #fef2f2;
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 700;
          border-radius: 6px;
          cursor: pointer;
        }

        .cancel-inline-btn:hover {
          background: #ef4444;
          color: white;
        }

        /* Admin specialist additions */
        .doctors-mini-scroller {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 480px;
          overflow-y: auto;
          padding-right: 5px;
        }

        .registry-doctor-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 14px 18px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .reg-doc-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
        }

        .reg-doc-info {
          flex: 1;
          text-align: left;
        }

        .reg-doc-info h5 {
          font-size: 13px;
          font-weight: 800;
          margin: 0 0 2px 0;
          color: #0b2240;
        }

        .reg-doc-info p {
          font-size: 11px;
          color: #637381;
          margin: 0;
        }

        .del-btn-inline {
          background: none;
          border: none;
          color: #ef4444;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
        }

        .del-btn-inline:hover {
          text-decoration: underline;
        }

        .admin-search-bar {
          padding: 10px 16px;
          border: 1.5px solid #d0d5dd;
          border-radius: 8px;
          font-size: 13px;
          width: 300px;
        }

        .empty-panel {
          text-align: center;
          padding: 50px 20px;
        }

        .empty-emoji {
          font-size: 48px;
          display: block;
          margin-bottom: 12px;
        }

        .no-records-msg {
          font-size: 13px;
          color: #637381;
          margin: 10px 0;
          font-style: italic;
        }

        @media (max-width: 1024px) {
          .dashboard-container {
            flex-direction: column;
          }
          .db-sidebar {
            width: 100%;
            padding: 24px;
          }
          .sidebar-brand {
            margin-bottom: 20px;
          }
          .user-profile-badge {
            margin-bottom: 20px;
          }
          .sidebar-menu {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
          }
          .logout-btn {
            margin-top: 20px;
          }
          .db-main {
            padding: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;
