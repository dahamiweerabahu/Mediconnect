require('dotenv').config(); // මේ පේළිය අනිවාර්යයෙන්ම මුලට දාන්න
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Serve uploads statically
app.use('/uploads', express.static(uploadsDir));

// DB Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Test connection and auto seed tables
db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err.message);
        console.log("Please run server/schema.sql in your MySQL database to complete setup.");
        return;
    }
    console.log("Connected to MySQL database!");
    
    // Seed initial users
    const seedUsers = () => {
        db.query("SELECT COUNT(*) as count FROM users", (err, result) => {
            if (err) return;
            if (result[0].count === 0) {
                const sql = "INSERT INTO users (username, email, password, role) VALUES ?";
                const values = [
                    ['admin', 'admin@mediconnect.lk', 'admin', 'admin'],
                    ['anusha', 'anusha@mediconnect.lk', 'doctor123', 'doctor'],
                    ['saman', 'saman@mediconnect.lk', 'doctor123', 'doctor'],
                    ['savan', 'savan@mediconnect.lk', 'doctor123', 'doctor'],
                    ['ruwan', 'ruwan@mediconnect.lk', 'doctor123', 'doctor'],
                    ['nirmali', 'nirmali@mediconnect.lk', 'doctor123', 'doctor'],
                    ['priyantha', 'priyantha@mediconnect.lk', 'doctor123', 'doctor'],
                    ['dilhani', 'dilhani@mediconnect.lk', 'doctor123', 'doctor']
                ];
                db.query(sql, [values], (err) => {
                    if (err) console.error("Error seeding users:", err.message);
                    else {
                        console.log("Successfully seeded default users (admin / admin, doctor123 for specialists)!");
                        seedDoctors(); 
                    }
                });
            } else {
                seedDoctors();
            }
        });
    };

    const seedDoctors = () => {
        db.query("SELECT COUNT(*) as count FROM doctors", (err, result) => {
            if (err) return;
            if (result[0].count === 0) {
                db.query("SELECT id, username FROM users WHERE role='doctor'", (err, usersList) => {
                    if (err) return;
                    const findId = (uname) => {
                        const u = usersList.find(x => x.username === uname);
                        return u ? u.id : null;
                    };
                    const sql = "INSERT INTO doctors (name, specialty, hospital, fee, phone, image_name, user_id) VALUES ?";
                    const values = [
                        ['Dr. Anusha Perera', 'Cardiologist', 'MediConnect Clinic, Colombo', 2500, '+94771234567', 'Anusha.jpg', findId('anusha')],
                        ['Dr. Saman Wijesinghe', 'Pediatrician', 'MediConnect Clinic, Kandy', 2000, '+94777654321', 'Saman.jpg', findId('saman')],
                        ['Dr. Savan Wijesinghe', 'Pediatrician', 'MediConnect Clinic, Galle', 2200, '+94779998888', 'Savan.jpg', findId('savan')],
                        ['Dr. Ruwan Jayawardena', 'Neurologist', 'MediConnect Clinic, Colombo', 3000, '+94772345678', 'Ruwan.jpg', findId('ruwan')],
                        ['Dr. Nirmali Silva', 'Dermatologist', 'MediConnect Clinic, Colombo', 2500, '+94773456789', 'Nirmali.jpg', findId('nirmali')],
                        ['Dr. Priyantha Gunawardena', 'Orthopedic Surgeon', 'MediConnect Clinic, Kandy', 2800, '+94774567890', 'Priyantha.jpg', findId('priyantha')],
                        ['Dr. Dilhani Bandara', 'Gynecologist', 'MediConnect Clinic, Galle', 2700, '+94775678901', 'Dilhani.jpg', findId('dilhani')]
                    ];
                    db.query(sql, [values], (err) => {
                        if (err) console.error("Error seeding doctors:", err.message);
                        else console.log("Successfully seeded default doctors list!");
                    });
                });
            }
        });
    };

    seedUsers();
});

// Signup API එක
app.post('/signup', (req, res) => {
    const { username, email, password, role } = req.body;
    
    if (!username || !email || !password || !role) {
        return res.status(400).json({ status: "error", message: "All fields are required!" });
    }
    
    const sql = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";
    
    db.query(sql, [username, email, password, role], (err, result) => {
        if (err) return res.status(500).json({ status: "error", message: err.message });
        res.status(200).json({ status: "success", message: "User registered successfully!" });
    });
});

// Login API එක (Returns role & details)
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ status: "error", message: "Username and password required!" });
    }

    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    
    db.query(sql, [username, password], (err, result) => {
        if (err) return res.status(500).json({ status: "error" });
        
        if (result.length > 0) {
            res.status(200).json({ 
                status: "success", 
                message: "Login Successful!",
                user: {
                    id: result[0].id,
                    username: result[0].username,
                    email: result[0].email,
                    role: result[0].role
                }
            });
        } else {
            res.status(401).json({ status: "fail", message: "Invalid username or password!" });
        }
    });
});

// --- DOCTORS ENDPOINTS ---
app.get('/doctors', (req, res) => {
    db.query("SELECT * FROM doctors", (err, results) => {
        if (err) return res.status(500).json({ status: "error", message: err.message });
        res.status(200).json({ status: "success", data: results });
    });
});

