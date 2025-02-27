// Ce fichier gère tous les composants utilisés sur la page de destination

// Interface pour la carte d'ensemble (OverrallCard)
interface OverrallCardInterface {
    note: string;
    colorNote: string;
    title: string;
    bg?: string; // Propriété optionnelle
    src?: string; // Propriété optionnelle
  }
  
  // Composant OverrallCard
  const OverrallCard: React.FC<OverrallCardInterface> = ({
    note,
    colorNote,
    title,
    bg = "white",
    src = "/assets/img/person_star.svg",
  }) => {
    let color = "white";
    let infoIcon = "/assets/img/info.svg";
  
    if (bg === "white") {
      color = "black";
      infoIcon = "/assets/img/info_gray.svg";
    }
  
    return (
      <div className="overall_card" style={{ backgroundColor: bg }}>
        <div>
          <div className="d-flex justify-content-between">
            <img src={src} alt="Card icon" />
            <h4 className="col-md-6 overall_note" style={{ color: colorNote }}>
              {note}
            </h4>
          </div>
        </div>
        <p className="overall_title" style={{ color }}>{title}</p>
        <div className="text-end">
          <img src={infoIcon} alt="Info icon" />
        </div>
      </div>
    );
  };
  
  // Composant UserReviewPhoto (Photo utilisateur)
  const UserReviewPhoto: React.FC = () => {
    return (
      <section className="maxMinHeight">
        <article>
          <p className="photo vertical_center_content">
            <img src="/assets/img/user_1.jpg" alt="User" />
            Richard Abhiana
          </p>
        </article>
      </section>
    );
  };
  
  // Composant ReviewLocation (Lieu de l'avis)
  const ReviewLocation: React.FC = () => {
    return (
      <section className="location vertical_center_content maxMinHeight">
        <h5 className="name">Ranchers</h5>
        <p className="city">Maldives</p>
      </section>
    );
  };
  
  // Interface pour les avis avec étoiles
  interface ReviewStarAndRatingProps {
    rating?: number; // Optionnel avec une valeur par défaut
  }
  
  // Composant ReviewStarAndRating (Étoiles et note)
  const ReviewStarAndRating: React.FC<ReviewStarAndRatingProps> = ({ rating = 0 }) => {
    const generateStars = (rating: number, maxStars = 10) => {
      const fullStar = <i className="bi bi-star-fill"></i>;
      const halfStar = <i className="bi bi-star-half"></i>;
      const emptyStar = <i className="bi bi-star"></i>;
  
      const stars = [];
      for (let i = 1; i <= maxStars; i++) {
        if (rating >= i) {
          stars.push(fullStar);
        } else if (rating >= i - 0.5) {
          stars.push(halfStar);
        } else {
          stars.push(emptyStar);
        }
      }
      return stars;
    };
  
    return (
      <div className="vertical_center_content star maxMinHeight">
        <p className="text-warning startHeight">
          {generateStars(rating).map((star, index) => (
            <span key={index}>{star}</span>
          ))}
        </p>
        <div>
          <p>
            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.
            Velit officia consequat duis enim velit.
          </p>
        </div>
      </div>
    );
  };
  
  // Interface pour les avis étoilés
  interface OnlyReviewStarProps {
    rating: number;
    ratingTotal?: number; // Optionnel
  }
  
  // Composant OnlyReviewStar (Avis étoilé global)
  const OnlyReviewStar: React.FC<OnlyReviewStarProps> = ({ rating, ratingTotal = 0 }) => {
    const generateStars = (rating: number, maxStars = 10) => {
      const fullStar = <i className="bi bi-star-fill star-big"></i>;
      const halfStar = <i className="bi bi-star-half star-big"></i>;
      const emptyStar = <i className="bi bi-star star-big"></i>;
  
      const stars = [];
      for (let i = 1; i <= maxStars; i++) {
        if (rating >= i) {
          stars.push(fullStar);
        } else if (rating >= i - 0.5) {
          stars.push(halfStar);
        } else {
          stars.push(emptyStar);
        }
      }
      return stars;
    };
  
    return (
      <div className="vertical_center_content star miHeight">
        <p className="text-warning startHeight">
          {generateStars(rating).map((star, index) => (
            <span key={index}>{star}</span>
          ))}
          <span className="avarage">
            {rating}/10 ({ratingTotal})
          </span>
        </p>
      </div>
    );
  };
  
  // Interface pour la barre de progression
  interface ProgressBarProps {
    statQTY: number;
    progres_per_cent: number;
  }
  
  // Composant ProgressBar
  const ProgressBar: React.FC<ProgressBarProps> = ({ statQTY, progres_per_cent }) => {
    return (
      <div className="d-flex progress_content">
        <p className="start-single">
          <i className="bi bi-star-fill star-big"></i>
        </p>
        <p className="starQTY">{statQTY} Star</p>
        <div className="progress">
          <div
            className="progress-bar"
            role="progressbar"
            aria-valuenow={progres_per_cent}
            aria-valuemin={0}
            aria-valuemax={100}
            style={{ width: `${progres_per_cent}%` }}
          ></div>
        </div>
      </div>
    );
  };
  
  // Exportation de tous les composants
  export {
    OverrallCard,
    UserReviewPhoto,
    ProgressBar,
    ReviewLocation,
    OnlyReviewStar,
    ReviewStarAndRating,
  };
  