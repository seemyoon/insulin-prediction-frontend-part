import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import '../styles/Diagnosis.css';

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

interface DiagnosisData {
  patientName: string;
  age: string;
  diabetesType: string;
  bloodTests: {
    fastingGlucose: string;
    hba1c: string;
    cholesterol: string;
  };
  bmi: {
    height: string;
    weight: string;
    value: string;
  };
}

const Diagnosis: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [validationMessage, setValidationMessage] = useState('');
  const [patientData, setPatientData] = useState<PatientData>({
    gender: '',
    age: 0,
    hypertension: false,
    heart_disease: false,
    smoking_history: '',
    bmi: 0,
    weight: 0,
    height: 0,
    HbA1c_level: 0,
    blood_glucose_level: 0,
    diabetes_type: '',
    lipid_mod: 0,
    clinical_model: 0
  });

  const [diagnosisData, setDiagnosisData] = useState<DiagnosisData>({
    patientName: '',
    age: '',
    diabetesType: '',
    bloodTests: {
      fastingGlucose: '',
      hba1c: '',
      cholesterol: ''
    },
    bmi: {
      height: '',
      weight: '',
      value: ''
    }
  });

  const [errors, setErrors] = useState<{
    patientName?: string;
    diabetesType?: string;
    bloodTests?: {
      fastingGlucose?: string;
      hba1c?: string;
      cholesterol?: string;
    };
  }>({});

  const handleInputChange = (field: string, value: string) => {
    setDiagnosisData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleBloodTestChange = (field: string, value: string) => {
    setDiagnosisData(prev => ({
      ...prev,
      bloodTests: {
        ...prev.bloodTests,
        [field]: value
      }
    }));
    // Clear error when user starts typing
    if (errors.bloodTests?.[field as keyof typeof errors.bloodTests]) {
      setErrors(prev => ({
        ...prev,
        bloodTests: {
          ...prev.bloodTests,
          [field]: undefined
        }
      }));
    }
  };

  const handleBMICalculate = () => {
    const height = parseFloat(diagnosisData.bmi.height) / 100; // convert cm to m
    const weight = parseFloat(diagnosisData.bmi.weight);
    
    if (height && weight) {
      const bmiValue = (weight / (height * height)).toFixed(1);
      setDiagnosisData(prev => ({
        ...prev,
        bmi: {
          ...prev.bmi,
          value: bmiValue
        }
      }));
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!diagnosisData.patientName.trim()) {
      newErrors.patientName = 'Please enter patient name';
    }
    
    if (!diagnosisData.diabetesType) {
      newErrors.diabetesType = 'Please select diabetes type manually';
    }

    if (!diagnosisData.bloodTests.fastingGlucose) {
      newErrors.bloodTests = {
        ...newErrors.bloodTests,
        fastingGlucose: 'Please enter glucose level'
      };
    }

    if (!diagnosisData.bloodTests.hba1c) {
      newErrors.bloodTests = {
        ...newErrors.bloodTests,
        hba1c: 'Please enter HbA1c level'
      };
    }

    if (!diagnosisData.bloodTests.cholesterol) {
      newErrors.bloodTests = {
        ...newErrors.bloodTests,
        cholesterol: 'Please enter cholesterol level'
      };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveToHistory = () => {
    if (!validateForm()) {
      return;
    }

    const history = JSON.parse(localStorage.getItem('patientHistory') || '[]');
    const newRecord = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      patientName: diagnosisData.patientName,
      diagnosis: diagnosisData.diabetesType,
      insulinType: '', // Will be filled in InsulinType component
      dosage: '', // Will be filled in InsulinType component
      notes: `Blood Tests: Glucose ${diagnosisData.bloodTests.fastingGlucose}, HbA1c ${diagnosisData.bloodTests.hba1c}, Cholesterol ${diagnosisData.bloodTests.cholesterol}`
    };
    
    localStorage.setItem('patientHistory', JSON.stringify([...history, newRecord]));
    alert('Data successfully saved to history');
  };

  const handleContinue = () => {
    if (!validateForm()) {
      return;
    }
    navigate('/insulin-type');
  };

  const calculateBMI = (weight: number, height: number) => {
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    setPatientData(prev => ({
      ...prev,
      bmi: Number(bmi.toFixed(1))
    }));
    return bmi;
  };

  const calculateInsulinDose = (data: PatientData): number => {
    // Basic insulin dose calculation based on common medical guidelines
    let baseDose = 0;
    
    // Base dose calculation based on weight (0.2-0.4 units per kg)
    const weightBasedDose = data.weight * 0.3;
    
    // Adjustments based on blood glucose levels
    const glucoseAdjustment = data.blood_glucose_level > 180 ? 2 : 0;
    
    // Adjustments based on HbA1c
    const hba1cAdjustment = data.HbA1c_level > 7.5 ? 2 : 0;
    
    // Age factor (older patients might need less insulin)
    const ageFactor = data.age > 65 ? 0.8 : 1;
    
    // Calculate final dose
    baseDose = (weightBasedDose + glucoseAdjustment + hba1cAdjustment) * ageFactor;
    
    // Round to nearest 0.5 units
    return Math.round(baseDose * 2) / 2;
  };

  const handleNext = () => {
    if (step < 4) {
      // Validate current step
      const currentStepValid = validateStep(step);
      if (currentStepValid) {
        setValidationMessage('');
        setStep(step + 1);
      } else {
        setValidationMessage('Please fill in all required fields');
      }
    } else {
      // Calculate insulin dose before proceeding
      const predictedDose = calculateInsulinDose(patientData);
      setPatientData(prev => ({
        ...prev,
        predicted_insulin_dose: predictedDose
      }));
      
      // Save patient data to localStorage
      localStorage.setItem('patientData', JSON.stringify({
        ...patientData,
        predicted_insulin_dose: predictedDose
      }));
      
      navigate('/insulin-type');
    }
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        return !!(
          patientData.gender &&
          patientData.age > 0 &&
          (patientData.bmi > 0 || (patientData.weight > 0 && patientData.height > 0))
        );
      case 2:
        return !!(
          patientData.smoking_history
        );
      case 3:
        return !!(
          patientData.HbA1c_level > 0 &&
          patientData.blood_glucose_level > 0
        );
      case 4:
        return !!patientData.diabetes_type;
      default:
        return false;
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/dashboard');
    }
  };

  const predictDiabetesType = (data: PatientData): string => {
    // Simple prediction model based on the provided parameters
    let score = 0;
    
    // Age factor (Type 1 is more common in younger patients)
    if (data.age < 30) score += 2;
    else if (data.age < 50) score += 1;
    
    // BMI factor (Type 2 is more common in patients with higher BMI)
    if (data.bmi >= 30) score -= 2;
    else if (data.bmi >= 25) score -= 1;
    
    // Lipid modification factor
    if (data.lipid_mod > 0) score -= 1;
    
    // Clinical model factor
    if (data.clinical_model > 0) score -= 1;
    
    // Return prediction based on score
    return score > 0 ? "Type 1" : "Type 2";
  };

  return (
    <div className="page-container">
      <Navbar />
      <div className="diagnosis-container">
        <div className="diagnosis-card">
          <h2>Patient Diagnosis</h2>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${(step / 4) * 100}%` }}></div>
          </div>

          {step === 1 && (
            <div className="step-content">
              <h3>Basic Information</h3>
              <div className="form-group">
                <label>Gender *</label>
                <select
                  name="gender"
                  value={patientData.gender}
                  onChange={(e) => setPatientData({ ...patientData, gender: e.target.value })}
                  className="form-control"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="form-group">
                <label>Age *</label>
                <input
                  type="number"
                  name="age"
                  value={patientData.age}
                  onChange={(e) => setPatientData({ ...patientData, age: Number(e.target.value) })}
                  className="form-control"
                  placeholder="Enter age"
                  required
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>BMI *</label>
                <input
                  type="number"
                  name="bmi"
                  value={patientData.bmi}
                  onChange={(e) => setPatientData({ ...patientData, bmi: Number(e.target.value) })}
                  className="form-control"
                  placeholder="Enter BMI"
                  step="0.1"
                  required
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="step-content">
              <h3>Medical History</h3>
              <div className="form-group">
                <label>Medical History</label>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="hypertension"
                    checked={patientData.hypertension}
                    onChange={(e) => setPatientData({ ...patientData, hypertension: e.target.checked })}
                  />
                  <label>Hypertension</label>
                </div>
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    name="heart_disease"
                    checked={patientData.heart_disease}
                    onChange={(e) => setPatientData({ ...patientData, heart_disease: e.target.checked })}
                  />
                  <label>Heart Disease</label>
                </div>
              </div>

              <div className="form-group">
                <label>Smoking History</label>
                <select
                  name="smoking_history"
                  value={patientData.smoking_history}
                  onChange={(e) => setPatientData({ ...patientData, smoking_history: e.target.value })}
                  className="form-control"
                >
                  <option value="">Select Smoking History</option>
                  <option value="never">Never Smoked</option>
                  <option value="former">Former Smoker</option>
                  <option value="current">Current Smoker</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-content">
              <h3>Blood Tests</h3>
              <div className="form-group">
                <label>HbA1c Level (%)</label>
                <input
                  type="number"
                  name="HbA1c_level"
                  value={patientData.HbA1c_level}
                  onChange={(e) => setPatientData({ ...patientData, HbA1c_level: Number(e.target.value) })}
                  className="form-control"
                  step="0.1"
                  placeholder="Enter HbA1c level"
                />
              </div>

              <div className="form-group">
                <label>Blood Glucose Level (mg/dL)</label>
                <input
                  type="number"
                  name="blood_glucose_level"
                  value={patientData.blood_glucose_level}
                  onChange={(e) => setPatientData({ ...patientData, blood_glucose_level: Number(e.target.value) })}
                  className="form-control"
                  placeholder="Enter blood glucose level"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="step-content">
              <h3>Diabetes Type Assessment</h3>
              
              <div className="diabetes-type-options">
                <div className="prediction-option">
                  <h4>Predict Diabetes Type</h4>
                  <div className="form-group">
                    <label>Lipid Modification Score</label>
                    <input
                      type="number"
                      name="lipid_mod"
                      value={patientData.lipid_mod}
                      onChange={(e) => setPatientData({ ...patientData, lipid_mod: Number(e.target.value) })}
                      className="form-control"
                      placeholder="Enter lipid modification score"
                      min="0"
                      max="10"
                    />
                  </div>
                  <div className="form-group">
                    <label>Clinical Model Score</label>
                    <input
                      type="number"
                      name="clinical_model"
                      value={patientData.clinical_model}
                      onChange={(e) => setPatientData({ ...patientData, clinical_model: Number(e.target.value) })}
                      className="form-control"
                      placeholder="Enter clinical model score"
                      min="0"
                      max="10"
                    />
                  </div>
                  <div className="form-group">
                    <label>BMI</label>
                    <input
                      type="number"
                      name="bmi"
                      value={patientData.bmi}
                      className="form-control"
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label>Age</label>
                    <input
                      type="number"
                      name="age"
                      value={patientData.age}
                      className="form-control"
                      readOnly
                    />
                  </div>
                  <button 
                    className="predict-btn"
                    onClick={() => {
                      const predictedType = predictDiabetesType(patientData);
                      setPatientData({ ...patientData, diabetes_type: predictedType });
                    }}
                  >
                    Predict Type
                  </button>
                  {patientData.diabetes_type && (
                    <div className="prediction-result">
                      <p>Predicted Type: {patientData.diabetes_type}</p>
                    </div>
                  )}
                </div>

                <div className="manual-option">
                  <h4>Or Select Manually</h4>
                  <select
                    name="diabetes_type"
                    value={patientData.diabetes_type}
                    onChange={(e) => setPatientData({ ...patientData, diabetes_type: e.target.value })}
                    className="form-control"
                    required
                  >
                    <option value="">Select Diabetes Type</option>
                    <option value="Type 1">Type 1 Diabetes</option>
                    <option value="Type 2">Type 2 Diabetes</option>
                    <option value="Gestational">Gestational Diabetes</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="diagnosis-notes">
                <p>Based on the patient's data:</p>
                <ul>
                  <li>Age: {patientData.age}</li>
                  <li>BMI: {patientData.bmi.toFixed(1)}</li>
                  <li>HbA1c: {patientData.HbA1c_level}%</li>
                  <li>Blood Glucose: {patientData.blood_glucose_level} mg/dL</li>
                </ul>
                {patientData.predicted_insulin_dose !== undefined && (
                  <div className="insulin-prediction">
                    <h4>Recommended Insulin Dosage</h4>
                    <p className="predicted-dose">
                      {patientData.predicted_insulin_dose} units per day
                    </p>
                    <p className="prediction-note">
                      Note: This is a preliminary recommendation. Final dosage should be adjusted based on individual response and medical professional's assessment.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="button-group">
            <button className="btn btn-secondary" onClick={handleBack}>
              Back
            </button>
            <button className="btn btn-primary" onClick={handleNext}>
              {step === 4 ? 'Continue to Insulin Type' : 'Next'}
            </button>
          </div>
          {validationMessage && (
            <div className="validation-message">
              {validationMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Diagnosis; 