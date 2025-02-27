import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Grid,
  Typography,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import axios from 'axios';
import HOSTNAME_WEB from '../constants/hostname'

type Category = {
  id: number;
  categories_name: string;
  description: string;
  image: File | null;
  imageUrl: string;
  parentId: number | null;
};



const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category>({
    id: Date.now(),
    categories_name: '',
    description: '',
    image: null,
    imageUrl: '',
    parentId: null,
  });
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [mode, setMode]= useState<Boolean| null>(null);



  useEffect(() => {
    fetchCategories();
  }, []);

  // Fonction pour charger les catégories depuis la base de données
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${HOSTNAME_WEB}/categories`);
  
      if (response.status === 200) {
        setCategories(response.data); // Charger les catégories depuis la base de données
      } else {
        console.log("Erreur lors du chargement des catégories");
      }
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  // Fonction pour ajouter ou mettre à jour une catégorie
  const handleAddOrUpdateCategory = async () => {
    if (!currentCategory.categories_name) return;

    const formData = new FormData();
    formData.append('name', currentCategory.categories_name);
    formData.append('description', currentCategory.description);
    if (currentCategory.image) {
      formData.append('image', currentCategory.image);
    }
    formData.append('parentId', currentCategory.parentId?.toString() || '');

    try {
      let response;
      if (editingCategoryId !== null) {
        // Mise à jour de la catégorie
        response = await fetch(`${HOSTNAME_WEB}/categories/update/${editingCategoryId}`, {
          method: 'PUT',
          body: formData,
        });
      } else {
        // Ajout d'une nouvelle catégorie
        response = await fetch(`${HOSTNAME_WEB}/categories/add`, {
          method: 'POST',
          body: formData,
        });
      }

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage(data.message); // Afficher le message de succès
        setSnackbarOpen(true);

        await fetchCategories(); // Mettre à jour la liste des catégories après ajout ou mise à jour

        resetForm(); // Réinitialiser le formulaire
      } else {
        const errorData = await response.json();
        console.error('Erreur lors de l’ajout ou la mise à jour de la catégorie:', errorData.message);
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
    }
  };

  // Fonction pour réinitialiser le formulaire
  const resetForm = () => {
    setCurrentCategory({
      id: Date.now(),
      categories_name: '',
      description: '',
      image: null,
      imageUrl: '',
      parentId: null,
    });
    setEditingCategoryId(null);
  };

  // Fonction pour fermer le Snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Fonction pour gérer l'upload d'image
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCurrentCategory({ ...currentCategory, image: file, imageUrl });
    }
  };

  // Fonction pour supprimer une catégorie
  const handleDeleteCategory = async (categoryId: number) => {
    try {
      const response = await axios.delete(`${HOSTNAME_WEB}/categories/delete/${categoryId}`);
      if (response.status === 200) {
        setSuccessMessage('Catégorie supprimée avec succès!');
        setSnackbarOpen(true);
        await fetchCategories(); // Mettre à jour la liste après suppression
      } else {
        console.error('Erreur lors de la suppression de la catégorie');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  // Fonction pour charger les données de la catégorie à éditer
  const handleEditCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setCurrentCategory(category);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box>
        {mode && (
          <Box display={'flex'}>
            <Box flex={4}>
            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" mb={4}>
              <button
                className="btn border text-dark"
                onClick={() => setMode(null)}
              >
                <i className="bi bi-arrow-left"></i> Go back
              </button>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Gestion des Catégories
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField
                  label="Nom de la catégorie"
                  variant="outlined"
                  fullWidth
                  value={currentCategory.categories_name}
                  onChange={(e) =>
                    setCurrentCategory({ ...currentCategory, categories_name: e.target.value })
                  }
                  className="form-control"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Catégorie Parent</InputLabel>
                  <Select
                    value={currentCategory.parentId || ''}
                    onChange={(e) =>
                      setCurrentCategory({
                        ...currentCategory,
                        parentId: e.target.value === '' ? null : Number(e.target.value),
                      })
                    }
                  >
                    <MenuItem value="">Aucune</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.categories_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={13}
                  className="form-control"
                  value={currentCategory.description}
                  onChange={(e) =>
                    setCurrentCategory({ ...currentCategory, description: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel>Choisir une image pour la catégorie</InputLabel>
                <Button variant="contained" component="label">
                  Téléverser une image
                  <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                </Button>
                {currentCategory.imageUrl && (
                  <Box sx={{ marginTop: 2 }}>
                    <img src={currentCategory.imageUrl} alt="Category" style={{ width: 50, height: 50 }} />
                  </Box>
                )}
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  className="bg-info"
                  onClick={handleAddOrUpdateCategory}
                >
                  {editingCategoryId !== null
                    ? 'Mettre à jour la catégorie'
                    : 'Ajouter la catégorie'}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{ marginLeft: 2 }}
                  onClick={resetForm}
                >
                  Réinitialiser
                </Button>
              </Grid>
            </Grid>
            </Box>
            <Box  flex={2}></Box>
          </Box>
        )}
        {!mode && (
          <div>
            <Box display="flex" justifyContent="space-between" sx={{
                  backgroundColor: 'white',
                  padding: '5px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  marginBottom: '40px',
                  width: '100%',
                }}>
              
                 
                    <Typography variant="h5" className="m-2" sx={{ fontSize: '15px', paddingTop: '10px' }}>
                     Liste de categories
                    </Typography>
                    <Button
                      type="submit"
                      className="btn border text-white m-2 bg-primary"
                      onClick={() => setMode(true)}  // Appel de la fonction de sauvegarde
                     // Désactivation du bouton pendant le chargement
                    >
                      + Add new categories 
                    </Button>
                
                </Box>
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nom</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell>Catégorie Parent</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>{category.categories_name}</TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell>
                        {category.imageUrl ? (
                          <img
                            src={category.imageUrl}
                            alt="Category"
                            style={{ width: 50, height: 50 }}
                          />
                        ) : (
                          'Aucune image'
                        )}
                      </TableCell>
                      <TableCell>
                        {category.parentId ? 'Catégorie Parent' : 'Aucune'}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => {
                            handleEditCategory(category);
                            setMode(true);
                          }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="success"
            sx={{ width: '100%' }}
          >
            {successMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
  
};

export default CategoryManager;
