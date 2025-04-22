import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/InsulinPrediction.css';

interface PredictionResult {
  recommendedDose: number;
  confidence: number;
  notes: string[];
}

const InsulinPrediction: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);

  const handlePredict = async () => {
    setIsLoading(true);
    try {
      // Here you would typically make an API call to your backend
      // For now, we'll simulate a prediction
      setTimeout(() => {
        setPredictionResult({
          recommendedDose: 15,
          confidence: 0.85,
          notes: [
            'Based on patient\'s current blood glucose levels',
            'Taking into account recent HbA1c readings',
            'Considering patient\'s weight and activity level'
          ]
        });
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error making prediction:', error);
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    // Here you would typically save the prediction to your database
    navigate('/dashboard');
  };

  return (
    <div className="prediction-container">
      <div className="prediction-card">
        <h2>Insulin Dose Prediction</h2>
        
        {!predictionResult ? (
          <div className="prediction-content">
            <p className="info-text">
              Click the button below to generate an insulin dose prediction based on the patient's data.
            </p>
            <button 
              className="btn btn-primary"
              onClick={handlePredict}
              disabled={isLoading}
            >
              {isLoading ? 'Calculating...' : 'Generate Prediction'}
            </button>
          </div>
        ) : (
          <div className="prediction-result">
            <div className="result-header">
              <h3>Recommended Insulin Dose</h3>
              <div className="dose-value">{predictionResult.recommendedDose} units</div>
            </div>

            <div className="confidence-meter">
              <div className="confidence-label">Prediction Confidence</div>
              <div className="confidence-bar">
                <div 
                  className="confidence-fill"
                  style={{ width: `${predictionResult.confidence * 100}%` }}
                ></div>
              </div>
              <div className="confidence-value">
                {(predictionResult.confidence * 100).toFixed(1)}%
              </div>
            </div>

            <div className="prediction-notes">
              <h4>Notes</h4>
              <ul>
                {predictionResult.notes.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            </div>

            <div className="button-group">
              <button className="btn btn-secondary" onClick={() => navigate('/insulin-type')}>
                Back
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                Save Prediction
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsulinPrediction; 