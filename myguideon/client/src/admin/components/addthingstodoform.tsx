import React, { useContext, useEffect, useState } from 'react';
import { TextField, Button, MenuItem, Box, Grid, Divider, Tabs, Tab } from '@mui/material';
import axios from 'axios';
import HOSTNAME_WEB from '../constants/hostname';
import SearchSuggestion from './search_suggestion';
import SmallHeader from './smallHeader';
import { AppContext } from '../../main';

type Activity = {
  id: number | null | string;
  name: string;
  description: string;
  address: string;
  files: File | string | null;
  destination_name: string;
  categories: string;
  status: string;
  lon: string;
  lat: string;
  destinationID: any;
};

const ActivityForm: React.FC<{
  index: number | null | string;
  destinationID: number | null | string;
  updatedData: Activity | null;
}> = ({ index, destinationID = null }) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [queryDestination, setQueryDestination] = useState<string[]>([]);
  const [destinationId, setDestinationId] = useState<Record<string, any>>({});
  const [previewLink, setPreviewLink] = useState("");
  const [currentTab, setCurrentTab] = useState('1');

  const context = useContext(AppContext);
  if (!context) throw new Error('There is no provider on app');

  const { setSubmitFunction } = context;

  const queryStatus = ["Published", "Disabled", "Draft", "Pending validation"];
  const queryCategories = ["NATURE & ADVENTURE", "EXPLORATION", "VISIT WORSHIP PLACES", "BEACHES & SUNBATHING", "SPORTS"];

  const [currentActivity, setCurrentActivity] = useState<Activity>({
    id: null,
    name: '',
    description: '',
    address: '',
    files: null,
    destination_name: '',
    categories: '',
    status: 'Draft',
    lon: '',
    lat: '',
    destinationID: ''
  });

  const fetchDestinationName = async () => {
    try {
      const response = await fetch(`${HOSTNAME_WEB}/destination`);
      const data = await response.json();
      const destinationObject: Record<string, any> = {};
      const destinationArray = data.map((e: any) => {
        const jsonData = JSON.parse(e.basic_info);
        const destinationName = jsonData.destinationName;
        const destinationKey = destinationName.toLowerCase().replace(/\s+/g, '');
        destinationObject[destinationKey] = e.id;
        return destinationName;
      });
      setQueryDestination(destinationArray);
      setDestinationId(destinationObject);
    } catch (error) {
      console.error("Error fetching destination names:", error);
    }
  };

  const handleChange = (field: keyof Activity, value: string) => {
    setCurrentActivity((prev) => {
      const updated = { ...prev, [field]: value };
      console.log('Updated field:', field, 'with value:', value, 'New state:', updated);
      return updated;
    });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setCurrentActivity((prev) => ({ ...prev, address: input }));
    if (input.length > 2) {
      axios
        .get("https://nominatim.openstreetmap.org/search", {
          params: { q: input, format: "json", addressdetails: 1, limit: 5 },
        })
        .then((response) => setSuggestions(response.data))
        .catch((error) => {
          console.error("Erreur lors de la recherche de lieu", error);
          setSuggestions([]);
        });
    } else {
      setSuggestions([]);
    }
  };

  const handlePlaceSelect = (place: any) => {
    setCurrentActivity((prev) => ({
      ...prev,
      address: place.display_name,
      lon: place.lon,
      lat: place.lat,
    }));
    setSuggestions([]);
  };

  const handleIconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setCurrentActivity((prev) => ({ ...prev, files: file }));
  };

  const handleChangeSuggestion = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const key = value.toLowerCase().replace(/\s+/g, '');
    const id = destinationId[key] || '';
    setCurrentActivity((prev) => {
      const updated = { ...prev, [name]: value, destinationID: id };
      console.log('Destination changed:', { name, value, destinationID: id }, 'New state:', updated);
      return updated;
    });
  };

  const handleSaveToDatabase = async () => {
    console.log('Saving currentActivity:', currentActivity);
    try {
      const formData = new FormData();
      formData.append('name', currentActivity.name);
      formData.append('description', currentActivity.description);
      formData.append('address', currentActivity.address);
      formData.append('destination_name', currentActivity.destination_name);
      formData.append('status', currentActivity.status);
      formData.append('categories', currentActivity.categories);
      formData.append('lon', currentActivity.lon);
      formData.append('lat', currentActivity.lat);
      formData.append('destinationID', currentActivity.destinationID || '');
      if (currentActivity.files) formData.append('files', currentActivity.files);

      let response;
      if (index === null || index === undefined) {
        response = await fetch(`${HOSTNAME_WEB}/thingtodo/add`, {
          method: 'POST',
          body: formData,
        });
      } else {
        response = await fetch(
          `${HOSTNAME_WEB}/thingtodo/update/${currentActivity.destinationID}/${index}`,
          {
            method: 'PUT',
            body: formData,
          }
        );
      }

      if (!response.ok) throw new Error('Erreur lors de l’enregistrement de l’activité.');
      const successMessage =
        index === null || index === undefined
          ? 'Activité ajoutée avec succès.'
          : 'Activité mise à jour avec succès.';
      alert(successMessage);
    } catch (error) {
      console.error('Erreur lors de l’enregistrement de l’activité :', error);
      alert('Une erreur est survenue lors de l’enregistrement.');
    }
  };

  const [permissions, setPermissions] = useState("");
  const [userPrefil, setUserPrefil] = useState("");

  const handleUserProfil = (userID: any) => {
    fetch(`${HOSTNAME_WEB}/profil/user_profil/${userID}`)
      .then((response) => {
        if (!response.ok) throw new Error('Error fetching user profile');
        return response.json();
      })
      .then((response) => setUserPrefil(response[0][0].profil_id))
      .catch((error) => console.error('Error:', error));
  };

  const allPermissions = () => {
    fetch(`${HOSTNAME_WEB}/profil/`)
      .then((response) => {
        if (!response.ok) throw new Error('There is an error');
        return response.json();
      })
      .then((response) => {
        const filteredPermissions = response.message.filter(
          (element: any) => element.id.toString() === userPrefil.toString()
        );
        if (filteredPermissions.length > 0) setPermissions(filteredPermissions[0].permissions);
      })
      .catch((error) => console.error('Error:', error));
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  useEffect(() => {
    fetchDestinationName();
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) handleUserProfil(userId);
  }, []);

  useEffect(() => {
    if (userPrefil) allPermissions();
  }, [userPrefil]);

  useEffect(() => {
    setSubmitFunction(() => handleSaveToDatabase);
  }, [currentActivity]); // Dépendance sur currentActivity pour capturer les mises à jour

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={currentTab} onChange={handleTabChange} aria-label="Tabs for Profiles, Permissions, and Team">
          <Tab label="Basic info" value="1" />
          <Tab label="Gallery" value="2" />
        </Tabs>
      </Box>
      {currentTab === "1" ? (
        <Box flex={5}>
          <SmallHeader title={'Adding things to do'} setBackButton={false} link={previewLink} />
          <Divider sx={{ marginBottom: 3 }} />
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                sx={{ backgroundColor: 'white' }}
                label="Nom de l'activité"
                variant="outlined"
                fullWidth
                value={currentActivity.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </Grid>
            <Grid item xs={5}>
              <SearchSuggestion
                placeholder="Destination"
                value={currentActivity.destination_name}
                name="destination_name"
                queryData={queryDestination}
                handleChange={handleChangeSuggestion}
                callback={handleChangeSuggestion}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Catégorie"
                variant="outlined"
                fullWidth
                select
                value={currentActivity.categories}
                onChange={(e) => handleChange('categories', e.target.value)}
              >
                {queryCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Status"
                variant="outlined"
                fullWidth
                select
                value={currentActivity.status}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                {queryStatus
                  .filter((e) => e !== "Published" || permissions.includes("11"))
                  .map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Adresse"
                sx={{ backgroundColor: 'white' }}
                variant="outlined"
                fullWidth
                value={currentActivity.address}
                onChange={handleLocationChange}
              />
              {suggestions.length > 0 && (
                <Box sx={{ position: 'absolute', zIndex: 10, backgroundColor: '#fff', width: '100%', border: '1px solid #ddd' }}>
                  {suggestions.map((place, index) => (
                    <Box key={index} sx={{ padding: 1, cursor: 'pointer' }} onClick={() => handlePlaceSelect(place)}>
                      {place.display_name}
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="contained"
                component="label"
                sx={{ backgroundColor: 'white', color: 'black', border: '1px solid lightgray' }}
              >
                Upload Icon
                <input type="file" hidden accept="image/*" onChange={handleIconUpload} />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TextField
                sx={{ backgroundColor: 'white' }}
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={10}
                value={currentActivity.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              {currentActivity.files && (
                <Box mt={2}>
                  {index === null && (
                    <img
                      src={typeof currentActivity.files === 'string' ? currentActivity.files : URL.createObjectURL(currentActivity.files)}
                      alt="Icon Preview"
                      style={{ width: 50, height: 50 }}
                    />
                  )}
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Grid item xs={3}>
          <Button
            variant="contained"
            component="label"
            sx={{ backgroundColor: 'white', color: 'black', border: '1px solid lightgray' }}
          >
            Upload Images
            <input type="file" hidden multiple accept="image/*" />
          </Button>
        </Grid>
      )}
    </Box>
  );
};

export default ActivityForm;