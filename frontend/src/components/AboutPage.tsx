import React, { useEffect, useState } from 'react';
import './AboutPage.css';

const AboutPage: React.FC = () => {
  const fullHeading = 'AI-Based Cloud Resource Usage Predictor and Auto-Scaler';
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullHeading.slice(0, index + 1));
      index++;
      if (index === fullHeading.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="about-container">
      <h2 className="our-story">OUR STORY</h2>

      <div className="about-content">
        <div className="about-text">
          <h1 className="typing-effect">{displayedText}</h1>
          <p>
            This project leverages machine learning to analyze real-world cloud resource usage data (Google Borg traces) and predict the need for resource scaling in cloud environments.
            By evaluating CPU, memory, disk, and network usage, the system forecasts whether scaling is needed and estimates the exact storage requirements. This helps optimize cloud infrastructure management by preventing over-provisioning and reducing costs.
          </p>

          <h2 className="highlight">Key Features</h2>
          <ul>
            <li>Accurate classification of scaling needs (No, Moderate, or High scaling).</li>
            <li>Regression model for predicting precise storage requirements in GB.</li>
            <li>A RESTful API built with Flask for real-time predictions.</li>
            <li>Logging and history tracking of user predictions for better monitoring.</li>
            <li>(Optional) User authentication for personalized experiences.</li>
          </ul>

          <h2 className="highlight">Technologies Used</h2>
          <p>
            Python, Flask, scikit-learn, Random Forest, Pandas, NumPy, Bootstrap (if UI added).
          </p>
        </div>

        <div className="about-image">
          <img
            src="https://media.istockphoto.com/id/1322205588/photo/cropped-shot-of-three-young-businessmpeople-working-together-on-a-laptop-in-their-office-late.jpg?s=612x612&w=0&k=20&c=G5dWfl2JH9Lqp0Yjgo4qYLjg88v5QGoIU-Bqw2qTXrA="
            alt="Team working on laptop"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
