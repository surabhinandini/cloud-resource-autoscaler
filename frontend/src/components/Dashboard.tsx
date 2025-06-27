import React, { useEffect, useState } from 'react';
import './Dashboard.css';

interface Prediction {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkUsage: number;
  scaleNeeded: number;
  predictedStorage: number;
}

const Dashboard: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/dashboard/predictions')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setPredictions(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="dashboard-container"><p>Loading dashboard...</p></div>;
  if (error) return <div className="dashboard-container"><p style={{ color: 'red' }}>Error: {error}</p></div>;

  return (
    <div className="dashboard-container">
      {/* Background Video */}
      <video className="background-video" autoPlay loop muted playsInline>
        <source src="https://cdn.pixabay.com/video/2017/06/11/9809-221185519_tiny.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Content on top */}
      <div className="dashboard-content">
        <h2>Prediction Logs</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>CPU Usage</th>
                <th>Memory Usage</th>
                <th>Disk Usage</th>
                <th>Network Usage</th>
                <th>Scale Needed</th>
                <th>Predicted Storage (GB)</th>
              </tr>
            </thead>

            <tbody>
              {predictions.map((p, i) => (
                <tr key={i}>
                  <td>{p.cpuUsage}</td>
                  <td>{p.memoryUsage}</td>
                  <td>{p.diskUsage}</td>
                  <td>{p.networkUsage}</td>
                  <td>{p.scaleNeeded}</td>
                  <td>{p.predictedStorage}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
