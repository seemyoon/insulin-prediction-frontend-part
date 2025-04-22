import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';

interface DoctorRegistration {
  fullName: string;
  specialization: string;
  licenseNumber: string;
  documents: File[];
}

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [registrationData, setRegistrationData] = useState<DoctorRegistration>({
    fullName: '',
    specialization: '',
    licenseNumber: '',
    documents: []
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setRegistrationData(prev => ({
        ...prev,
        documents: Array.from(e.target.files!)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to register/login
    // For now, we'll just navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="landing-container">
      <div className="landing-header">
        <div className="logo">
          <h1>Insulin Dose Calculator</h1>
        </div>
        <button className="auth-toggle-btn" onClick={() => setShowAuth(!showAuth)}>
          {showAuth ? 'Close' : 'Login / Register'}
        </button>
      </div>

      <div className="landing-content">
        <div className="landing-description">
          <h2>Welcome to Insulin Dose Calculator</h2>
          <p>
            Our advanced platform helps medical professionals make precise insulin dosage
            recommendations based on comprehensive patient data and current medical guidelines.
          </p>
          <div className="features">
            <h3>Key Features:</h3>
            <ul>
              <li>Accurate BMI and insulin dose calculations</li>
              <li>Patient history tracking</li>
              <li>Comprehensive diabetes type assessment</li>
              <li>Support for various insulin types and medications</li>
              <li>Secure patient data management</li>
            </ul>
          </div>
        </div>

        {showAuth && (
          <div className="auth-container">
            <div className="auth-toggle">
              <button 
                className={isLogin ? 'active' : ''} 
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
              <button 
                className={!isLogin ? 'active' : ''} 
                onClick={() => setIsLogin(false)}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {isLogin ? (
                <>
                  <input type="email" placeholder="Email" required />
                  <input type="password" placeholder="Password" required />
                </>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={registrationData.fullName}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, fullName: e.target.value }))}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Specialization"
                    value={registrationData.specialization}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, specialization: e.target.value }))}
                    required
                  />
                  <input
                    type="text"
                    placeholder="License Number"
                    value={registrationData.licenseNumber}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                    required
                  />
                  <div className="file-upload">
                    <label>Upload Documents:</label>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      required
                    />
                  </div>
                </>
              )}
              <button type="submit" className="submit-btn">
                {isLogin ? 'Login' : 'Request Access'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage; 