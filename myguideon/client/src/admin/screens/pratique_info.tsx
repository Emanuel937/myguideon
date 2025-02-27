import React, { useEffect, useState, useContext } from "react";
import { Select, MenuItem, Button, CircularProgress, FormControl, InputLabel } from "@mui/material";
import HOSTNAME_WEB from "../constants/hostname";
import ReactQuill from "react-quill"; // Importation de ReactQuill
import "react-quill/dist/quill.snow.css"; // Importation des styles de Quill
import { SelectChangeEvent } from "@mui/material"; // Assure-toi d'importer ce type
import { AppContext } from "../../main";



const sections = ["Travel Safety", "Applications you should have", "Local Transportation"];

const TextEditor = ({ index = null }: { index?: any }) => {
  const [selectedSection, setSelectedSection] = useState<string>("Travel Safety");
  const [editorContent, setEditorContent] = useState<string>(""); // Contenu HTML
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


   // Modules Quill avec gestion des images, vidéos et autres formats
   const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"], // Styles de texte
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }], // Exposants et indices
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["blockquote", "code-block"], // Citation et code
      ["link", "image", "video"], // Ajout d'images et vidéos
      ["clean"], // Suppression du formatage
    ],
  };


  // Formats acceptés
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "script",
    "indent",
    "align",
    "code-block",
    "link",
    "image",
    "video",
  ];
   


    if(index == 20){
      index =localStorage.getItem('userId');
    }

  // initilise context
  const context = useContext(AppContext);
  if(!context){
    throw new Error('There is not context provider on App')
  }

  const { setSubmitFunction } = context;

  // Fonction pour récupérer les données selon la section
  const fetchContent = async (section: string) => {
    try {
      setIsLoading(true); // Activer le chargement
      const response = await fetch(`${HOSTNAME_WEB}/pratique/info/${index}`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données.");
      }

      const data = await response.json();
      const parsedData = JSON.parse(data[0].info);

      // Déterminer l'index correspondant à la section sélectionnée
      let arrayIndex = 0;
      if (section.toLowerCase().includes("traveil")) arrayIndex = 0;
      else if (section.toLowerCase().includes("applications")) arrayIndex = 1;
      else if (section.toLowerCase().includes("transportation")) arrayIndex = 2;
       
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
 // Mettre à jour la section sélectionnée
 const handleSectionChange = (event: SelectChangeEvent<string>) => {
  setSelectedSection(event.target.value); // Pas besoin de casting ici
};

  // Gestion de l'enregistrement des données
  const handleSave = async () => {
    alert('well....');
    if (!index || !selectedSection || !editorContent.trim()) {
      setError("Le contenu et la section doivent être remplis.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${HOSTNAME_WEB}/pratique/info/add/${index}`, {
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
          onChange={setEditorContent} // Mise à jour de l'état du contenu de l'éditeur
          theme="snow" // Utilisation du thème "snow"
          placeholder="Écrivez quelque chose d'incroyable..." 
          modules={modules}
          formats={formats}
        />
      </div>
    </div>
  );
};

const PratiqueInfo = ({ index }: { index: any }) => 
{
  return <TextEditor index={index} />;
};

export default PratiqueInfo;
