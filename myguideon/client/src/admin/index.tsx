import React, { ReactNode, useEffect, useState } from "react";
import AddDestination from './screens/addDestination';
import DestinationList from './screens/destination';
import DestinationProfileManager from './screens/permission';
import DashboardScreen from "./screens/dashboard";
import AddTingstoDo from './screens/addThingstoDo';
import CountrySearch from './screens/test';
import NotFound from "./screens/notright";
import { useSearchParams } from "react-router-dom";

import '@fontsource/inter';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  Box,
  Divider,
} from "@mui/material";
import {
  Home as HomeIcon,
  TravelExplore as TravelExploreIcon,
  AddLocationAlt as AddLocationAltIcon,
  Assignment as AssignmentIcon,
  AddTask as AddTaskIcon,
  Category as CategoryIcon,
  Lock as LockIcon,
  AlignVerticalTop,
  Person
} from "@mui/icons-material";


import { Typography as JoyTypography, Typography } from "@mui/joy";
import Categories from "./screens/categories";

import './assets/style/css/customer.css';
import ThingstoDo from './screens/thingstoDo';
import HOSTNAME_WEB from "./constants/hostname";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

type Section = "permission" | "dashboard" | "settings" | "logout" | "destination" | "list_destination"
  | "things_to_do" | "add_things_to_do" | "test" | null;

const menuItems: { label: string |null; icon: React.ReactNode; section: Section }[] = [
  { label: "All destinations", icon: <TravelExploreIcon />, section: "list_destination" },
  { label: "Add destinations", icon: <AddLocationAltIcon />, section: "destination" },
  { label: "All things to do", icon: <AssignmentIcon />, section: "things_to_do" },
  { label: "Add things to do", icon: <AddTaskIcon />, section: "add_things_to_do" },
  { label: "Permission", icon: <LockIcon />, section: "permission" },
  { label: "User", icon: <Person />, section: "test" },

];

type BackOfficeTemplateProps = {
  children?: ReactNode;
};




const BackOfficeTemplate: React.FC<BackOfficeTemplateProps> = ({ children }) => {
    

  const [permissions, setPermissions] =  useState("");
  const [userPrefil, setUserPrefil]   = useState(" ");
  const [avatar, setAvatar]           = useState(" ") ;
  const [name, setName ]              = useState(" ");
  const [searchParams]                = useSearchParams();
  // Récupérer la valeur de "page"
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const navigate =  useNavigate();
  
  



  const handleUserProfil = (userID: any) => {

    fetch(`${HOSTNAME_WEB}/profil/user_profil/${userID}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error fetching user profile');
        }
        return response.json();
      })
      .then((response) => {

        setAvatar(response[0][0].avatar);
        setUserPrefil(response[0][0].profil_id);
        setName(response[0][0].name);

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


  useEffect(()=>{
    const page = searchParams.get("page");
    if(page){
      setSelectedSection(page);
    }
  }, []);


  return (
    <Box sx={{ display: "flex" }}>
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: '#112833',
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 4px",  // Corrected here
          borderTopRightRadius: "19px",  // Corrected here (CamelCase)
          borderBottomRightRadius: "19px",  // Corrected here (CamelCase)
        },
      }}
    >

        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '50px' }}>
          <img
            src="/assets/img/logo.png"
            alt="Logo de l'entreprise"
            style={{ width: '200px', height:'50px', objectFit:'contain'}}
          />
        </Box>
        <Box sx={{ overflow: "auto" }}>
        <Divider  sx={{color:'red'}}/>
          <List>
          {menuItems.map((item, index) => {

            if (index== 5 && !permissions.includes("1")) {
              return null; // Masquer uniquement l'index 1 si permission n'inclut pas "0"
            }
            if (index== 1 && !permissions.includes("2")) {
              return null; // Masquer uniquement l'index 1 si permission n'inclut pas "0"
            }
            if (index== 3 && !permissions.includes("7")) {
              return null; // Masquer uniquement l'index 1 si permission n'inclut pas "0"
            }
            if (
              index === 0 && !["3", "4", "5", "6"].some(permission => permissions.includes(permission))
            ) {
              return null; // Masquer uniquement l'index 0 si aucune des permissions 3, 4, 5, 6 n'est présente
            }
            if (
              index === 2 && !["8", "9", "10", "11"].some(permission => permissions.includes(permission))
            ) {
              return null; // Masquer uniquement l'index 0 si aucune des permissions 3, 4, 5, 6 n'est présente
            
            }
            if(index == 5){
              return null
            }
            
            return(<ListItem
                  key={index}
                  onClick={() => {navigate(`/admin?page=${item.section}`);   window.location.reload();} }
                  className={selectedSection === item.section ? "active-menu-item" : ""}
                  sx={{
                    cursor: "pointer",
                    padding: '10px 20px',
                    '&:hover': {
                      backgroundColor: 'background.level2',
                    },
                  }}
                >
                  <ListItemIcon style={{ color: '#9fa6ad' }}>
                    {item.icon}
                  </ListItemIcon>
                  <JoyTypography style={{ color: '#9fa6ad' }}>
                    {item.label} 
                  </JoyTypography>
                </ListItem>
              )})}

            
            <ListItem sx={{color:'white', border:'0.5px solid white', borderRadius:'5px', padding:'10px', width:'80%', margin:'auto'}} className="btn"
              onClick = {
                ()=>{ 
                
                  localStorage.removeItem('userId');
                  window.location.reload();

               
                }
              }
            >
               <Typography style={{textAlign:'center', color:'white'}}>  <i className="bi bi-box-arrow-right"></i>   Deconnecter  </Typography>
            </ListItem>
          </List>
          <Divider />
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 5,
          pl:7,
          pr:5,
          backgroundColor: '#F9F9F9',
          height: '100vh'
        }}
      >
        {children}
        <Box sx={{display:'flex', justifyContent:'space-between', marginBottom:'80px'}}>
          <Box>
          </Box>
          <Box sx={{display:'flex', alignItems: "center", position: "fixed",
              left: '90%', top: '20px'}}>
          <Typography 
              style={{
                fontWeight: "700",
                marginRight: "5px",
                fontSize: "15px"
              }}
            >
              {name.toUpperCase()}
            </Typography>
            <img 
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "100px",
                  objectFit: "cover",
                  border: "3px solid #0000ff40",
                }}
                src={avatar} 
                alt="user avatar"
                onClick={()=>{
                  setSelectedSection("test")
                }}
              />
             
          </Box>

        </Box>
        <Box>
          {selectedSection === "list_destination" && <DestinationList />}
          {selectedSection === "destination"      && <AddDestination />} 
          {selectedSection === "permission"       &&    <DestinationProfileManager />}
          {selectedSection === "things_to_do"     && <ThingstoDo />}
          {selectedSection === "add_things_to_do" &&  <AddTingstoDo index={null} />}
          {selectedSection == 'test'              &&  <CountrySearch/>}
        </Box>
      </Box>
    </Box>
  );
};

const IndexAdmin: React.FC = () => {
  return (
    <BackOfficeTemplate>
    </BackOfficeTemplate>
  );
};

export default IndexAdmin;
