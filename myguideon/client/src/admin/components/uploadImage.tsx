import { useState } from "react";
import {Box, Typography} from '@mui/material';

// Composant pour gérer le téléchargement d'images
const ImageUploader = ({
    label,
    onFileSelect,
    maxSize = 5 * 1024 * 1024, // 5 MB
    minSize = 10 * 1024, // 10 KB
  }: {
    label: string;
    onFileSelect: (file: File | null) => void;
    maxSize?: number;
    minSize?: number;
  }) => {
    const [error, setError] = useState<string | null>(null);
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (file.size > maxSize) {
          setError("La taille maximale est de 5 MB.");
          onFileSelect(null);
          return;
        }
        if (file.size < minSize) {
          setError("La taille minimale est de 10 KB.");
          onFileSelect(null);
          return;
        }
        setError(null);
        onFileSelect(file);
      } else {
        setError("Aucun fichier sélectionné.");
        onFileSelect(null);
      }
    };
  
    return (
      <Box>
        <Typography variant="subtitle1" fontWeight="bold" mb={1}>
          {label}
        </Typography>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{
            display: "block",
            padding: 4,
            border: "1px solid #ddd",
            borderRadius: 4,
            width: "50%",
          }}
        />
        {error && (
          <Typography variant="caption" color="error">
            {error}
          </Typography>
        )}
      </Box>
    );
  };
  

  export default ImageUploader;