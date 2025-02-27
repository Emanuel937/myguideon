import React, { useContext, useEffect, useState } from 'react';
import { TextField, Button, MenuItem, Box, Grid, Typography, Divider, Alert } from '@mui/material';
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
  icon: File | string | null;
  gallery: File[] | string[] | null;
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
}> = ({ index, destinationID = null, updatedData = null }) => {

  
  var formData = new FormData();
  // initilise content
  const context =  useContext(AppContext);

  if(!context){
    throw new Error('there is no provider on app ');
  }

  const {setSubmitFunction} = context;


  const queryStatus  = [
      "Published",
      "Disabled",
      "Draft",
      "Pending validation"
  ];
  
  const [currentActivity, setCurrentActivity] = useState<Activity>({
    id: null,
    name: '',
    description: '',
    address: '',
    icon: null,
    gallery: null,
    destination_name: '',
    categories: '',
    status: 'Draft',
    lon: '',
    lat: '',
    destinationID: ''
  });

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [queryDestination, setQueryDestination] = useState<string[]>([]);
  const [destinationId, setDestinationId] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [previewLink, setPreviewLink] = useState("");
  const [timer, setTimer]             = useState(1);

  const queryCategories = [
    "NATURE & ADVENTURE", "EXPLORATION", "VISIT WORSHIP PLACES", "BEACHES & SUNBATHING", "SPORTS"
  ];

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
    // set current id 

    setCurrentActivity({ ...currentActivity, [field]: value });
  };
 

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setCurrentActivity({ ...currentActivity, address: input });

    if (input.length > 2) {
      axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
          q: input,
          format: "json",
          addressdetails: 1,
          limit: 5,
        },
      }).then((response) => {
        setSuggestions(response.data);
      }).catch((error) => {
        console.error("Erreur lors de la recherche de lieu", error);
        setSuggestions([]);
      });
    } else {
      setSuggestions([]);
    }
  };

  const handlePlaceSelect = (place: any) => {
    setCurrentActivity({
      ...currentActivity,
      address: place.display_name,
      lon: place.lon,
      lat: place.lat
    });
    setSuggestions([]);
  };

  const handleIconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCurrentActivity({ ...currentActivity, icon: file });
    }
  };

  const handleGalleryUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setCurrentActivity({ ...currentActivity, gallery: Array.from(files) });
    }
  };

  const handleSaveToDatabase = async () => {
    
    setLoading(true);
 
    try {
    
      formData.append('name', currentActivity.name);
      formData.append('description', currentActivity.description);
      formData.append('address', currentActivity.address);
      formData.append('destination_name', currentActivity.destination_name);
      formData.append('status', currentActivity.status);
      formData.append('categories', currentActivity.categories);
      formData.append('lon', currentActivity.lon);
      formData.append('lat', currentActivity.lat);
      formData.append('destinationID', currentActivity.destinationID);
  
      if (currentActivity.icon) {
        formData.append('icon', currentActivity.icon);
      }
  
      if (currentActivity.gallery) {
        currentActivity.gallery.forEach((file) => {
          formData.append('gallery', file);
        });
      }
  
      let response;
  
      if (index == null) {
        // Ajouter une nouvelle activité
        response = await fetch(`${HOSTNAME_WEB}/activities/add`, {
          method: 'POST',
          body: formData,
        }).then((response)=>{
          if(!response.ok){
            throw new Error('error on the fetch activity');
          }
          return response.json();

        }).then((response)=>
        {
          console.log('index of user is :', response.index);
          //set activitu destination id to locastorage
          localStorage.setItem('ActivityDestinationID', currentActivity.destinationID);
          localStorage.setItem('ActivityArrayIndex', response.index);
 
        });


       
       


      } else {
        // Mettre à jour une activité existante
        response = await fetch(
          `${HOSTNAME_WEB}/activities/update/${currentActivity.destinationID}/${index}`,
          {
            method: 'PUT',
            body: formData,
          }
        );
      }
  
      if (response && response.ok) {
        const successMessage =
          index == null
            ? 'Activité ajoutée avec succès.'
            : 'Activité mise à jour avec succès.';
  

        setCurrentActivity({
          id: null,
          name: '',
          description: '',
          address: '',
          icon: null,
          gallery: null,
          destination_name: '',
          categories: '',
          status: 'Draft',
          lon: '',
          lat: '',
          destinationID: '',
        });


      } else {
        alert('Erreur lors de l’enregistrement. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Error saving activity:', error);
      alert('Une erreur est survenue lors de l’enregistrement.');
    } finally {
      setLoading(false);
    }
  };
  

   const fetchSelectData = async ()=>{

      const response = await fetch(`${HOSTNAME_WEB}/activities/select/${destinationID}`)
      .then((response)=>{
        if(!response.ok){
          throw('error ... here')
        }
        return response.json();
      }).then((response)=>{

       var destinationName = JSON.parse(response.data[0].basic_info);
       var destinationName = destinationName.destinationName;



      var data = JSON.parse(response.data[0].activities)
         index = Number(index);
         
          data = data[index];

      setCurrentActivity({
          id: data.id,
          name: data.activity_name,
          description:data.description,
          address: data.address,
          icon: data.icon,
          gallery: data.gallery,
          destination_name:destinationName ,
          categories: data.categories,
          status: data.status,
          lon: data.lon,
          lat: data.lat,
          destinationID: destinationID
        });

      }).catch((error)=>{
        console.log(error);
      });

     
    }
    const handleChangeSuggestion = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      var key = value.toLowerCase().replace(/\s+/g, '');
      var id = destinationId[key];
      
      setCurrentActivity({ ...currentActivity, [name]: value, destinationID:id });
    };
  

  useEffect(() => {
    fetchDestinationName();

    if(index != null){
      fetchSelectData();
    }
   
  }, []);


  useEffect(() => {
    setSubmitFunction(() => handleSaveToDatabase);
  }, []); 
  

  
  useEffect(() => {
    if (index != null) {
        setPreviewLink(`/destination/maps/details/${currentActivity.destinationID}/${index}`);
    } else {
        const localStorageDestinationId = localStorage.getItem('ActivityDestinationID');
        const localStorageActivityId    = localStorage.getItem('ActivityArrayIndex');
        setPreviewLink(`/destination/maps/details/${localStorageDestinationId}/${localStorageActivityId}`);
    }


  }, [currentActivity.destinationID]); 
  
  // ✅ S'exécute seulement quand index ou destinationID change


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
      allPermissions();
      handleUserProfil(localStorage.getItem('userId'))
    }, [permissions, userPrefil]);
  

 
  return (
    <Box display="flex" sx={{ padding: 3 }}>
      <Box flex={5}>
       <SmallHeader title={'Adding things to do '} setBackButton={false} link={previewLink}/>
        <Divider sx={{ marginBottom: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              sx={{backgroundColor:'white'}}
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
              sx={{backgroundColor:'white'}}
              variant="outlined"
              fullWidth
              value={currentActivity.address}
              onChange={handleLocationChange}
            />
            {suggestions.length > 0 && (
              <Box sx={{ position: 'absolute', zIndex: 10, backgroundColor: '#fff', width: '100%', border: '1px solid #ddd' }}>
                {suggestions.map((place, index) => (
                  <Box
                    key={index}
                    sx={{ padding: 1, cursor: 'pointer' }}
                    onClick={() => handlePlaceSelect(place)}
                  >
                    {place.display_name}
                  </Box>
                ))}
              </Box>
            )}
          </Grid>
          <Grid item xs={3}>
             <Button variant="contained" component="label" sx={{backgroundColor:'white', color:'black', border:'1px solid light gray'}}>
              Upload Images
              <input type="file" hidden multiple accept="image/*" onChange={handleGalleryUpload} />
            </Button>
          </Grid>
          <Grid item xs={2} >
            <Button variant="contained" component="label" sx={{backgroundColor:'white', color:'black', border:'1px solid light gray'}}>
              Upload Icon
              <input type="file" hidden accept="image/*" onChange={handleIconUpload} />
            </Button>
          </Grid>

          <Grid item xs={12}>
            <TextField
             sx={{backgroundColor:'white'}}
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
            
            {currentActivity.icon && (
              <Box mt={2}>
                {index  == null &&
                <img
                  src={typeof currentActivity.icon === 'string' ?
                     currentActivity.icon : URL.createObjectURL(currentActivity.icon)}
                  alt="Icon Preview"
                  style={{ width: 50, height: 50 }}
                />}
              </Box>
            )}
          </Grid>

          <Grid item xs={6}>
            {currentActivity.gallery && (
              <Box mt={2}>
                {currentActivity.gallery.map((file, index) => (
                  <img
                    key={index}
                    src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                    alt={`Gallery Image ${index + 1}`}
                    style={{ width: 50, height: 50, marginRight: 10 }}
                  />
                ))}
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ActivityForm;
