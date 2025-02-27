import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../main";
import {
  Box,
  Grid,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import { Alert, Typography } from "@mui/joy";
import HOSTNAME_WEB from "../constants/hostname";

interface MediaItem {
  id: string;
  name: string;
  type: "image" | "video";
  url: string;
  isCover: boolean;
  file: File;
}



type BasicProps = number | null;

const Media = ({ index = null }: { index?: BasicProps }) => {


  var formData = new FormData();

  // Context
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("Galery doit être utilisé dans AppContext.Provider");
  }

  const { setSubmitFunction }     = context;

  // States
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [viewMode, setViewMode]   = useState<"grid" | "list">("grid");
  const [coverId, setCoverId]     = useState<string | null>(null);
  const [coverName, setCoverName] = useState<string>("");
  const [error, setError]         = useState(false);
  const [ghostMediaLiast, setGhostMediaList] =  useState<MediaItem[]>([]);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);


  // Récupérer `destinationId` depuis le localStorage
  const storedId                 = localStorage.getItem("destinationId");
  const destinationId            = storedId ? Number(storedId) : null;

  // Charger les fichiers depuis `sessionStorage`
  useEffect(() => {
    const savedMedia = sessionStorage.getItem("mediaList");
    if (savedMedia) {
      setMediaList(JSON.parse(savedMedia));
    }
  }, []);

  // Sauvegarder `mediaList` dans `sessionStorage`
  useEffect(() => {
    sessionStorage.setItem("mediaList", JSON.stringify(mediaList));
  }, [mediaList]);

  // Fonction pour gérer l'upload
  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const newMedia: MediaItem = {
          id: `${Date.now()}-${file.name}`,
          name: file.name,
          type: file.type.startsWith("image") ? "image" : "video",
          url: URL.createObjectURL(file),
          isCover: false,
          file,
        };

        setMediaList((prev) => [...prev, newMedia]);
      });
    }
  };

  const handleDelete = (id: string) => {
    const item = mediaList.find((media) => media.id === id);
    if (item) {
      setDeletedImages((prev) => [...prev, item.url]);  // Ajouter l'URL de l'image supprimée
    }
    setMediaList((prev) => prev.filter((media) => media.id !== id));
  
    if (id === coverId) {
      setCoverId(null);
      setCoverName("");
    }
    console.log(deletedImages);
  };
  

  // Fonction pour définir une image comme couverture
  const handleSetCover = (id: string) => {
    const coverItem = mediaList.find((item) => item.id === id);
    if (coverItem) {
      setCoverName(coverItem.name);
      setCoverId(id);
      setMediaList((prev) =>
        prev.map((item) => ({
          ...item,
          isCover: item.id === id,
        }))
      );
    }
  };

  const handleGallery = (id:any)=>{

    const response = fetch(`${HOSTNAME_WEB}/destination/${id}`)
    .then((response)=>{
      if(!response.ok){
        throw new Error(" there is an error");
      }
      return response.json();
    })
    .then((response)=>{

      var initGalleryArray = JSON.parse(response.data.gallery);

      
        var test = initGalleryArray.map((e: any, index: number) => ({
          id: index,
          name: `${Date.now()}-${index}`,
          url: e,
          type:'image'
        }))
      

      setMediaList([...test]);
      console.log('data data :', mediaList);

    })
    .catch((error)=>{
      console.log(error);
    })
  }



  // Fonction d'envoi des fichiers au serveur
  const handleSubmit = async () => {

    if (mediaList.length <= 7) {
      setError(true); // Affiche l'erreur si moins de 7 fichiers
      return false;
    }
    setError(false); 

    if (true) {
      setError(false);
      try {
      
        mediaList.forEach((item) => {
          formData.append("files", item.file);
          formData.append("names", item.name);
        });

        if (coverId) {
          formData.append("cover", coverName);
        }

        formData.append("deletedImages", JSON.stringify(deletedImages));
        
        const idToUse = index == null ? destinationId : index;
        const response = await fetch(
          `${HOSTNAME_WEB}/destination/update/gallery/${idToUse}`,
          {
            method: "POST",
            body: formData,
            headers: {
              Accept: "application/json",
            },
          }
        );
         
        console.log('data before go to database is :', setMediaList);
        if (response.ok) {
          setMediaList([]);
          sessionStorage.removeItem("mediaList");
          setCoverId(null);
          setCoverName("");
        } else {
          throw new Error("Erreur lors de l'envoi des fichiers.");
        }
      } catch (error) {
        console.error("Erreur :", error);
      }
      setError(false);
    }
  };

  // Associer `handleSubmit` au contexte au montage
  useEffect(() => {
    setSubmitFunction(() => handleSubmit);
  }, [formData]);
  


  useEffect(() => {
    if (index != null) { 
        handleGallery(index);
    }
}, [index]); // ✅ Ne dépend que de index, pas de mediaList

