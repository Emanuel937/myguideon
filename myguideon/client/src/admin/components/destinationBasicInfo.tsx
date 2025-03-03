import React, { useState, useEffect, useContext } from "react";
import ImageUploader from "./uploadImage";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar'; // Pour afficher une alerte temporaire
import SearchSuggestion from './search_suggestion';
import languagesData from "../constants/lang.json";
import devices  from  '../constants/devices.json';
import { AppContext } from '../../main';
import country from '../constants/country.json';
import {InputAdornment, Popover, List, ListItem, ListItemText } from "@mui/material";

import {
  Box, TextField, MenuItem,
  Button, Grid
} from "@mui/material";
import HOSTNAME_WEB from '../constants/hostname';
import axios from "axios";
import AutoCompleteSuggestion from "./auto_complete_susgestion";


interface UploadedImage {
  file: File | null;
  preview: string | null;
}

interface Currency {
  code: string;
  name: string;
}


interface CurrencySelectorProps {
  formData: FormData;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}


type BasicProps = number | null;

const DestinationBasicInfo = ({ index = null }: { index?: BasicProps }) => {

  // context

  const context = useContext(AppContext); 


  if (!context) {
    throw new Error("DestinationBasicInfo doit être utilisé dans AppContext.Provider");
  }

  const { setSubmitFunction } = context;
  


  // end of context

  const restApiLink = index == null
    ? `${HOSTNAME_WEB}/destination/add/basic/info`
    : `${HOSTNAME_WEB}/destination/update/basic/info/${index}`;

  const [formData, setFormData] = useState({
    destinationName: "",
    language: [""],
    budget: "",
    currency: "USD",
    status: "Draft",
    address: "",
    categories: " ",
    lon:'',
    lat:' ',
  });


  useEffect(() => {
    setSubmitFunction(() => handleSubmit); // Met à jour la fonction dans le contexte
  }, [formData]);

  const [successAlert, setSuccessAlert]   = useState(false); // État pour l'alerte de succès
  const [weatherImage, setWeatherImage] = useState<UploadedImage>({
    file: null,
    preview: null,
  });
  const [suggestions, setSuggestions]     = useState<any[]>([]);
  const [languages, setLanguages]         = useState<string[]>([]);
  const [categories, setCategories]       = useState<string[]>([]);
  const [langueTags, setLangueTags]       = useState<string[]>([]);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filteredCurrencies, setFilteredCurrencies] = useState<{ code: string; name: string }[]>([]);

  // Filtrage des devises en fonction de l'entrée de recherche

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, currency: value }); // Met à jour formData avec la valeur entrée
    setSearchTerm(value); // Met à jour le searchTerm pour filtrer les devises

    setFilteredCurrencies(
      devices.currencies.filter(
        (currency) =>
          currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          currency.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };
  
  


  const isFormValid = () => {
    return Object.values(formData).every(value => {
      if (Array.isArray(value)) {
        return value.length > 0; // Vérifie que les tableaux ne sont pas vides
      }
      return value.toString().trim() !== ""; // Vérifie que les autres champs ne sont pas vides
    });
  };
  

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setFormData({ ...formData, address: input });

    if (input.length > 2) {
      axios.get("https://nominatim.openstreetmap.org/search", {
        params: { q: input, format: "json", addressdetails: 1, limit: 5 },
      })
        .then((response) =>{ 
          console.log(response);
          return setSuggestions(response.data)}
      )
        .catch(() => setSuggestions([]));
    } else {
      setSuggestions([]);
    }
  };

  const handlePlaceSelect = (place: any) => {
    setFormData({ ...formData, address: place.display_name, lon:place.lon, lat:place.lat });
    setSuggestions([]);
  };


  const handleSearchCurrencySelect = (code:any)=>{
    setFormData({...formData, currency:code});
    setFilteredCurrencies([]);
    
  }

  const handleFileSelect = (file: File | null) => {
    if (!file) return;
  
    const preview = URL.createObjectURL(file);
    setWeatherImage({ file, preview });
    setFormData({... formData});
   
  };
  
  

 
  const handleRemoveWeatherImage = () => {
    setWeatherImage({
      file:null,
      preview:null
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
 

  
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
  
    if (index == null) {
      if (!isFormValid()) {
        alert("Veuillez remplir tous les champs obligatoires !");
        return;
      }
    }
  
    // Créer un objet JSON au lieu d'un FormData
    const jsonData = {
      ...formData, 
      author: localStorage.getItem('userId')
    };
  
    try {
      const response = await fetch(restApiLink, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // ✅ Ajout du Content-Type
        },
        body: JSON.stringify(jsonData),
      });
  
      const result = await response.json(); // ✅ Convertir la réponse en JSON
      console.log('Réponse du serveur:', result);
  
      setSuccessAlert(true);
  
      if (index == null) {
        setFormData({
          destinationName: "",
          language: [""],
          budget: "",
          currency: "USD",
          status: "Draft",
          address: "",
          categories: " ",
          lon: "",
          lat: ""
        });
      }
  
      if (result.id) {
        localStorage.setItem("destinationId", result.id);
      } else {
        console.error("Erreur lors de l’ajout :", result);
      }
  
    } catch (error) {
      console.error("Erreur de réseau : ", error);
    }
  };

  
  const getCurrentDestination = async () => {
    try {
      const response = await fetch(`${HOSTNAME_WEB}/destination/${index}`);
      if (!response.ok) throw new Error('Erreur lors de la récupération');
  
      let data = (await response.json()).data.basic_info;
      data = JSON.parse(data);
  
      let lang: any;
  
      // Vérification et conversion de `data.language` en tableau
      if (typeof data.language === 'string') {
        lang = [data.language.toLowerCase()]; // Convertir en tableau avec la langue en minuscule
      } else if (Array.isArray(data.language)) {
        lang = [...new Set(data.language.map((l: string) => l.toLowerCase()))]; // Éliminer les doublons
      } else {
        lang = []; // Si le format est inconnu, initialiser un tableau vide
      }
  
      setFormData({ ...data });
      setLangueTags(lang);
  
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    }
  };
  


  useEffect(() => {
    fetch("/data/languages.json")
      .then((response) => response.json())
      .then((data) => setLanguages(data.languages))
      .catch(() => console.error("Erreur lors du chargement des langues"));

    if (index != null) {
      getCurrentDestination();
    }

  
  }, [index]); // Ajoutez les dépendances nécessaires


  useEffect(() => {
  }, [categories]);


  const handleAutoCompleteChange = (newTags: string[]) => {

      setLangueTags(newTags); // Met à jour l'état avec les nouveaux tags uniquement si c'est unique
  };

  // Utilisation de useEffect pour observer les changements de `tags`
  useEffect(() => {
      setFormData({...formData, language:langueTags});
      console.log(formData);
  }, [langueTags]);
  


  //filter currency


    // manager permission

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
      console.log("datdd", formData);
      allPermissions();
      handleUserProfil(localStorage.getItem('userId'))
    }, [permissions, userPrefil]);
  


    


  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3} sx={{ marginTop: "10px" }}>
          {/* Nom de la destination */}
          <Grid item xs={6}>
            <TextField
              label="Nom de la destination"
              fullWidth
              name="destinationName"
              value={formData.destinationName}
              onChange={handleChange}
              required
              sx={{ backgroundColor: "white" }}
            />
          </Grid>
            {/* Statut */}
            <Grid item xs={6}>
            <TextField
              label="Statut"
              fullWidth
              name="status"
              value={formData.status}
              onChange={handleChange}
              select
              required
            >
              {[ "Draft", "Pending validation","Published", "Disabled"]
                .filter((e) => e !== "Published" || permissions.includes("5"))
                .map((e) => (
                  <MenuItem key={e} value={e}>
                    {e}
                  </MenuItem>
                ))}

            </TextField>
          </Grid>

          <Grid item xs={6}>
            {/* Langue */}
            {/* Testing the auto complete suggestion for langue */}
            <AutoCompleteSuggestion
              placeholder="Language"
              value= {langueTags} // Valeur des tags sélectionnés
              name="language"
              queryData={languagesData.languages}
              handleChange={handleAutoCompleteChange} // Gestionnaire de changement
            />
          </Grid>
          {/* Budget */}
          <Grid item xs={6}>
            <TextField
              label="Budget"
              fullWidth
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              type="text"
              sx={{ backgroundColor: "white" }}
              required
            />
          </Grid>

          {/* Devise */}
          <Grid item xs={6} sx={{ position: "relative" }}>
              <TextField
                    label="Devise"
                    fullWidth
                    name="currency"
                    value={formData.currency} // Assurez-vous que formData.currency est lié à ce champ
                    onChange={handleSearchChange} // Mettre à jour le searchTerm et le formData
                    required
                    type="search"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          💸
                        </InputAdornment>
                      ),
                    }}
                  />
                   {/* Suggestions */}
            {filteredCurrencies.length > 0 && (
              <ul
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  width: "100%",
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  padding: 0,
                  margin: 0,
                  zIndex: 2000,
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
              >
                {filteredCurrencies.map((e) => (
                  <li
                    key={index}
                    onClick={() => handleSearchCurrencySelect(e.code)}
                    style={{
                      listStyleType: "none",
                      cursor: "pointer",
                      padding: "8px",
                      background: "#f1f1f1",
                      marginBottom: "5px",
                    }}
                  >
                    {e.name} - {e.code}
                  </li>
                ))}
              </ul>)}
                
          </Grid>

        

          {/* Adresse */}
          <Grid item xs={6} sx={{ position: "relative" }}>
            <TextField
              label="Localisation" 
              fullWidth
              name="address" 
              value={formData.address}
              onChange={handleLocationChange}
              sx={{ backgroundColor: "white" }}
              required
            />
            {/* Suggestions */}
            {suggestions.length > 0 && (
              <ul
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  width: "100%",
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  padding: 0,
                  margin: 0,
                  zIndex: 2000,
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
              >
                {suggestions.map((place, index) => (
                  <li
                    key={index}
                    onClick={() => handlePlaceSelect(place)}
                    style={{
                      listStyleType: "none",
                      cursor: "pointer",
                      padding: "8px",
                      background: "#f1f1f1",
                      marginBottom: "5px",
                    }}
                  >
                    {place.display_name}
                  </li>
                ))}
              </ul>
            )}
          </Grid>

          <Grid item xs={6}>
            <SearchSuggestion
              placeholder="Pays"
              queryData={country.countries}
              name="categories"
              handleChange={handleChange}
              value={formData.categories}
              callback={handleChange}
            />
          </Grid>

        </Grid>
      </form>

      {/* Alerte de succès */}
      <Snackbar
        open={successAlert}
        autoHideDuration={6000}
        onClose={() => setSuccessAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={() => setSuccessAlert(false)} severity="success">
          La destination a été sauvegardée avec succès !
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DestinationBasicInfo;
