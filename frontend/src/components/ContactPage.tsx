import React, { useState } from 'react';
import './ContactPage.css';

const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !subject || !message) {
      setStatus('❌ Please fill in all fields.');
      return;
    }
    if (!validateEmail(email)) {
      setStatus('❌ Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setStatus('');

    try {
      const response = await fetch('http://localhost:5000/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (response.ok) {
        setStatus('✅ Thank you for contacting us!');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        const data = await response.json();
        setStatus(`❌ Something went wrong: ${data.error || 'Try again later.'}`);
      }
    } catch (error) {
      setStatus(`❌ Something went wrong: ${(error as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="contact-container">
        <h2>Contact Us</h2>
        {status && (
          <p className={`contact-status ${status.startsWith('❌') ? 'error' : ''}`}>
            {status}
          </p>
        )}
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={isSubmitting}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={isSubmitting}
            required
          />
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            disabled={isSubmitting}
            required
          />
          <textarea
            placeholder="Message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            disabled={isSubmitting}
            required
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Submit'}
          </button>
        </form>
      </div>

      {/* Footer Section (Outside the box) */}
      <footer className="contact-footer">
        <p>Created by <strong>Surabhi Nandini</strong> | 📍 Hyderabad</p>
        <p>
          📧 <a href="mailto:nandini21n71A0563@gmail.com">nandini21n71A0563@gmail.com</a>
        </p>
        <div className="footer-links">
          <a href="https://github.com/surabhinandini" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/surabhi-nandini-30aaa5276/" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </div>
      </footer>
    </>
  );
};

export default ContactPage;
