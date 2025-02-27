import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from "../../main";
import { Box, Button, Typography } from "@mui/material";
import { Link } from 'react-router-dom';
import HOSTNAME_WEB from '../constants/hostname';

const SmallHeader = ({ setBackButton = false, title, link = null }: { setBackButton?: boolean, title: string, link: null | string }) => {
  // Utilisation du contexte
  const context = useContext(AppContext);
  const navigate = useNavigate();
  
  // Assurez-vous que le contexte est bien présent
  if (!context) {
    throw new Error("DestinationBasicInfo doit être utilisé dans AppContext.Provider");
  }

  const { submitFunction } = context;

  // État de chargement pour les opérations
  const [loading, setLoading] = useState(false);

  // Gestion du stockage local
  const storedId = localStorage.getItem("destinationId");

  // Navigation vers la page de prévisualisation si le lien est défini
  const handlePreviewClick = () => {
    if (link) {
      navigate(link);
    }
  };

  // Fonction de sauvegarde avec gestion du chargement
  const handleSave = async () => {
    setLoading(true);  // Affichage du chargement pendant l'enregistrement
    try {
      await submitFunction();  // Appel de la fonction de soumission (assurez-vous qu'elle soit asynchrone)
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      alert("Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setLoading(false);  // Désactivation de l'état de chargement après l'opération
    }
  };
   
//manager the activities

const [permissions, setPermissions] =  useState("");
const [userPrefil, setUserPrefil]   = useState(" ");

const handleUserProfil = (userID: any) => {

  fetch(`${HOSTNAME_WEB}/profil/user_profil/${userID}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error fetching user profile');
      }
      return response.json();
    })
    .then((response) => {
      setUserPrefil(response[0][0].profil_id);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};

const allPermissions = () => {
  fetch(`${HOSTNAME_WEB}/profil/`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('There is an error');
      }
      return response.json();
    })
    .then((response) => {
      console.log(permissions);
      // Assuming "data.message" is an array and you want to modify it
      const filteredPermissions = response.message.filter((element:any) =>  {
        
        if(element.id.toString() == userPrefil.toString()){
          return element
        }
      
      }
    
    )
         setPermissions(filteredPermissions[0].permissions);
    
    })
    .catch((error) => {
      console.error('Error:', error);
    });

};

useEffect(()=>{
  allPermissions();
  handleUserProfil(localStorage.getItem('userId'))
}, [permissions, userPrefil]);

  return (
    <Box display="flex" justifyContent="space-between" sx={{
      backgroundColor: 'white',
      padding: '5px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      marginBottom: '40px',
      width: '100%',
    }}>
      <Box display="flex">
        {setBackButton && (
          <button
            className="btn border text-dark m-2"
            onClick={() => navigate(-1)}  // Retour à la page précédente
          >
            <i className="bi bi-arrow-left"></i> Back
          </button>
        )}
        <Typography variant="h5" className="m-2" sx={{ fontSize: '15px', paddingTop: '10px' }}>
          {title}
        </Typography>
      </Box>

      <Box>
        {/** link && (
          <button
            className="btn border text-dark m-2"
            onClick={handlePreviewClick}  // Navigation vers la prévisualisation
          >
            Preview
          </button>
        ) **/}
        
        <Button
          type="submit"
          className="btn border text-white m-2 bg-success"
          onClick={handleSave}  // Appel de la fonction de sauvegarde
          disabled={loading}  // Désactivation du bouton pendant le chargement
        >
          {loading ? 'Enregistrement...' : 'Enregistrer'} <i className="bi bi-save"></i>
        </Button>
      </Box>
    </Box>
  );
};

export default SmallHeader;
