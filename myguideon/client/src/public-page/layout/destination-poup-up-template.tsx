import React from 'react';
import HeaderLayout from './HeaderLayout';

// Définition du type pour la prop Content
interface DestinationInfoTemplateProps {
  Content: React.ComponentType; // Spécifie que Content est un composant React
}

const DestinationInfoTemplate: React.FC<DestinationInfoTemplateProps> = ({ Content }) => {
  return (
    <div>
      <HeaderLayout />
      <section className="body">
        <section className="bg-black-transparent">
          <article className="bg-white customer-modal">
            <div className="display-flex">
              <div className="custom-modal-back">
                <img className="back-icon" src="/assets/img/back.svg" />
                <span className="back-main">Back to main</span>
              </div>
              <div className="custom-modal-title">
                <h6>USER REVIEWS & FEEDBACKS</h6>
              </div>
              <div>
                <img src="/assets/img/close.svg" />
              </div>
            </div>

            <section className="modal_container">
              {/* Modal content starts */}
              <Content />
              {/* Modal content ends */}
            </section>
          </article>
        </section>
      </section>
    </div>
  );
};

export default DestinationInfoTemplate;
