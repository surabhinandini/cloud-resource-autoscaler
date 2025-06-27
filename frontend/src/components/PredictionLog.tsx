import React from 'react';
import './PredictionLog.css';

export interface PredictionEntry {
  id: string;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkUsage: number;
  predictedStorageGB: number;
}

interface PredictionLogProps {
  entries: PredictionEntry[];
}

const PredictionLog: React.FC<PredictionLogProps> = ({ entries }) => (
  <div className="prediction-log">
    <h3>Prediction Log</h3>
    <ul>
      {entries.map((entry) => (
        <li key={entry.id}>
          <span><strong>CPU:</strong> {entry.cpuUsage}%</span>{', '}
          <span><strong>Memory:</strong> {entry.memoryUsage}%</span>{', '}
          <span><strong>Disk:</strong> {entry.diskUsage}%</span>{', '}
          <span><strong>Network:</strong> {entry.networkUsage} Mbps</span>{' → '}
          <span><strong>Predicted Storage:</strong> {entry.predictedStorageGB} GB</span>
        </li>
      ))}
    </ul>
  </div>
);

export default PredictionLog;
