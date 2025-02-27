import React from 'react';
import HeaderLayout from './HeaderLayout';
import { useNavigate } from "react-router-dom";

// Définition du type pour la prop Content
interface DestinationInfoTemplateProps {
  Content: React.ComponentType; // Spécifie que Content est un composant React
  title:string
}

const Template: React.FC<DestinationInfoTemplateProps> = ({ Content, title }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page in history
  };
  return (
    <div>
      <HeaderLayout />
      <section className="body">
              {/* Modal content starts */}
              <Content />
      </section>
    </div>
  );
};

export default Template;
