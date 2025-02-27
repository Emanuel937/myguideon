/**
 * This component is used to display photos of destinations on the first page of the destination.
 * All first pages of every section are named index.
 */

import React from 'react';



interface SmallDestinationPhotoProps {
    onClick: (src: string) => void; // Fonction pour gérer le clic avec le src de l'image
    img: string; // Source de l'image à afficher
  }

const SmallDestinationPhoto = ({ img, onClick, }: SmallDestinationPhotoProps) => {

    return (
        <div className="smallPhoto">
            <img
                alt="destination photo"
                src={img}
                onClick={(e) => onClick((e.target as HTMLImageElement).src)} 
            />
        </div>
    );
};

interface LargestDestinationPhotoProps {
    imageName: string;
}

const LargestDestinationPhoto: React.FC<LargestDestinationPhotoProps> = ({ imageName }) => {
    return (
        <div className="bigPhoto">
            <img
                src={imageName}
                alt="the biggest destination photo"
            />
        </div>
    );
};

export { SmallDestinationPhoto, LargestDestinationPhoto };
