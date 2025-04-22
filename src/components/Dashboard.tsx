import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Medical Dashboard</h1>
        <button className="btn btn-primary home-btn" onClick={() => navigate('/')}>
          Home
        </button>
      </div>
      
      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>Welcome to Insulin Dose Calculator</h2>
          <p className="welcome-text">
            This professional medical tool assists healthcare providers in determining appropriate insulin dosages 
            for diabetes patients. Our calculator considers multiple factors including BMI, blood glucose levels, 
            and HbA1c to provide personalized recommendations.
          </p>
        </div>

        <div className="dashboard-card">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <div className="action-card">
              <h3>New Diagnosis</h3>
              <p>Start a new patient diagnosis process to calculate insulin dosage recommendations.</p>
              <button className="btn btn-primary" onClick={() => navigate('/diagnosis')}>
                Start Diagnosis
              </button>
            </div>
            <div className="action-card">
              <h3>Patient History</h3>
              <p>View and manage previous patient records and insulin dosage calculations.</p>
              <button className="btn btn-primary" onClick={() => navigate('/patient-history')}>
                View History
              </button>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h2>About the Calculator</h2>
          <div className="info-grid">
            <div className="info-card">
              <h3>Accurate Calculations</h3>
              <p>Our algorithm considers multiple medical factors to provide precise insulin dosage recommendations.</p>
            </div>
            <div className="info-card">
              <h3>Patient Safety</h3>
              <p>All recommendations include safety guidelines and should be reviewed by healthcare professionals.</p>
            </div>
            <div className="info-card">
              <h3>Medical Guidelines</h3>
              <p>Calculations are based on current medical guidelines and best practices for diabetes management.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 