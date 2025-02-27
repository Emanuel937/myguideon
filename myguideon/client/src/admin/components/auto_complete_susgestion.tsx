import React, { useState, useEffect } from "react";
import { Autocomplete, TextField, Box, Chip } from "@mui/material";

// Composant SearchSuggestion
const AutoCompleteSuggestion: React.FC<{
  placeholder: string;
  name: string;
  queryData: string[];
  value: string[];
  handleChange: (newTags: string[]) => void; // Passage du tableau des tags directement
}> = ({ placeholder, name, queryData, value, handleChange }) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  useEffect(() => {
    // Afficher les suggestions uniquement après avoir tapé au moins une lettre
    if (inputValue.length > 0) {
      const filtered = queryData.filter((item) =>
        item.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]); // Réinitialiser si le champ est vide
    }
  }, [inputValue, queryData]);

  return (
    <Box>
      <Autocomplete
        multiple // Permet de sélectionner plusieurs tags
        freeSolo // Permet d'ajouter un tag personnalisé
        options={filteredSuggestions} // Utilisation des suggestions filtrées
        value={value}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue); // Mise à jour de l'état local pour la saisie
        }}
        onChange={(event, newValue) => {
          // Lorsque l'utilisateur sélectionne une suggestion
          handleChange(newValue); // Met à jour directement le tableau des tags
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{ backgroundColor: "white" }}
            label={placeholder}
            variant="outlined"
            name={name}
            value={inputValue} // Valeur du champ de texte
            onChange={(e) => {
              setInputValue(e.target.value); // Mise à jour de l'état local
            }}
          />
        )}
        renderTags={(value, getTagProps) =>
          value.map((tag, index) => (
            <Chip
              label={tag}
              {...getTagProps({ index })}
              style={{ margin: 2 }}
            />
          ))
        }
        ListboxProps={{
          style: {
            maxHeight: 200, // Limite la hauteur de la liste des suggestions
            overflowY: 'auto', // Permet le défilement vertical
          }
        }}
      />
    </Box>
  );
};


export default AutoCompleteSuggestion;