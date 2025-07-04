import { useLocation, useNavigate } from 'react-router-dom';
import React from 'react';

const ErrorPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { error_mssg, svr_error_mssg } = location.state || {};

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Oops! Something went wrong</h1>
      <p style={styles.message}>{error_mssg || 'Unknown error occurred.'}</p>

      {svr_error_mssg && (
        <p style={styles.serverMessage}>
          Server Message: {svr_error_mssg}
        </p>
      )}

      <button style={styles.button} onClick={() => navigate('/')}>
        Go to Home
      </button>
    </div>
  );
};

export default ErrorPage;

// Simple inline styles (you can replace with Tailwind, CSS modules, etc.)
const styles = {
  container: {
    padding: '2rem',
    textAlign: 'center' as const,
    backgroundColor: '#fff',
    minHeight: '100vh',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold' as const,
    color: '#c00',
  },
  message: {
    fontSize: '1.2rem',
    margin: '1rem 0',
  },
  serverMessage: {
    fontSize: '1rem',
    color: '#666',
    marginBottom: '1.5rem',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
};
