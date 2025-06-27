import React, { useState } from 'react';
import { PredictionEntry } from '../types';
import './PredictForm.css';

interface PredictFormProps {
  onNewPrediction: (entry: PredictionEntry) => void;
}

const PredictForm: React.FC<PredictFormProps> = ({ onNewPrediction }) => {
  const [cpuUsage, setCpuUsage] = useState<number>(0);
  const [memoryUsage, setMemoryUsage] = useState<number>(0);
  const [diskUsage, setDiskUsage] = useState<number>(0);
  const [networkUsage, setNetworkUsage] = useState<number>(0);
  const [predictedStorage, setPredictedStorage] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cpuUsage,
          memoryUsage,
          diskUsage,
          networkUsage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error fetching prediction');
      }

      const data = await response.json();
      const prediction: PredictionEntry = {
        cpuUsage,
        memoryUsage,
        diskUsage,
        networkUsage,
        predictedStorageGB: data.predicted_storage_gb,
      };

      setPredictedStorage(data.predicted_storage_gb);
      setError(null);
      onNewPrediction(prediction); // Notify parent
    } catch (err: any) {
      setError(err.message || 'Failed to fetch prediction');
      setPredictedStorage(null);
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <h2>AI Resource Allocation Prediction</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>CPU Usage (%):</label>
          <input
            type="number"
            value={cpuUsage}
            min={0}
            max={100}
            step={0.1}
            onChange={(e) => setCpuUsage(Number(e.target.value))}
          />
        </div>

        <div>
          <label>Memory Usage (%):</label>
          <input
            type="number"
            value={memoryUsage}
            min={0}
            max={100}
            step={0.1}
            onChange={(e) => setMemoryUsage(Number(e.target.value))}
          />
        </div>

        <div>
          <label>Disk Usage (%):</label>
          <input
            type="number"
            value={diskUsage}
            min={0}
            max={100}
            step={0.1}
            onChange={(e) => setDiskUsage(Number(e.target.value))}
          />
        </div>

        <div>
          <label>Network Usage (%):</label>
          <input
            type="number"
            value={networkUsage}
            min={0}
            max={100}
            step={0.1}
            onChange={(e) => setNetworkUsage(Number(e.target.value))}
          />
        </div>

        <button type="submit">Predict</button>
      </form>

      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      )}

      {predictedStorage !== null && (
        <div className="prediction-result">
          <p>CPU Usage: {cpuUsage}%</p>
          <p>Memory Usage: {memoryUsage}%</p>
          <p>Disk Usage: {diskUsage}%</p>
          <p>Network Usage: {networkUsage}%</p>
          <p>Predicted Storage: <strong>{predictedStorage} GB</strong></p>
        </div>
      )}
    </div>
  );
};

export default PredictForm;
