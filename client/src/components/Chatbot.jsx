import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I am MediBot AI, your personal healthcare assistant. How can I help you today?",
      sender: 'bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const chatEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const quickQuestions = [
    { label: "❤️ Chest / Heart pain", text: "I am having chest pain and light pressure." },
    { label: "👶 Child fever", text: "My kid has a fever and coughing." },
    { label: "🧴 Skin rashes", text: "I have a red skin rash on my arm." },
    { label: "🧠 Headache / Migraine", text: "I have a severe headache and migraine." },
    { label: "🏥 How to book?", text: "How do I book a doctor appointment?" }
  ];

  const handleSend = (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      text: text,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const responseText = getBotResponse(text);
      const botMsg = {
        id: Date.now() + 1,
        text: responseText,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 850);
  };

  const getBotResponse = (input) => {
    const cleanInput = input.toLowerCase();

    // Heart / Cardio
    if (cleanInput.includes('heart') || cleanInput.includes('chest') || cleanInput.includes('cardio') || cleanInput.includes('pressure') || cleanInput.includes('cardiologist')) {
      return "It sounds like you may need to consult a Cardiologist. I highly recommend Dr. Anusha Perera who is practicing at MediConnect Clinic, Colombo (Fee: LKR 2,500). Would you like me to take you to the booking portal?";
    }

    // Child / Pediatric
    if (cleanInput.includes('child') || cleanInput.includes('baby') || cleanInput.includes('kid') || cleanInput.includes('pediatric') || cleanInput.includes('fever') || cleanInput.includes('pediatrician')) {
      return "For child healthcare and pediatrician inquiries, we have Dr. Saman Wijesinghe in Kandy (Fee: LKR 2,000) and Dr. Savan Wijesinghe in Galle (Fee: LKR 2,200). Both are excellent Pediatricians. Would you like to book one?";
    }

    // Skin / Dermatologist
    if (cleanInput.includes('skin') || cleanInput.includes('rash') || cleanInput.includes('acne') || cleanInput.includes('hair') || cleanInput.includes('dermatology') || cleanInput.includes('dermatologist')) {
      return "For skin conditions, acne, or hair issues, we recommend Dr. Nirmali Silva, our Specialist Dermatologist based in Colombo (Fee: LKR 2,500). Let me know if you wish to set up a booking.";
    }

    // Neurology
    if (cleanInput.includes('brain') || cleanInput.includes('nerve') || cleanInput.includes('headache') || cleanInput.includes('migraine') || cleanInput.includes('neurologist') || cleanInput.includes('neurology')) {
      return "For severe headaches, migraines, or nerve-related issues, please consult our Consultant Neurologist, Dr. Ruwan Jayawardena, practicing in Colombo (Fee: LKR 3,000).";
    }

    // Orthopedic
    if (cleanInput.includes('bone') || cleanInput.includes('fracture') || cleanInput.includes('joint') || cleanInput.includes('back pain') || cleanInput.includes('ortho') || cleanInput.includes('orthopedic')) {
      return "For back pain, joint issues, or fractures, I recommend Dr. Priyantha Gunawardena, our Consultant Orthopedic Surgeon at MediConnect Clinic, Kandy (Fee: LKR 2,800).";
    }

    // Gynecology
    if (cleanInput.includes('pregnancy') || cleanInput.includes('women') || cleanInput.includes('pregnant') || cleanInput.includes('gynecology') || cleanInput.includes('gynecologist')) {
      return "For pregnancy, maternal care, and women's health, we recommend Dr. Dilhani Bandara, our Consultant Gynecologist based in Galle (Fee: LKR 2,700).";
    }

    // Booking
    if (cleanInput.includes('book') || cleanInput.includes('channel') || cleanInput.includes('appointment') || cleanInput.includes('ticket')) {
      return "Booking is simple! You can click the 'Channel Now' button on the homepage, filter by specialty or search for your doctor, fill in patient details, and confirm to get a live queue number.";
    }

    // Services
    if (cleanInput.includes('services') || cleanInput.includes('features') || cleanInput.includes('queue') || cleanInput.includes('lab') || cleanInput.includes('prescription')) {
      return "We offer high-end digital services including E-Channeling, Live Queue Tracking, E-Prescriptions lookup, and Laboratory Report downloads. You can view all interactive simulators on our Services Page!";
    }

    // Greeting
    if (cleanInput.includes('hello') || cleanInput.includes('hi') || cleanInput.includes('hey') || cleanInput.includes('good morning')) {
      return "Hello! How can I help you today? You can ask about symptoms (like chest pain, headaches, skin rashes) or how to book appointments.";
    }

    return "Thank you for sharing your symptoms. Based on my analysis, you can search for a specialist in our Directory. Type 'book' to get guidance, or search for terms like 'heart', 'skin', 'child' or 'headache' for custom doctor recommendations.";
  };

  return (
    <div className="chatbot-wrapper">
      {/* Floating Button */}
      <button 
        type="button" 
        className={`chatbot-float-btn ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with MediBot AI"
      >
        {isOpen ? '❌' : '🤖'}
        {!isOpen && <span className="chatbot-notification-dot"></span>}
      </button>

      {/* Chat Window Box */}
      {isOpen && (
        <div className="chatbot-window glass-card animate-scale-up">
          <div className="chatbot-header">
            <span className="bot-avatar-icon">🤖</span>
            <div>
              <h4>MediBot AI</h4>
              <span className="bot-status-tag"><span className="status-dot"></span> Online Assistant</span>
            </div>
          </div>

          {/* Messages Container */}
          <div className="chatbot-body">
            <div className="messages-list">
              {messages.map((msg) => (
                <div key={msg.id} className={`chat-bubble-container ${msg.sender}`}>
                  <div className="chat-bubble">
                    <p>{msg.text}</p>
                    <span className="bubble-time">{msg.time}</span>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="chat-bubble-container bot">
                  <div className="chat-bubble typing">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Questions Chips */}
            {messages.length === 1 && (
              <div className="quick-chips-container">
                <p>Common symptom queries:</p>
                <div className="chips-grid">
                  {quickQuestions.map((q, idx) => (
                    <button 
                      key={idx} 
                      type="button" 
                      className="quick-chip" 
                      onClick={() => handleSend(q.text)}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form input footer */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(inputVal); }} 
            className="chatbot-input-form"
          >
            <input 
              type="text" 
              placeholder="Ask symptoms or booking help..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="chatbot-input-field"
              required
            />
            <button type="submit" className="chatbot-send-btn">
              ➡️
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
