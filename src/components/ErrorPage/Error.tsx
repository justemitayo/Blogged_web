import { useLocation, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import React from 'react';
import errorAnim from '../../Animations/An_Error_Occured.json'; // adjust path if needed
import './Error.css';

export default function ErrorPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { error_mssg, svr_error_mssg } = location.state || {};

  return (
    <div className="error-page-container">
      <div className="back-button-container">
        <button onClick={() => navigate(-1)} className="back-button">
          &larr; 
        </button>
      </div>

      <div className="animation-container">
        <Lottie animationData={errorAnim} loop autoplay />
      </div>

      <div>
      <h2 className="error-title">Error!</h2>
      <p className="error-message">{error_mssg || 'Something went wrong.'}</p>

      {svr_error_mssg && (
        <p className="server-message">{svr_error_mssg}</p>
      )}

      <button className="home-button" onClick={() => navigate('/')}>
        Go to Home
      </button>
      </div>
    </div>
  );
}
