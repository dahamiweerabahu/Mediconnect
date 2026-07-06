import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Please enter both username and password!");
      return;
    }

    setLoading(true);

    if (isSignUp) {
      if (!email) {
        alert("Please enter your email address!");
        setLoading(false);
        return;
      }
      // Sign Up Request
      axios.post('http://localhost:3001/signup', { username, email, password, role })
        .then(res => {
          setLoading(false);
          alert(res.data.message || "Registration Successful!");
          setIsSignUp(false); // Switch to login after successful sign up
        })
        .catch(err => {
          setLoading(false);
          if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
            console.log("Using offline simulated registration fallback...");
            let offlineUsers = [];
            try {
              const stored = localStorage.getItem('mc_users');
              if (stored) offlineUsers = JSON.parse(stored);
            } catch (e) {
              console.error(e);
            }
            
            const userExists = offlineUsers.some(u => u.username.toLowerCase() === username.toLowerCase()) ||
                               ["admin", "anusha", "saman", "savan", "ruwan", "nirmali", "priyantha", "dilhani"].includes(username.toLowerCase());
            
            if (userExists) {
              alert("Username already exists!");
              return;
            }
            
            const newUser = {
              id: Date.now(),
              username,
              email,
              password,
              role
            };
            offlineUsers.push(newUser);
            localStorage.setItem('mc_users', JSON.stringify(offlineUsers));
            alert("[Offline Demo Session] Registration Successful!");
            setIsSignUp(false);
          } else {
            alert(err.response?.data?.message || "Sign Up Failed! Try again.");
          }
        });
    } else {
      // Login Request
      axios.post('http://localhost:3001/login', { username, password })
        .then(res => {
          setLoading(false);
          if (res.data.status === "success") {
            localStorage.setItem('user', JSON.stringify(res.data.user));
            alert(`Login Successful! Logged in as ${res.data.user.role}.`);
            navigate('/dashboard'); 
          } else {
            alert(res.data.message || "Login failed!");
          }
        })
        .catch(err => {
          setLoading(false);
          if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
            console.log("Using offline simulated session fallback...");
            let simulatedUser = null;
            
            let offlineUsers = [];
            try {
              const stored = localStorage.getItem('mc_users');
              if (stored) offlineUsers = JSON.parse(stored);
            } catch (e) {
              console.error(e);
            }
            
            const matchedUser = offlineUsers.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
            
            if (matchedUser) {
              simulatedUser = {
                id: matchedUser.id,
                username: matchedUser.username,
                email: matchedUser.email,
                role: matchedUser.role,
                name: matchedUser.role === 'doctor' ? `Dr. ${matchedUser.username.charAt(0).toUpperCase() + matchedUser.username.slice(1)}` : undefined
              };
            } else if (username === "admin" && password === "admin") {
              simulatedUser = { id: 999, username: "admin", email: "admin@mediconnect.lk", role: "admin" };
            } else if (["anusha", "saman", "savan", "ruwan", "nirmali", "priyantha", "dilhani"].includes(username.toLowerCase()) && password === "doctor123") {
              const docNames = {
                anusha: "Dr. Anusha Perera",
                saman: "Dr. Saman Wijesinghe",
                savan: "Dr. Savan Wijesinghe",
                ruwan: "Dr. Ruwan Jayawardena",
                nirmali: "Dr. Nirmali Silva",
                priyantha: "Dr. Priyantha Gunawardena",
                dilhani: "Dr. Dilhani Bandara"
              };
              const docName = docNames[username.toLowerCase()];
              simulatedUser = { id: 888, username: username, email: `${username}@mediconnect.lk`, role: "doctor", name: docName };
            }
            
            if (simulatedUser) {
              localStorage.setItem('user', JSON.stringify(simulatedUser));
              alert(`[Offline Demo Session] Successful! Logged in as ${simulatedUser.role}.`);
              navigate('/dashboard');
            } else {
              alert("Invalid username or password! (Offline Mode)");
            }
          } else if (err.response && err.response.status === 401) {
            alert("Invalid username or password!");
          } else {
            alert("Login Failed! Please try again.");
          }
        });
    }
  };

  return (
    <div className="login-page">
      <div className="login-card-container">
        <div className="brand-header">
          <div className="brand-logo">🩺</div>
          <h1>MediConnect</h1>
          <p>Smart Doctor Channeling & Clinic Panel</p>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div className="auth-tabs">
          <button 
            type="button" 
            className={`tab-btn ${!isSignUp ? 'active' : ''}`} 
            onClick={() => setIsSignUp(false)}
          >
            Login
          </button>
          <button 
            type="button" 
            className={`tab-btn ${isSignUp ? 'active' : ''}`} 
            onClick={() => setIsSignUp(true)}
          >
            Sign Up
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input 
              id="username"
              type="text" 
              placeholder="Enter your username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>

          {isSignUp && (
            <div className="input-group animate-fade-in">
              <label htmlFor="email">Email Address</label>
              <input 
                id="email"
                type="email" 
                placeholder="Enter your email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
          )}

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              placeholder="Enter your password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          {isSignUp && (
            <div className="input-group animate-fade-in">
              <label htmlFor="role">Account Role</label>
              <select 
                id="role"
                value={role} 
                className="role-select"
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="patient">Patient / Channeler</option>
                <option value="doctor">Doctor Specialist</option>
                <option value="admin">Clinic Administrator</option>
              </select>
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Login')}
          </button>
        </form>

        <div className="auth-footer">
          {isSignUp ? (
            <p>Already have an account? <span className="toggle-link" onClick={() => setIsSignUp(false)}>Login here</span></p>
          ) : (
            <p>Don't have an account? <span className="toggle-link" onClick={() => setIsSignUp(true)}>Sign Up now</span></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;