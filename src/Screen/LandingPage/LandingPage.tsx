import React from "react";
import "./LandingPage.css";

interface LandingPageProps {
  setLoginPop: React.Dispatch<React.SetStateAction<boolean>>;
}

const LandingPage: React.FC<LandingPageProps> = ({setLoginPop}) => {
  return (
    <div className="landing">
      <header className="landing-header">
        <h1>Blogged</h1>
        <p>Share your thoughts. Discover new voices.</p>
      </header>

      <section className="landing-preview">
        <div className="preview-card">
          <h3>✍️ Create</h3>
          <p>Write and share your blogs in seconds.</p>
        </div>
        <div className="preview-card">
          <h3>🌍 Discover</h3>
          <p>Find trending topics and follow authors.</p>
        </div>
        <div className="preview-card">
          <h3>💬 Connect</h3>
          <p>Engage with a growing community.</p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
