import React, { useContext, useEffect, useState } from "react";
import { Select, MenuItem, Button, CircularProgress, FormControl, InputLabel } from "@mui/material";
import HOSTNAME_WEB from "../constants/hostname";
import { SelectChangeEvent } from "@mui/material"; // Assurez-vous que c'est bien importé
import ReactQuill from "react-quill"; // Import de ReactQuill
import "react-quill/dist/quill.snow.css"; // Import des styles de Quill
// context
import { AppContext } from "../../main";

const sections = ["A Brief Overview", "Language", "Religion"];

const TextEditor = ({ index = null }: { index?: any }) => {

  // initilise context
  const context = useContext(AppContext);
  if(!context){
    throw new Error('There is not context provider on App')
  }

  const { setSubmitFunction } = context;



  const [selectedSection, setSelectedSection] = useState<string>("Language");
  const [editorContent, setEditorContent] = useState<string>(""); // Contenu HTML
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);



  // Fonction pour récupérer les données selon la section
  const fetchContent = async (section: string) => {
    try {
      setIsLoading(true); // Activer le chargement
      const response = await fetch(`${HOSTNAME_WEB}/culture/${index}`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données.");
      }

      const data = await response.json();
      const parsedData = JSON.parse(data[0].culture);

      // Déterminer l'index correspondant à la section sélectionnée
      let arrayIndex = 0;
      if (section.toLowerCase().includes("brief")) arrayIndex = 0;
      else if (section.toLowerCase().includes("language")) arrayIndex = 1;
      else if (section.toLowerCase().includes("religion")) arrayIndex = 2;

      setEditorContent(parsedData[arrayIndex]); // Mettre à jour le contenu récupéré
      setError(null); // Réinitialiser les erreurs
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      setError("Impossible de charger le contenu.");
    } finally {
      setIsLoading(false); // Désactiver le chargement
    }
  };

  // Charger le contenu initial et après chaque changement de `selectedSection`
  useEffect(() => {
    if (selectedSection) {
      fetchContent(selectedSection);
    }
  }, [selectedSection, index]); // Déclenché à chaque changement de section ou d'index

  // Gestion du changement de section
   const handleSectionChange = (event: SelectChangeEvent<string>) => {
    setSelectedSection(event.target.value); // Pas besoin de casting ici
  };

  // Gestion de l'enregistrement des données
  const handleSave = async () => {
    if (!index || !selectedSection || !editorContent.trim()) {
      setError("Le contenu et la section doivent être remplis.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${HOSTNAME_WEB}/culture/add/${index}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: selectedSection, content: editorContent }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi des données.");
      }

      alert("Données envoyées avec succès !");
    } catch (error) {
      console.error("Erreur de communication avec le serveur :", error);
      setError("Une erreur s'est produite lors de l'envoi des données.");
    } finally {
      setIsLoading(false);
    }
  };

  //handle the context
  useEffect(()=>setSubmitFunction(()=>handleSave), [
    selectedSection, editorContent
  ]);


  return (
    <div>

      <FormControl fullWidth style={{ marginBottom: "20px", marginTop:'20px' }}>
        <InputLabel>Section</InputLabel>
        <Select value={selectedSection} onChange={handleSectionChange} label="Section">
          {sections.map((section) => (
            <MenuItem key={section} value={section}>
              {section}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <div style={{ height: "300px", marginTop: "20px" }}>
        <ReactQuill 
          value={editorContent}
          onChange={setEditorContent} // Met à jour le contenu de l'éditeur
          theme="snow" // Utilisation du thème "snow" de Quill
          placeholder="Écrivez quelque chose d'incroyable..." 
        />
      </div>

      {error && (
        <div style={{ color: "red", marginTop: "10px" }}>
          <strong>{error}</strong>
        </div>
      )}
    </div>
  );
};

const Culture = ({ index }: { index: any }) => {
  return <TextEditor index={index} />;
};

export default Culture;
