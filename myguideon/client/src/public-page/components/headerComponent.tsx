import '../assets/styles/css/headerMenuComponent.css';
import defaultAvatar from '../assets/img/profil/user/1.png';
import {Box, List, ListItem} from '@mui/material';
import HOSTNAME_WEB from '../../admin/constants/hostname';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SmallMenuTextIcon = () => {
   


    return (
        <ul className="custom-menu-list">
            <li className="custom-menu-item">
                <img
                    className="svgIcon"
                    src="/assets/img/turism.svg" 
                    alt="Tourism Icon"
                />
                <span className="menu-text">My Guide</span>
            </li>
            <li className="custom-menu-item">
                <img
                    className="svgIcon"
                    src="/assets/img/airplan.svg" 
                    alt="Tourism Icon"
                />
                <span className="menu-text">My World</span>
            </li>
            <li className="custom-menu-item">
                <img
                    className="svgIcon"
                    src="/assets/img/chat.svg" 
                    alt="Tourism Icon"
                />
                <span className="menu-text">Message</span>
            </li>
        </ul>
    );
};



const SearchInput = () => {
    const [destinations, setDestinations] = useState<any[]>([]);
    const [ filterText, setFilterText,]     = useState<string>('');
    const [ filterData, setFilterData]     = useState<any[]>([]);
    const navigate = useNavigate();



    const fetchDestinations = async () => {
        try {
          const response = await axios.get(`${HOSTNAME_WEB}/destination`);
          if (response.status === 200) {
            // Vérification que response.data est un tableau
            if (Array.isArray(response.data)) {
              const data = response.data.map((item: any) => {
                const parsedBasicInfo = JSON.parse(item.basic_info);
                return {
                  id: item.id,
                  name: parsedBasicInfo.destinationName,
                  language: Array.isArray(parsedBasicInfo.language) ? parsedBasicInfo.language.join(" , ") : parsedBasicInfo.language,
                  budget: parsedBasicInfo.budget,
                  currency: parsedBasicInfo.currency,
                  country: parsedBasicInfo.categories || "N/A",
                  status: parsedBasicInfo.status || "N/A",
                  image: item.imageCover || "https://via.placeholder.com/150",
                  location: parsedBasicInfo.address
                };
              });
              setDestinations(data);
            } else {
              console.error('Les données reçues ne sont pas un tableau:', response.data);
            }
          }
        } catch (error) {
          console.error("Erreur lors du chargement des destinations:", error);
        }
      };

    
      const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFilterText = e.target.value.toLowerCase();
        setFilterText(newFilterText);
    
        // Filtrer les données
        console.log(destinations);

        const filtered = destinations.filter((destination) => 
            destination.name?.toLowerCase().includes(newFilterText) ||
            destination.country?.toLowerCase().includes(newFilterText) || // Correction ici
            destination.location?.toLowerCase().includes(newFilterText)  // Correction ici
        );
        
        setFilterData(filtered);
    };
    
    
    
    useEffect(() => {
        
        fetchDestinations();

        console.log("destination", destinations);
    }, []);

    return (
        <div className="customer-search-container">
          <input
            type="text"
            placeholder="Search your dream destination ..."
            name="search_destination"
            onChange={(e)=>handleFilter(e)}
          />
            <div>
            {filterData.length > 0 &&  filterText.length > 0 &&(
                    <ul
                        style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        width: "100%",
                        backgroundColor: "white",
                        border: "1px solid #ccc",
                        padding: 0,
                        margin: 0,
                        zIndex: 2000,
                        maxHeight: "400px",
                        overflowY: "auto",
                        }}
                    >
                        {filterData.map((item, index) => (
                        <li
                            key={index} // Ajout d'une clé unique
                            style={{
                            listStyleType: "none",
                            cursor: "pointer",
                            padding: "8px",
                            background: "#f1f1f1",
                            marginBottom: "5px",
                            }}
                            onClick={()=>{
                                navigate(`/destination/overview/${item.id}`);
                            }}
                        >
                            {item.name} 
                        </li>
                        ))}
                    </ul>
                    )}
                                
            </div>
           <img  src='/assets/img/search.svg'
            className="searchIcon"
           />
     
      </div>
    );
  };
  

const NotificationWidget = ()=>{
    return (
        <div className = "notification">
            <img
                src="/assets/img/notifications.svg"
                alt="notification icon"
            />
        </div>
    );
}

const UserAvatar = ()=>{

    const searchUserPhoto = () =>{

    }

    return (
        <div className="userAvatar">
             <img
                src={defaultAvatar}
            />
        </div>
    )
}


export {SmallMenuTextIcon, SearchInput,  UserAvatar,  NotificationWidget  };
