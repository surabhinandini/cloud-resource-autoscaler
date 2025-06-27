import React, { useState } from 'react';
import './AuthForm.css';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const toggleForm = () => setIsLogin(!isLogin);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }

    const usersStr = localStorage.getItem('users');
    const users = usersStr ? JSON.parse(usersStr) : [];

    const existingUser = users.find((user: any) => user.email === email);

    if (!existingUser) {
      alert('User not found. Please sign up first.');
      return;
    }

    if (existingUser.password !== password) {
      alert('Incorrect password.');
      return;
    }

    const token = 'user-token'; // Can be replaced with backend token
    localStorage.setItem('token', token);
    login(token);
    navigate('/dashboard');
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    if (!signupName || !signupEmail || !signupPassword || !signupConfirmPassword) {
      alert('Please fill all fields');
      return;
    }

    if (signupPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const usersStr = localStorage.getItem('users');
    const users = usersStr ? JSON.parse(usersStr) : [];

    if (users.find((user: any) => user.email === signupEmail)) {
      alert('Email already registered. Please login.');
      return;
    }

    const newUser = {
      name: signupName,
      email: signupEmail,
      password: signupPassword
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Signup successful! Please log in.');

    setSignupName('');
    setSignupEmail('');
    setSignupPassword('');
    setSignupConfirmPassword('');
    setIsLogin(true);
  };

  return (
    <div className="auth-bg">
      <video autoPlay muted loop className="auth-video">
        <source
          src="https://cdn.pixabay.com/video/2016/11/01/6218-189900449_tiny.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      <div className="auth-container">
        <div className={`cuboid ${isLogin ? '' : 'flip'}`}>
          {/* Login Form */}
          <div className="face front">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Login</button>
            </form>
            <p>
              Don't have an account?{' '}
              <button className="toggle-btn" onClick={toggleForm} type="button">
                Sign Up
              </button>
            </p>
          </div>

          {/* Sign Up Form */}
          <div className="face back">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup}>
              <input
                type="text"
                placeholder="Name"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={signupConfirmPassword}
                onChange={(e) => setSignupConfirmPassword(e.target.value)}
                required
              />
              <button type="submit">Sign Up</button>
            </form>
            <p>
              Already have an account?{' '}
              <button className="toggle-btn" onClick={toggleForm} type="button">
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