app.post('/doctors', (req, res) => {
    const { name, specialty, hospital, fee, phone, image_name, image_data } = req.body;
    
    let finalImageName = image_name || 'doctor.jpg';
    if (image_data && image_data.startsWith('data:image/')) {
        try {
            const matches = image_data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
                const ext = matches[1].split('/')[1] || 'jpg';
                const base64Data = matches[2];
                const filename = `doctor_${Date.now()}.${ext}`;
                const filePath = path.join(__dirname, 'uploads', filename);
                
                fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
                finalImageName = filename;
            }
        } catch (uploadErr) {
            console.error("Error saving uploaded image:", uploadErr.message);
        }
    }

    const sql = "INSERT INTO doctors (name, specialty, hospital, fee, phone, image_name) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [name, specialty, hospital, fee || 2500, phone || '', finalImageName], (err, result) => {
        if (err) return res.status(500).json({ status: "error", message: err.message });
        res.status(200).json({ 
            status: "success", 
            message: "Doctor added successfully!", 
            id: result.insertId,
            image_name: finalImageName
        });
    });
});

app.delete('/doctors/:id', (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM doctors WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ status: "error", message: err.message });
        res.status(200).json({ status: "success", message: "Doctor removed successfully!" });
    });
});

// --- APPOINTMENTS ENDPOINTS ---
app.get('/appointments', (req, res) => {
    const { patient_name, doctor_name } = req.query;
    let sql = "SELECT id, patient_name, patient_email, patient_phone, doctor_name, specialty, DATE_FORMAT(date, '%Y-%m-%d') AS date, time_slot, status, queue_no FROM appointments";
    let params = [];
    if (patient_name) {
        sql += " WHERE patient_name = ?";
        params.push(patient_name);
    } else if (doctor_name) {
        sql += " WHERE doctor_name = ?";
        params.push(doctor_name);
    }
    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ status: "error", message: err.message });
        res.status(200).json({ status: "success", data: results });
    });
});

app.post('/appointments', (req, res) => {
    const { patient_name, patient_email, patient_phone, doctor_name, specialty, date, time_slot, queue_no } = req.body;
    const qNo = queue_no || Math.floor(Math.random() * 18) + 3;
    const sql = "INSERT INTO appointments (patient_name, patient_email, patient_phone, doctor_name, specialty, date, time_slot, status, queue_no) VALUES (?, ?, ?, ?, ?, ?, ?, 'Confirmed', ?)";
    db.query(sql, [patient_name, patient_email, patient_phone, doctor_name, specialty, date, time_slot, qNo], (err, result) => {
        if (err) return res.status(500).json({ status: "error", message: err.message });
        res.status(200).json({ status: "success", message: "Appointment booked successfully!", id: result.insertId, queue_no: qNo });
    });
});

app.patch('/appointments/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.query("UPDATE appointments SET status = ? WHERE id = ?", [status, id], (err, result) => {
        if (err) return res.status(500).json({ status: "error", message: err.message });
        res.status(200).json({ status: "success", message: "Appointment status updated successfully!" });
    });
});

// --- AVAILABILITIES ENDPOINTS ---
app.get('/availabilities', (req, res) => {
    const { doctor_name } = req.query;
    let sql = "SELECT id, doctor_name, DATE_FORMAT(date, '%Y-%m-%d') AS date, time_slot FROM availabilities";
    let params = [];
    if (doctor_name) {
        sql += " WHERE doctor_name = ?";
        params.push(doctor_name);
    }
    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ status: "error", message: err.message });
        res.status(200).json({ status: "success", data: results });
    });
});

app.post('/availabilities', (req, res) => {
    const { doctor_name, date, time_slot } = req.body;
    const sql = "INSERT INTO availabilities (doctor_name, date, time_slot) VALUES (?, ?, ?)";
    db.query(sql, [doctor_name, date, time_slot], (err, result) => {
        if (err) return res.status(500).json({ status: "error", message: err.message });
        res.status(200).json({ status: "success", message: "Availability slot added!", id: result.insertId });
    });
});

app.delete('/availabilities/:id', (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM availabilities WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ status: "error", message: err.message });
        res.status(200).json({ status: "success", message: "Slot deleted successfully!" });
    });
});

// --- PATIENT RECORDS ENDPOINTS ---
app.get('/patient-records', (req, res) => {
    const { doctor_name } = req.query;
    let sql = "SELECT id, patient_name, doctor_name, DATE_FORMAT(date, '%Y-%m-%d') AS date, notes FROM patient_records";
    let params = [];
    if (doctor_name) {
        sql += " WHERE doctor_name = ?";
        params.push(doctor_name);
    }
    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ status: "error", message: err.message });
        res.status(200).json({ status: "success", data: results });
    });
});

app.post('/patient-records', (req, res) => {
    const { patient_name, doctor_name, date, notes } = req.body;
    const sql = "INSERT INTO patient_records (patient_name, doctor_name, date, notes) VALUES (?, ?, ?, ?)";
    db.query(sql, [patient_name, doctor_name, date, notes], (err, result) => {
        if (err) return res.status(500).json({ status: "error", message: err.message });
        res.status(200).json({ status: "success", message: "Patient record added successfully!", id: result.insertId });
    });
});

// --- PATIENTS (USERS) LIST FOR ADMIN ---
app.get('/patients', (req, res) => {
    db.query("SELECT id, username, email, role, created_at FROM users WHERE role='patient'", (err, results) => {
        if (err) return res.status(500).json({ status: "error", message: err.message });
        res.status(200).json({ status: "success", data: results });
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});