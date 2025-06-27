import React, { useState } from 'react';
import PredictForm from './PredictForm';
import { PredictionEntry } from '../types';
import './StorageEstPage.css';

const StorageEstPage: React.FC = () => {
  const [latestPrediction, setLatestPrediction] = useState<PredictionEntry | null>(null);

  const handleNewPrediction = (entry: PredictionEntry) => {
    setLatestPrediction(entry);
    console.log('New prediction received:', entry);
  };

  return (
    <div className="storage-est-container">
      <video autoPlay loop muted className="background-video">
        <source
          src="https://videos.pexels.com/video-files/3141210/3141210-uhd_2560_1440_25fps.mp4"
          type="video/mp4"
        />
      </video>

      <div className="content">
        <h1>Storage Estimation</h1>
        <PredictForm onNewPrediction={handleNewPrediction} />
      </div>
    </div>
  );
};

export default StorageEstPage;
