import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Assets portraits
import AnushaImg from '../assets/Anusha.jpg'; 
import SamanImg from '../assets/Saman.jpg';
import SavanImg from '../assets/Savan.jpg';
import RuwanImg from '../assets/Ruwan.jpg';
import NirmaliImg from '../assets/Nirmali.jpg';
import PriyanthaImg from '../assets/Priyantha.jpg';
import DilhaniImg from '../assets/Dilhani.jpg';
import doctorPlaceholder from '../assets/doctor.jpg';

const DoctorsList = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get('http://localhost:3001/doctors');
        if (res.data && res.data.data) {
          setDoctors(res.data.data);
        }
      } catch (err) {
        // Offline / empty DB fallback
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
          setDoctors(JSON.parse(cached));
        } else {
          localStorage.setItem('mc_doctors', JSON.stringify(defaultDocs));
          setDoctors(defaultDocs);
        }
      }
    };

    fetchDoctors();
  }, []);

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

  const handleBookAppointment = (doc) => {
    navigate('/booking', { 
      state: { 
        name: doc.name, 
        specialty: doc.specialty, 
        image_name: doc.image_name,
        fee: doc.fee,
        hospital: doc.hospital
      } 
    });
  };

  return (
    <div className="doctors-list">
      {doctors.map((doc, index) => (
        <div key={index} className="doctor-card animate-scale-up">
          <img src={getDoctorImage(doc.image_name)} alt={doc.name} className="doctor-img" />
          <h3>{doc.name}</h3>
          <p className="home-doc-spec-badge">{doc.specialty}</p>
          <div className="home-doc-meta">
            <span>🏥 {doc.hospital.split(',')[1]?.trim() || doc.hospital}</span>
            <span className="home-doc-fee">💵 LKR {doc.fee.toLocaleString()}</span>
          </div>
          <button 
            type="button" 
            className="book-btn" 
            onClick={() => handleBookAppointment(doc)}
          >
            Book Appointment
          </button>
        </div>
      ))}
    </div>
  );
};

export default DoctorsList;