import React, { useEffect, useState, useContext } from "react";
import { Button, CircularProgress } from "@mui/material";
import HOSTNAME_WEB from "../constants/hostname";
import ReactQuill from "react-quill"; // Importation de ReactQuill
import "react-quill/dist/quill.snow.css"; // Importation des styles de Quill
import { AppContext } from "../../main";

const TextEditor = ({ index = null }: { index?: any }) => {

    // initilise context
    const context = useContext(AppContext);
    if(!context){
      throw new Error('There is not context provider on App')
    }
  
    const { setSubmitFunction } = context;
  
  
  const [selectedSection, setSelectedSection] = useState<string>("0");
  const [editorContent, setEditorContent] = useState<string>(""); // Contenu HTML
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour récupérer les données selon la section
  const fetchContent = async (section: string) => {
    try {
      setIsLoading(true); // Activer le chargement
      const response = await fetch(`${HOSTNAME_WEB}/historical/${index}`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données.");
      }

      const data = await response.json();
      const parsedData = JSON.parse(data[0].historical);

      // Déterminer l'index correspondant à la section sélectionnée
      let arrayIndex = 0;

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

  // Gestion du changement de section (si applicable)
  const handleSectionChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedSection(event.target.value as string);
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
      const response = await fetch(`${HOSTNAME_WEB}/historical/add/${index}`, {
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
      <div style={{ height: "300px", marginTop: "20px" }}>
        <ReactQuill
          value={editorContent}
          onChange={setEditorContent} // Mise à jour de l'état du contenu de l'éditeur
          theme="snow" // Utilisation du thème "snow"
          placeholder="Écrivez quelque chose d'incroyable..." 
        />
      </div>
    </div>
  );
};

const Historical = ({ index }: { index: any }) => {
  return <TextEditor index={index} />;
};

export default Historical;
