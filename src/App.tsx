import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Diagnosis from './components/Diagnosis';
import InsulinType from './components/InsulinType';
import PatientHistory from './components/PatientHistory';
import PredictionResult from './components/PredictionResult';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/diagnosis" element={<Diagnosis />} />
        <Route path="/insulin-type" element={<InsulinType />} />
        <Route path="/patient-history" element={<PatientHistory />} />
        <Route path="/prediction-result" element={<PredictionResult />} />
      </Routes>
    </Router>
  );
};

export default App; 