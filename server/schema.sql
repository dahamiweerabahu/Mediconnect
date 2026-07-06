-- Create Database
CREATE DATABASE IF NOT EXISTS mediconnect_db;
USE mediconnect_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'patient'
);

-- 2. Doctors Table
CREATE TABLE IF NOT EXISTS doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialty VARCHAR(255) NOT NULL,
    hospital VARCHAR(255) NOT NULL,
    fee DECIMAL(10, 2) NOT NULL DEFAULT 2000.00,
    phone VARCHAR(50) DEFAULT '',
    image_name VARCHAR(255) DEFAULT 'doctor.jpg',
    user_id INT NULL
);

-- 3. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(255) NOT NULL,
    patient_email VARCHAR(255) NOT NULL,
    patient_phone VARCHAR(50) NOT NULL,
    doctor_name VARCHAR(255) NOT NULL,
    specialty VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time_slot VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Confirmed',
    queue_no INT NOT NULL
);

-- 4. Availabilities Table
CREATE TABLE IF NOT EXISTS availabilities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time_slot VARCHAR(100) NOT NULL
);

-- 5. Patient Records Table
CREATE TABLE IF NOT EXISTS patient_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(255) NOT NULL,
    doctor_name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    notes TEXT NOT NULL
);

-- 6. Insert Default Users (Seeding)
INSERT INTO users (id, username, email, password, role) VALUES
(1, 'admin', 'admin@mediconnect.lk', 'admin', 'admin'),
(2, 'anusha', 'anusha@mediconnect.lk', 'doctor123', 'doctor'),
(3, 'saman', 'saman@mediconnect.lk', 'doctor123', 'doctor'),
(4, 'savan', 'savan@mediconnect.lk', 'doctor123', 'doctor'),
(5, 'ruwan', 'ruwan@mediconnect.lk', 'doctor123', 'doctor'),
(6, 'nirmali', 'nirmali@mediconnect.lk', 'doctor123', 'doctor'),
(7, 'priyantha', 'priyantha@mediconnect.lk', 'doctor123', 'doctor'),
(8, 'dilhani', 'dilhani@mediconnect.lk', 'doctor123', 'doctor')
ON DUPLICATE KEY UPDATE username=username;

-- 7. Insert Default Doctors (Seeding)
INSERT INTO doctors (id, name, specialty, hospital, fee, phone, image_name, user_id) VALUES
(1, 'Dr. Anusha Perera', 'Cardiologist', 'MediConnect Clinic, Colombo', 2500.00, '+94771234567', 'Anusha.jpg', 2),
(2, 'Dr. Saman Wijesinghe', 'Pediatrician', 'MediConnect Clinic, Kandy', 2000.00, '+94777654321', 'Saman.jpg', 3),
(3, 'Dr. Savan Wijesinghe', 'Pediatrician', 'MediConnect Clinic, Galle', 2200.00, '+94779998888', 'Savan.jpg', 4),
(4, 'Dr. Ruwan Jayawardena', 'Neurologist', 'MediConnect Clinic, Colombo', 3000.00, '+94772345678', 'Ruwan.jpg', 5),
(5, 'Dr. Nirmali Silva', 'Dermatologist', 'MediConnect Clinic, Colombo', 2500.00, '+94773456789', 'Nirmali.jpg', 6),
(6, 'Dr. Priyantha Gunawardena', 'Orthopedic Surgeon', 'MediConnect Clinic, Kandy', 2800.00, '+94774567890', 'Priyantha.jpg', 7),
(7, 'Dr. Dilhani Bandara', 'Gynecologist', 'MediConnect Clinic, Galle', 2700.00, '+94775678901', 'Dilhani.jpg', 8)
ON DUPLICATE KEY UPDATE name=name;
