import React from 'react';
import BackgroundVideo from './BackgroundVideo';
import { Link } from 'react-router-dom';

import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <video autoPlay loop muted className="background-video">
        <source src="https://cdn.pixabay.com/video/2016/05/18/3227-167234355_tiny.mp4" type="video/mp4" />
      </video>

      {/* <nav className="navbar">
        <div className="logo-container">
          <img src="/logo-transparent.png" alt="PredictX Logo" className="logo" />
          <span className="logo-name">PredictX</span>
        </div>
        <ul className="nav-links">
          <li><Link to="/">HOME</Link></li>
          <li><Link to="/storage-estimation">STORAGE EST.</Link></li>
          <li><Link to="/dashboard">DASHBOARD</Link></li>
          <li><Link to="/about">ABOUT US</Link></li>
          <li><Link to="/contact">CONTACT</Link></li>
          <li><Link to="/login">LOGIN</Link></li>
        </ul>
      </nav> */}

      <div className="hero-text">
        <h1>PredictX</h1>
        <p>
          A smart, AI-powered platform that predicts <br />
          cloud scaling and storage needs.
        </p>
      </div>

      <div className="feature-cards">
        <div className="card">🚀 Instant Scale Prediction</div>
        <div className="card">📊 Smart Storage Estimation</div>
        <div className="card">📁 Auto Logging & CSV Export</div>
        <div className="card">🔐 Secure, Fast, & User-Friendly</div>
      </div>

      <footer className="footer">
        <p>© 2025 PredictX | Email: <a href="mailto:surabhinandini4@gmail.com">surabhinandini4@gmail.com</a></p>
        <div className="social-icons">
          <a href="#"><i className="fab fa-facebook"></i></a>
          <a href="#"><i className="fab fa-instagram"></i></a>
          <a href="#"><i className="fab fa-twitter"></i></a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
