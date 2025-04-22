import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import '../styles/PatientHistory.css';

interface PatientRecord {
  id: number;
  date: string;
  patientName: string;
  diagnosis: string;
  insulinType: string;
  dosage: string;
  notes: string;
}

const PatientHistory: React.FC = () => {
  const navigate = useNavigate();
  const [patientHistory, setPatientHistory] = useState<PatientRecord[]>([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('patientHistory') || '[]');
    setPatientHistory(history);
  }, []);

  return (
    <div className="page-container">
      <Navbar />
      <div className="history-container">
        <div className="history-filters">
          <input type="text" placeholder="Search by patient name..." />
          <select>
            <option value="">All Diagnoses</option>
            <option value="type1">Type 1 Diabetes</option>
            <option value="type2">Type 2 Diabetes</option>
          </select>
          <input type="date" />
        </div>
        
        <div className="history-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Patient Name</th>
                <th>Diagnosis</th>
                <th>Insulin Type</th>
                <th>Dosage</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patientHistory.map(record => (
                <tr key={record.id}>
                  <td>{record.date}</td>
                  <td>{record.patientName}</td>
                  <td>{record.diagnosis}</td>
                  <td>{record.insulinType}</td>
                  <td>{record.dosage}</td>
                  <td>{record.notes}</td>
                  <td>
                    <button className="action-btn view">View</button>
                    <button className="action-btn edit">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientHistory; 