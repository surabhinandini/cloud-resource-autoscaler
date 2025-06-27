import React, { Suspense, lazy } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom'; // No BrowserRouter here!
import LandingPage from './components/LandingPage';
import Auth from './components/AuthForm';
import PrivateRoute from './components/PrivateRoutes';
import './App.css';

const StorageEstPage = lazy(() => import('./components/StorageEstPage'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const AboutPage = lazy(() => import('./components/AboutPage'));
const ContactPage = lazy(() => import('./components/ContactPage'));

const App: React.FC = () => {
  return (
    <>
      <nav className="navbar" aria-label="Main navigation">
        <div className="logo-container">
          <img src="/logo-transparent.png" alt="PredictX Logo" className="logo" />
          <span className="logo-name">PredictX</span>
        </div>
        <ul className="nav-links">
          <li><NavLink to="/" className={({ isActive }) => isActive ? 'active-link' : undefined}>HOME</NavLink></li>
          <li><NavLink to="/storage-estimation" className={({ isActive }) => isActive ? 'active-link' : undefined}>STORAGE EST.</NavLink></li>
          <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active-link' : undefined}>DASHBOARD</NavLink></li>
          <li><NavLink to="/about" className={({ isActive }) => isActive ? 'active-link' : undefined}>ABOUT US</NavLink></li>
          <li><NavLink to="/contact" className={({ isActive }) => isActive ? 'active-link' : undefined}>CONTACT</NavLink></li>
          <li><NavLink to="/auth" className={({ isActive }) => isActive ? 'active-link' : undefined}>LOGIN</NavLink></li>
        </ul>
      </nav>

      <div style={{ paddingTop: '80px' }}>
        <Suspense fallback={<div style={{ color: 'white', padding: '2rem' }}>Loading...</div>}>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<PrivateRoute><LandingPage /></PrivateRoute>} />
            <Route path="/storage-estimation" element={<PrivateRoute><StorageEstPage /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/about" element={<PrivateRoute><AboutPage /></PrivateRoute>} />
            <Route path="/contact" element={<PrivateRoute><ContactPage /></PrivateRoute>} />
          </Routes>
        </Suspense>
      </div>
    </>
  );
};

export default App;
