import React, { useEffect, useState } from "react";
import Template from "../../layout/template";
import { Box } from "@mui/joy";
import { Typography } from "@mui/material";
import HOSTNAME_WEB from "../../../admin/constants/hostname";
import { useParams } from 'react-router-dom';


const DestinationCulturePage = () => {

  const title = `Learn more about city's CULTURE`;
  return <Template Content={Content} title={title} />;
};

const Content = () => {
  
  const [type, setType] = useState("language");
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
          var content =  JSON.parse(response.data.culture);
          setData(content);
      });
  }


  useEffect(()=>{
    fetchData();
  }, [])

  const RenderContent = (currentType:any) => {
    
    if (currentType === "language") {
      return (
        <div 
         dangerouslySetInnerHTML={{ __html: data[1] }}
        />
       
      );
    }
    if (currentType === "religion") {
      return (
        <div>
          {data[2]}
        </div>
      );
    }
    if (currentType === "brief") {
      return (
        <div>
            {data[0]}
        </div>
      );
    }
    return null;
  };

  return (
    <Box display="flex" height="70vh">
      <Box flex={3}>{RenderContent(type)}</Box>
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        justifyContent="space-around"
        sx={{
          height: "100%",
        }}
      >
        {/* Premier élément */}
        <Box
          onClick={() => setType("brief")}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <img
            src={"/assets/img/destination/culture/brief.png"}
            className="culture_photo"
            style={{ width: "100px", height: "100px", borderRadius: "100px" }}
            alt="Culture brief"
          />
          <Typography
            sx={{ fontSize: "15px", fontWeight: "bold", marginTop: "20px" }}
          >
            A Brief Overview
          </Typography>
        </Box>

        {/* Deuxième élément */}
        <Box
          onClick={() => setType("language")}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <img
            src={"/assets/img/destination/culture/language.png"}
            className="culture_photo"
            style={{ width: "150px", height: "100px", borderRadius: "100px" }}
            alt="Language"
          />
          <Typography
            sx={{ fontSize: "15px", fontWeight: "bold", marginTop: "20px" }}
          >
            Language
          </Typography>
        </Box>

        {/* Troisième élément */}
        <Box
          onClick={() => setType("religion")}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <img
            src={"/assets/img/destination/culture/religion.png"}
            className="culture_photo"
            style={{ width: "150px", height: "150px", borderRadius: "100%" }}
            alt="Religion"
          />
          <Typography
            sx={{ fontSize: "15px", fontWeight: "bold", marginTop: "20px" }}
          >
            Religion
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default DestinationCulturePage