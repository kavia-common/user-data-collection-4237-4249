import React, { useState } from 'react';
import { buildApiUrl, apiFetch } from '../utils/apiConfig';

// Pure White minimalist style variables
const styleVars = {
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '2rem',
    maxWidth: '370px',
    margin: '32px auto',
    boxShadow: '0 2px 16px rgba(55,65,81,0.08)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  heading: {
    color: '#374151',
    fontWeight: 700,
    fontSize: '1.35rem',
    marginBottom: '1.2rem',
    letterSpacing: '.01em'
  },
  input: {
    width: '100%',
    padding: '0.66rem 0.8rem',
    border: '1px solid #E5E7EB',
    borderRadius: '6px',
    fontSize: '1rem',
    color: '#374151',
    marginBottom: '8px',
    outline: 'none',
    background: '#f9fafb'
  },
  button: {
    width: '100%',
    background: '#374151',
    color: '#fff',
    fontWeight: 600,
    fontSize: '1.08rem',
    border: 'none',
    padding: '0.85rem',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '6px',
    transition: 'background 0.2s'
  },
  buttonDisabled: {
    background: '#9CA3AF',
    cursor: 'not-allowed'
  },
  success: {
    background: '#10B981',
    color: '#fff',
    borderRadius: '5px',
    padding: '8px 12px',
    margin: '8px 0',
    fontSize: '0.95rem'
  },
  error: {
    background: '#EF4444',
    color: '#fff',
    borderRadius: '5px',
    padding: '8px 12px',
    margin: '8px 0',
    fontSize: '0.95rem'
  },
  label: {
    fontWeight: 500,
    color: '#374151',
    display: 'block',
    marginBottom: '5px',
    textAlign: 'left',
    width: '100%'
  },
  fieldRow: {
    width: '100%',
    marginBottom: '20px'
  }
};

// Validation helper (simple email regex)
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// PUBLIC_INTERFACE
/**
 * User form for submitting name, email, age.
 * 
 * @param {function} onSubmission - Callback called after submission attempt with success boolean
 */
function UserDataForm({ onSubmission }) {
  const [fields, setFields] = useState({ name: '', email: '', age: '' });
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  // Validation logic
  const errors = {};
  if (!fields.name.trim()) errors.name = "Name is required";
  if (!fields.email.trim()) errors.email = "Email is required";
  else if (!validateEmail(fields.email.trim())) errors.email = "Must be a valid email";
  if (fields.age === '') errors.age = "Age is required";
  else if (!/^\d+$/.test(fields.age.trim())) errors.age = "Age must be a number";
  else {
    const ageNum = parseInt(fields.age, 10);
    if (ageNum < 1 || ageNum > 150) errors.age = "Age must be between 1 and 150";
  }

  const canSubmit = Object.keys(errors).length === 0 && !submitting;

  // Handle change/event
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields(f => ({ ...f, [name]: value }));
  };

  const handleBlur = (e) => {
    setTouched(t => ({ ...t, [e.target.name]: true }));
  };

  // PUBLIC_INTERFACE
  /**
   * Handle form submission
   * Validates data and sends to backend API
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, age: true });
    if (!canSubmit) return;
    
    setSubmitting(true);
    setAlert(null);

    try {
      const url = buildApiUrl('/api/user-data/');
      const payload = {
        name: fields.name.trim(),
        email: fields.email.trim(),
        age: parseInt(fields.age, 10)
      };

      await apiFetch(url, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      setAlert({ type: 'success', msg: 'Submission successful!' });
      setFields({ name: '', email: '', age: '' });
      setTouched({});
      if (onSubmission) onSubmission(true);
    } catch (err) {
      const errorMsg = err && err.message ? err.message : "Submission failed";
      setAlert({ type: 'error', msg: errorMsg });
      if (onSubmission) onSubmission(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form style={styleVars.card} autoComplete="off" onSubmit={handleSubmit} aria-label="User Data Form">
      <div style={styleVars.heading}>Submit User Data</div>
      {alert && (
        <div
          role="alert"
          style={alert.type === "success" ? styleVars.success : styleVars.error}>
          {alert.msg}
        </div>
      )}
      <div style={styleVars.fieldRow}>
        <label htmlFor="form-name" style={styleVars.label}>Name</label>
        <input
          style={styleVars.input}
          id="form-name"
          name="name"
          type="text"
          value={fields.name}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={submitting}
          aria-required="true"
          aria-invalid={!!(touched.name && errors.name)}
         />
        {touched.name && errors.name && (
          <div style={{ color: '#EF4444', fontSize: '.91em', marginTop: '2px', textAlign: 'left', width: '100%' }}>{errors.name}</div>
        )}
      </div>
      <div style={styleVars.fieldRow}>
        <label htmlFor="form-email" style={styleVars.label}>Email</label>
        <input
          style={styleVars.input}
          id="form-email"
          name="email"
          type="email"
          value={fields.email}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={submitting}
          aria-required="true"
          aria-invalid={!!(touched.email && errors.email)}
        />
        {touched.email && errors.email && (
          <div style={{ color: '#EF4444', fontSize: '.91em', marginTop: '2px', textAlign: 'left', width: '100%' }}>{errors.email}</div>
        )}
      </div>
      <div style={styleVars.fieldRow}>
        <label htmlFor="form-age" style={styleVars.label}>Age</label>
        <input
          style={styleVars.input}
          id="form-age"
          name="age"
          type="number"
          min={1}
          max={150}
          value={fields.age}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={submitting}
          aria-required="true"
          aria-invalid={!!(touched.age && errors.age)}
        />
        {touched.age && errors.age && (
          <div style={{ color: '#EF4444', fontSize: '.91em', marginTop: '2px', textAlign: 'left', width: '100%' }}>{errors.age}</div>
        )}
      </div>
      <button
        style={
          canSubmit
            ? styleVars.button
            : { ...styleVars.button, ...styleVars.buttonDisabled }
        }
        type="submit"
        disabled={!canSubmit}
        aria-disabled={!canSubmit}
      >
        {submitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}

export default UserDataForm;
