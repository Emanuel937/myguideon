import React, { useState } from "react";
import { Box, TextField, List, ListItem, ListItemButton, ListItemText } from "@mui/material";

interface SearchSuggestionInterface {
    placeholder: string;
    name: string;
    queryData: string[];
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    callback: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value:string|null
}

const SearchSuggestion: React.FC<SearchSuggestionInterface> = ({
    placeholder,
    name,
    queryData,
    handleChange,
    callback,
    value
}) => {
    const [query, setQuery] = useState(""); // État pour la valeur de l'entrée
    const [suggestions, setSuggestions] = useState<string[]>([]); // État pour les suggestions

    const locations = queryData; // Données locales pour les suggestions

    // Fonction pour gérer la saisie utilisateur
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        setQuery(input);
        handleChange(e);

        // Filtrer les suggestions
        if (input.length > 1) {
            const filteredSuggestions = locations.filter((location) =>
                location.toLowerCase().includes(input.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]); // Réinitialiser les suggestions si le texte est court
        }
    };

    // Fonction pour sélectionner une suggestion
    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion); // Mettre à jour l'affichage
        setSuggestions([]); // Vider les suggestions

        // Créer un événement personnalisé pour appeler handleChange
        const customEvent = {
            target: {
                name,
                value: suggestion,
            },
        } as React.ChangeEvent<HTMLInputElement>;

        handleChange(customEvent); // Appeler la fonction avec l'événement simulé
    };

    return (
        <Box sx={{ position: "relative" }}>
            {/* Champ de recherche */}
            <TextField
                fullWidth
                label={placeholder}
                variant="outlined"
                value={value}
                onChange={handleSearchChange}
                placeholder={placeholder}
                name={name}
                className="bg-white"
            />

            {/* Suggestions */}
            {suggestions.length > 0 && (
                <List
                    className="bg-white"
                    sx={{
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        marginTop: "10px",
                        position: "absolute",
                        top: "100%",
                        zIndex: "500",
                        left: "0",
                        right: 0,
                    }}
                >
                    {suggestions.map((suggestion, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton onClick={() => handleSuggestionClick(suggestion)}>
                                <ListItemText primary={suggestion} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
};

export default SearchSuggestion;
