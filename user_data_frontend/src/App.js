import React, { useState } from 'react';
import './App.css';
import UserDataForm from './components/UserDataForm';
import SubmissionsList from './components/SubmissionsList';

// Main app background color (Pure White minimalist)
const mainBgStyle = {
  minHeight: '100vh',
  background: '#f9fafb',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
};

// PUBLIC_INTERFACE
function App() {
  // Theme logic preserved from original
  const [theme, setTheme] = useState('light');
  const [listRefreshNonce, setListRefreshNonce] = useState(1);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    document.documentElement.setAttribute('data-theme', theme);
  };

  // Called on successful submission to refresh the list
  const handleSubmission = (success) => {
    if (success) setListRefreshNonce((n) => n + 1);
  };

  return (
    <div className="App" style={mainBgStyle}>
      <header style={{ width: '100%', textAlign: 'center', marginBottom: '16px' }}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          style={{ position: 'fixed', top: 20, right: 20, zIndex: 10 }}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <h1 style={{ color: '#374151', fontSize: '2rem', margin: '32px 0 0 0', fontWeight: 800, letterSpacing: '.02em' }}>
          User Data Collection App
        </h1>
        <p style={{ color: '#6B7280', margin: '10px 0 0', fontSize: '1.03em' }}>
          Please fill out the form and see all submissions below.
        </p>
      </header>
      <main style={{ width: '100%' }}>
        <UserDataForm onSubmission={handleSubmission} />
        <SubmissionsList triggerReload={listRefreshNonce} />
      </main>
    </div>
  );
}

export default App;
