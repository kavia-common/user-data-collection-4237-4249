import React, { useState, useEffect } from 'react';

// Reuse color variables
const styleVars = {
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '1.75rem 2.1rem 1.2rem 2.1rem',
    maxWidth: '470px',
    margin: '32px auto',
    boxShadow: '0 2px 16px rgba(55,65,81,0.08)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  heading: {
    color: '#374151',
    fontWeight: 700,
    fontSize: '1.18rem',
    marginBottom: '0.9rem',
    letterSpacing: '.01em'
  },
  list: {
    listStyle: 'none',
    padding: 0,
    width: '100%'
  },
  item: {
    background: '#f9fafb',
    padding: '14px 12px',
    margin: '0.5rem 0',
    borderRadius: '8px',
    color: '#111827',
    boxShadow: '0 0.5px 2px rgba(55,65,81,0.02)'
  },
  itemLabel: {
    fontWeight: 600,
    marginRight: '5px'
  },
  error: {
    background: '#EF4444',
    color: '#fff',
    borderRadius: '6px',
    width: '100%',
    padding: '8px 0px',
    margin: '0.4rem 0'
  },
  loading: {
    color: '#374151',
    margin: '1rem 0'
  }
};

// PUBLIC_INTERFACE
function SubmissionsList({ triggerReload }) {
  /** Fetch and display the user-data submissions list. 
      triggerReload (number): Can be incremented by parent to force re-fetch (e.g., after submission)
  */
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // Effect for fetching
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setErrorMsg(null);

    fetch('http://localhost:3001/api/user-data/', {
      method: 'GET'
    })
      .then(async resp => {
        if (!resp.ok) {
          let msg;
          try {
            const d = await resp.json();
            msg = d.error || resp.statusText;
          } catch { msg = resp.statusText; }
          throw new Error(msg);
        }
        return resp.json();
      })
      .then(data => {
        if (isMounted) {
          setList(Array.isArray(data) ? data : []);
        }
      })
      .catch(err => {
        if (isMounted) setErrorMsg('Error: ' + (err && err.message ? err.message : 'Failed to fetch submissions'));
      })
      .finally(() => isMounted && setLoading(false));
    return () => { isMounted = false; };
  }, [triggerReload]);

  return (
    <div style={styleVars.card} aria-live="polite" aria-busy={loading}>
      <div style={styleVars.heading}>Submissions</div>
      {loading && <div style={styleVars.loading}>Loading...</div>}
      {errorMsg && <div style={styleVars.error} role="alert">{errorMsg}</div>}
      <ul style={styleVars.list} aria-label="Submissions List">
        {!loading && !errorMsg && list.length === 0 && (
          <li style={{ color: "#6B7280", fontSize: '.97em', padding: "8px 0" }}>No submissions yet.</li>
        )}
        {!loading && !errorMsg && list.map((entry, idx) => (
          <li key={idx} style={styleVars.item}>
            <span style={styleVars.itemLabel}>Name:</span> {entry.name}<br />
            <span style={styleVars.itemLabel}>Email:</span> {entry.email}<br />
            <span style={styleVars.itemLabel}>Age:</span> {String(entry.age)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SubmissionsList;
