
import React, { useState, useEffect } from "react";
import Template from "../../layout/template";
import { Box } from "@mui/joy";
import { Typography } from "@mui/material";
import { useParams } from 'react-router-dom';
import HOSTNAME_WEB from "../../../admin/constants/hostname";


const DestinationHistoriquePage = () => {
  const title = `Learn more about city's CULTURE`;
  return <Template Content={Content} title={title} />;
};

const Content = () => {


  const [data, setData] = useState('');
  
  const { id } = useParams();

  const fetchData = async()=>{

    const response = await fetch(`${HOSTNAME_WEB}/destination/${id}`)
      .then((response)=>{
        if(!response.ok){
          throw('error');
        }

        return response.json();
      })
      .then((response)=>{
          var content =  JSON.parse(response.data.historical);
          setData(content);
      });
  }


  useEffect(()=>{
    fetchData();
  }, [])

  const RenderContent = () => {
    return (
  
          <div 
        dangerouslySetInnerHTML={{ __html: data[0] }}
       />
    
    );
  };

  return (
    <Box display="flex" height="70vh">
      {/* Section gauche avec le contenu */}
      <Box flex={3} display="flex" justifyContent="center" alignItems="center">
        <RenderContent />
      </Box>

      {/* Section droite avec l'image */}
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          height: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <img
            src={"/assets/img/destination/historical/historical.png"}
            className="culture_photo"
            style={{ width: "300px", height: "300px", objectFit: "contain" }}
            alt="Historical"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default DestinationHistoriquePage;
