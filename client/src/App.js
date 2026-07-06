import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import BookingPage from './BookingPage';
import DashboardPage from './DashboardPage';
import ServicesPage from './ServicesPage';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/services" element={<ServicesPage />} />
      </Routes>
      <Chatbot />
    </Router>
  );
}

export default App;