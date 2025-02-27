import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Paper,
  Snackbar,
  Alert,
  Grid,

} from "@mui/material";
import { styled } from "@mui/material/styles";
import HOSTNAME_WEB from "../constants/hostname";
import { BorderRight, Password } from "@mui/icons-material";
import { } from '@mui/material';
import { CheckCircle, Favorite } from '@mui/icons-material';



const ProfileContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  padding: theme.spacing(3),
  backgroundColor: "#eef2f6",
}));

const ProfileCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 500,
  width: "100%",
  textAlign: "center",
  boxShadow: theme.shadows[4],
  borderRadius: 12,
}));

const UserProfile: React.FC = () => {

  const [open, setOpen]  = useState(false);


  const [userData, setUserData] = useState({
    name: "",
    email: "",
    avatar: "",
    password:" ",
    
  });

const handleUserData = ()=>{
  const userID = localStorage.getItem('userId');
  const response = fetch(`${HOSTNAME_WEB}/profil/user_profil/${userID}`)
  .then((response)=>{
      if(!response.ok){
        throw new Error('error from the hebergement')
      }
      return response.json();
  })
  .then((response)=>{
    setUserData({...response[0][0]});
  })
  .catch((error)=>{
    console.log(error);
  })
}



const handleUpdateUserInformation = () => {
  const userID = localStorage.getItem('userId');
  const response = fetch(`${HOSTNAME_WEB}/profil/update/user/own/${userID}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
    headers: {
      'Content-Type': 'application/json' // Ajout des en-têtes pour spécifier que le corps est en JSON
    }
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error('Error from server');
    }
    return response.json();
  })
  .then((response) => {
     setOpen(true);
  })
  .catch((error) => {
    console.log(error);
  });
}




useEffect(()=>{
  handleUserData()
}, []);

const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];



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
           setPermissions(filteredPermissions[0].name);
      
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
  <Grid container spacing={1}>
    {open && (
      <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
        <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: '100%' }}>
          Data updated successfully
        </Alert>
      </Snackbar>
    )}
    <Grid item xs={10} style={{display:'flex'}}>
      <img
        src={userData.avatar}
        alt="User Avatar"
        style={{
          width: 100,
          height: 100,
          objectFit: 'cover',
          borderRadius: 10,
          marginRight:'40px'
        }}
      />
      <Box>
        <TextField
          label="Name"
          fullWidth
          sx={{ backgroundColor: 'white' }}
          margin="normal"
          type="text"
          value={userData.name}
          onChange={(e) => setUserData(prev => ({
            ...prev,
            name: e.target.value
          }))}
        />
        <TextField
          label="Rôles"
          fullWidth
          sx={{ backgroundColor: 'white' }}
          margin="normal"
          type="text"
          value={permissions}
          InputProps={{ readOnly: true }}
          aria-readonly="true"
          onChange={(e) => setUserData(prev => ({
            ...prev,
            name: e.target.value
          }))}/>
     </Box>
    </Grid>
    <Grid item xs={12}>
      <TextField
        label="Email"
        fullWidth
        sx={{ backgroundColor: 'white' }}
        margin="normal"
        type="email"
        value={userData.email}
        onChange={(e) => setUserData(prev => ({
          ...prev,
          email: e.target.value // Fix: mise à jour correcte de l'email
        }))}
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        label="Password"
        fullWidth
        margin="normal"
        type="password"
        sx={{ backgroundColor: 'white' }}
        value={userData.password}
        onChange={(e) => setUserData(prev => ({
          ...prev,
          password: e.target.value
        }))}
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        label="Avatar"
        fullWidth
        margin="normal"
        type="text"
        sx={{ backgroundColor: 'white' }}
        value={userData.avatar}
        onChange={(e) => setUserData(prev => ({
          ...prev,
          avatar: e.target.value
        }))}
      />
    </Grid>
    <button className="btn border bg-success text-white mt-5 " onClick={handleUpdateUserInformation} style={{ width: '200px' }}>
        Enregistrer
      </button>
  </Grid>);
}

const SearchCountry = ()=>{
  return < UserProfile/>;
}

export default SearchCountry;








