import React from "react";
import "./MenuMaker.css";

interface SectionHeaderProps {
  icon?: string;
  title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ icon, title }) => {
  return (
    <div className="section-header">
      {icon && <span className="section-header-icon">{icon}</span>}
      <h2 className="section-header-title">{title}</h2>
    </div>
  );
};

export default SectionHeader;