useEffect(() => {
  console.log("Updated mediaList:", mediaList);
}, [mediaList]);



  return (
    <Box sx={{ p: 2, bgcolor: "#f9f9f9", borderRadius: 2, position: "relative" }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 5 }}>
        <Box sx={{ mt: 3 }}>
          <Alert color="warning">
            *** Vous devez uploader au moins 8 photos :
          </Alert>
        </Box>
        <Box>
          <Button
            startIcon={<ViewModuleIcon />}
            onClick={() => setViewMode("grid")}
            variant={viewMode === "grid" ? "contained" : "outlined"}
            sx={{ mr: 1 }}
          >
            Grid
          </Button>
          <Button
            startIcon={<ViewListIcon />}
            onClick={() => setViewMode("list")}
            variant={viewMode === "list" ? "contained" : "outlined"}
            sx={{ mr: 1 }}
          >
            List
          </Button>
        </Box>
      </Box>

      {/* Uploader */}
      <Box sx={{ mb: 3 }}>
        <input
          type="file"
          multiple
          onChange={handleUpload}
          style={{ display: "none" }}
          id="upload-input"
        />
        <label htmlFor="upload-input">
          <Button variant="outlined" component="span">
            Upload Media
          </Button>
        </label>
      </Box>
      {error == true && (
        <Typography sx={{ color: "red" }}>
          **** Vous devez uploader au moins 8 photos....
        </Typography>
      )}

      {/* Media Display */}
      {viewMode === "grid" ? (
        <Grid container spacing={2}>
          {mediaList.map((item) => (
            <Grid item xs={2} sm={3} md={3} key={item.id}>
              <Box
                sx={{
                  position: "relative",
                  bgcolor: "#fff",
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: 1,
                  "&:hover": { boxShadow: 3 },
                }}
              >
                {item.type === "image" ? (
                  <img
                    src={item.url.startsWith("/") ? `${HOSTNAME_WEB}${item.url}`:item.url}
                    alt={item.name}
                    style={{ width: "100%", height: "200px", display: "block" }}
                  />
                ) : (
                  <video src={item.url} controls style={{ width: "100%" }} />
                )}

                {/* Checkbox Cover */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={item.id === coverId}
                      onChange={() => handleSetCover(item.id)}
                    />
                  }
                  label="Cover"
                  sx={{
                    position: "absolute",
                    bottom: 8,
                    left: 8,
                    bgcolor: "rgba(255, 255, 255, 0.8)",
                    borderRadius: 1,
                    px: 1,
                  }}
                />

                {/* Bouton Supprimer */}
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    bgcolor: "rgba(255, 255, 255, 0.8)",
                  }}
                  onClick={() => handleDelete(item.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <List>
          {mediaList.map((item) => (
            <ListItem key={item.id} secondaryAction={
              <IconButton edge="end" onClick={() => handleDelete(item.id)}>
                <DeleteIcon />
              </IconButton>
            }>
              <Avatar variant="square" src={item.url} alt={item.name} sx={{ width: 40, height: 40, mr: 2 }} />
              <ListItemText primary={item.name} />
              <FormControlLabel control={<Checkbox checked={item.id === coverId} onChange={() => handleSetCover(item.id)} />} label="Cover" />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default Media;
