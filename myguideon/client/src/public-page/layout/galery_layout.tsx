  import React from "react";
import DestinationInfoTemplate from "./destination-poup-up-template";

// Définition des types pour les props
interface ImageCardProps {
  img: string;
  userImage: string;
}

// Composant `ImageCard`
const ImageCard: React.FC<ImageCardProps> = ({ img, userImage }) => {
  return (
    <div
      className="galeryPhotoCard"
      style={{
        backgroundImage: `url('/assets/img/destination/${img}')`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <article className="userPhoto">
        <img src={`/assets/img/destination/user/${userImage}`} alt="User" />
      </article>
    </div>
  );
};

// Composant principal `GalleryLayout`
const GalleryLayout: React.FC = () => {
  return (
    <DestinationInfoTemplate Content={GalleryLayoutContainer} />
  );
};

// Conteneur de la galerie
const GalleryLayoutContainer: React.FC = () => {
  return (
    <div>
      <article>
        <section className="d-flex top_gallery justify-content-between">
          <ImageCard img={"gal_1.png"} userImage={"user.png"} />
          <ImageCard img={"gal_2.png"} userImage={"user.png"} />
          <ImageCard img={"gal_3.png"} userImage={"user.png"} />
          <ImageCard img={"gal_4.png"} userImage={"user.png"} />
          <ImageCard img={"gal_5.png"} userImage={"user.png"} />
        </section>
        <section className="d-flex justify-content-between">
          <section className="left_gallery">
            <ImageCard img={"gal_5.png"} userImage={"user.png"} />
            <ImageCard img={"gal_3.png"} userImage={"user.png"} />
          </section>
          <section className="center_gallery">
            <video controls>
              <source
                src={
                  "https://cdn.pixabay.com/video/2016/02/29/2339-157269920_large.mp4"
                }
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </section>
          <section className="right_gallery">
            <ImageCard img={"gal_1.png"} userImage={"user.png"} />
            <ImageCard img={"gal_2.png"} userImage={"user.png"} />
          </section>
        </section>
      </article>
    </div>
  );
};

export default GalleryLayout;
