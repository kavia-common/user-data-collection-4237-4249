import React, { useState } from 'react';

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
    background: '#9CA3AF', // disabled gray
    cursor: 'not-allowed'
  },
  success: {
    background: '#10B981',
    color: '#fff',
    borderRadius: '5px',
    padding: '8px 0px',
    margin: '8px 0'
  },
  error: {
    background: '#EF4444',
    color: '#fff',
    borderRadius: '5px',
    padding: '8px 0px',
    margin: '8px 0'
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
  // rfc5322 official looks too complex; this is a simple version for UI
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// PUBLIC_INTERFACE
function UserDataForm({ onSubmission }) {
  /** User form for submitting name, email, age.
  *  onSubmission(success) - called after successful post
  */
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
  else if (!/^\d+$/.test(fields.age.trim())) errors.age = "Age must be a non-negative integer";
  else if (parseInt(fields.age, 10) < 0) errors.age = "Age must be >= 0";

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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, age: true });
    if (!canSubmit) return;
    setSubmitting(true);
    setAlert(null);

    try {
      const resp = await fetch('http://localhost:3001/api/user-data/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fields.name.trim(), email: fields.email.trim(), age: parseInt(fields.age, 10) })
      });

      if (resp.ok) {
        setAlert({ type: 'success', msg: 'Submission successful!' });
        setFields({ name: '', email: '', age: '' });
        setTouched({});
        if (onSubmission) onSubmission(true);
      } else {
        let message;
        try {
          const data = await resp.json();
          message = data.error || resp.statusText;
        } catch {
          message = resp.statusText;
        }
        throw new Error(message);
      }
    } catch (err) {
      setAlert({ type: 'error', msg: 'Error: ' + (err && err.message ? err.message : "Submission failed") });
      if (onSubmission) onSubmission(false);
    }
    setSubmitting(false);
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
          min={0}
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
