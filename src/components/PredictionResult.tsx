import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PredictionResult.css';

interface PredictionData {
  baseDose: number;
  adjustedDose: number;
  insulinType: string;
  medication: string;
  date: string;
  patientName: string;
}

const PredictionResult: React.FC = () => {
  const navigate = useNavigate();
  const [predictionData, setPredictionData] = useState<PredictionData>({
    baseDose: 0,
    adjustedDose: 0,
    insulinType: '',
    medication: '',
    date: new Date().toISOString(),
    patientName: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    // Load prediction data from localStorage
    const baseDose = Number(localStorage.getItem('predictedDose')) || 0;
    const adjustedDose = Number(localStorage.getItem('adjustedPrediction')) || 0;
    const insulinType = localStorage.getItem('selectedInsulinType') || '';
    const medication = localStorage.getItem('selectedMedication') || '';

    setPredictionData(prev => ({
      ...prev,
      baseDose,
      adjustedDose,
      insulinType,
      medication,
      date: new Date().toISOString()
    }));
  }, []);

  const handleSaveToHistory = () => {
    if (!predictionData.patientName.trim()) {
      setError('Please enter patient name');
      return;
    }

    // Get existing history or initialize empty array
    const existingHistory = JSON.parse(localStorage.getItem('patientHistory') || '[]');
    
    // Add new prediction to history
    const updatedHistory = [...existingHistory, predictionData];
    
    // Save updated history
    localStorage.setItem('patientHistory', JSON.stringify(updatedHistory));
    
    // Navigate to patient history
    navigate('/patient-history');
  };

  return (
    <div className="prediction-result-container">
      <div className="prediction-result-card">
        <h2>Insulin Dosage Prediction</h2>
        
        <div className="prediction-details">
          <div className="prediction-item">
            <h3>Base Daily Dose</h3>
            <p>{predictionData.baseDose} units</p>
          </div>
          
          <div className="prediction-item">
            <h3>Adjusted Dose for {predictionData.insulinType} Insulin</h3>
            <p>{predictionData.adjustedDose} units</p>
          </div>
          
          <div className="prediction-item">
            <h3>Selected Medication</h3>
            <p>{predictionData.medication}</p>
          </div>
          
          <div className="prediction-item">
            <h3>Date</h3>
            <p>{new Date(predictionData.date).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="patient-name-input">
          <label>Patient Name:</label>
          <input
            type="text"
            value={predictionData.patientName}
            onChange={(e) => {
              setPredictionData(prev => ({ ...prev, patientName: e.target.value }));
              setError('');
            }}
            placeholder="Enter patient name"
            className={error ? 'error-input' : ''}
          />
          {error && <span className="error-message">{error}</span>}
        </div>

        <div className="prediction-note">
          <p>Note: This prediction is based on standard guidelines and should be adjusted based on individual patient response and medical professional's assessment.</p>
        </div>

        <div className="button-group">
          <button className="btn btn-secondary" onClick={() => navigate('/insulin-type')}>
            Back
          </button>
          <button className="btn btn-primary" onClick={handleSaveToHistory}>
            Save to Patient History
          </button>
        </div>
      </div>
    </div>
  );
};

export default PredictionResult; 