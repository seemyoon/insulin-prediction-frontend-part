import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import '../styles/InsulinType.css';

interface PatientData {
  gender: string;
  age: number;
  hypertension: boolean;
  heart_disease: boolean;
  smoking_history: string;
  bmi: number;
  weight: number;
  height: number;
  HbA1c_level: number;
  blood_glucose_level: number;
  diabetes_type: string;
  lipid_mod: number;
  clinical_model: number;
  predicted_insulin_dose?: number;
}

interface InsulinType {
  id: string;
  name: string;
  type: 'basal' | 'bolus';
}

const availableInsulins: InsulinType[] = [
  { id: '1', name: 'Lantus', type: 'basal' },
  { id: '2', name: 'Levemir', type: 'basal' },
  { id: '3', name: 'Novolog', type: 'bolus' },
  { id: '4', name: 'Humalog', type: 'bolus' },
  { id: '5', name: 'Tresiba', type: 'basal' },
  { id: '6', name: 'Apidra', type: 'bolus' }
];

const InsulinType: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<'basal' | 'bolus' | ''>('');
  const [selectedInsulin, setSelectedInsulin] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [requestData, setRequestData] = useState({
    medicationName: '',
    comments: ''
  });
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [calculatedDose, setCalculatedDose] = useState<number | null>(null);

  useEffect(() => {
    // Load patient data from localStorage
    const storedData = localStorage.getItem('patientData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setPatientData(parsedData);
        
        // Calculate initial insulin dose based on patient data
        if (parsedData) {
          const dose = calculateInsulinDose(parsedData);
          setCalculatedDose(dose);
        }
      } catch (error) {
        console.error('Error parsing patient data:', error);
      }
    } else {
      // If no patient data is found, redirect to diagnosis
      navigate('/diagnosis');
    }
  }, [navigate]);

  const calculateInsulinDose = (data: PatientData): number => {
    // Base calculation on weight (0.2-0.4 units per kg)
    let baseDose = data.weight * 0.3;
    
    // Adjustments based on blood glucose levels
    const glucoseAdjustment = data.blood_glucose_level > 180 ? 2 : 0;
    
    // Adjustments based on HbA1c
    const hba1cAdjustment = data.HbA1c_level > 7.5 ? 2 : 0;
    
    // Age factor (older patients might need less insulin)
    const ageFactor = data.age > 65 ? 0.8 : 1;
    
    // Calculate final dose
    let finalDose = (baseDose + glucoseAdjustment + hba1cAdjustment) * ageFactor;
    
    // Round to nearest 0.5 units
    return Math.round(finalDose * 2) / 2;
  };

  const handleTypeSelect = (type: 'basal' | 'bolus') => {
    setSelectedType(type);
    localStorage.setItem('selectedInsulinType', type);
    setStep(2);
  };

  const handleInsulinSelect = (insulinId: string) => {
    setSelectedInsulin(insulinId);
    const selectedMedication = availableInsulins.find(i => i.id === insulinId)?.name || '';
    localStorage.setItem('selectedMedication', selectedMedication);
    setStep(3);
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to submit the request
    setShowRequestForm(false);
    setShowConfirmation(true);
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    navigate('/dashboard');
  };

  const handleComplete = () => {
    if (calculatedDose !== null) {
      // Adjust dose based on insulin type
      let adjustedDose = calculatedDose;
      
      if (selectedType === 'basal') {
        // For basal insulin, typically 40-50% of total daily dose
        adjustedDose = calculatedDose * 0.45;
      } else {
        // For bolus insulin, typically 50-60% of total daily dose
        adjustedDose = calculatedDose * 0.55;
      }
      
      // Round to nearest 0.5 units
      adjustedDose = Math.round(adjustedDose * 2) / 2;
      
      // Store the adjusted prediction
      localStorage.setItem('adjustedPrediction', adjustedDose.toString());
      
      // Navigate to prediction result page
      navigate('/prediction-result');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/diagnosis');
    }
  };

  const filteredInsulins = availableInsulins.filter(insulin => insulin.type === selectedType);

  if (!patientData) {
    return (
      <div className="page-container">
        <Navbar />
        <div className="insulin-container">
          <div className="insulin-card">
            <h2>Loading Patient Data</h2>
            <p>Please wait while we load your patient data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Navbar />
      <div className="insulin-container">
        <div className="insulin-card">
          <div className="progress-bar">
            <div className="progress" style={{ width: `${(step / 3) * 100}%` }}></div>
          </div>

          {/* Only show patient summary after insulin type selection */}
          {step > 1 && (
            <div className="patient-summary">
              <h4>Patient Summary</h4>
              <p>Age: {patientData.age} | BMI: {patientData.bmi.toFixed(1)} | Diabetes Type: {patientData.diabetes_type}</p>
              <p>Blood Glucose: {patientData.blood_glucose_level} mg/dL | HbA1c: {patientData.HbA1c_level}%</p>
            </div>
          )}

          {step === 1 && (
            <div className="step-content">
              <h3>Select Insulin Type</h3>
              <div className="type-selection">
                <button
                  className={`type-btn ${selectedType === 'basal' ? 'active' : ''}`}
                  onClick={() => handleTypeSelect('basal')}
                >
                  Basal Insulin
                  <span className="type-description">
                    Long-acting insulin for maintaining baseline blood sugar levels
                  </span>
                </button>
                <button
                  className={`type-btn ${selectedType === 'bolus' ? 'active' : ''}`}
                  onClick={() => handleTypeSelect('bolus')}
                >
                  Bolus Insulin
                  <span className="type-description">
                    Rapid-acting insulin for managing blood sugar after meals
                  </span>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="step-content">
              <h3>Select Medication</h3>
              <div className="medication-selection">
                {filteredInsulins.map(insulin => (
                  <button
                    key={insulin.id}
                    className={`medication-btn ${selectedInsulin === insulin.id ? 'active' : ''}`}
                    onClick={() => handleInsulinSelect(insulin.id)}
                  >
                    {insulin.name}
                  </button>
                ))}
                <button
                  className="medication-btn request"
                  onClick={() => setShowRequestForm(true)}
                >
                  Request New Medication
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-content">
              <h3>Confirmation</h3>
              <div className="confirmation-details">
                <p>Selected Insulin Type: {selectedType}</p>
                <p>Selected Medication: {availableInsulins.find(i => i.id === selectedInsulin)?.name}</p>
                <div className="prediction-summary">
                  <p>Type: {selectedType === 'basal' ? 'Long-acting' : 'Rapid-acting'}</p>
                </div>
              </div>
            </div>
          )}

          <div className="button-group">
            <button className="btn btn-secondary" onClick={handleBack}>
              Back
            </button>
            <button className="btn btn-primary" onClick={step === 3 ? handleComplete : handleNext}>
              {step === 3 ? 'Prediction' : 'Next'}
            </button>
          </div>
        </div>
      </div>

      {showRequestForm && (
        <div className="request-form">
          <h3>Request New Medication</h3>
          <form onSubmit={handleRequestSubmit}>
            <div className="form-group">
              <label>Medication Name</label>
              <input
                type="text"
                value={requestData.medicationName}
                onChange={(e) => setRequestData(prev => ({ ...prev, medicationName: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label>Comments</label>
              <textarea
                value={requestData.comments}
                onChange={(e) => setRequestData(prev => ({ ...prev, comments: e.target.value }))}
                required
              />
            </div>
            <button type="submit" className="submit-btn">Submit Request</button>
          </form>
        </div>
      )}

      {showConfirmation && (
        <div className="confirmation-modal">
          <div className="confirmation-content">
            <h3>Thank You for Your Request</h3>
            <div className="request-details">
              <p>Your medication request has been submitted successfully.</p>
              <p>Request Details:</p>
              <ul>
                <li>Medication Name: {requestData.medicationName}</li>
                {requestData.comments && (
                  <li>Additional Comments: {requestData.comments}</li>
                )}
              </ul>
              <p className="request-note">
                Our team will review your request and get back to you shortly.
                You will be notified once the medication is approved and available.
              </p>
            </div>
            <button className="btn btn-primary" onClick={handleConfirmationClose}>
              Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsulinType; 