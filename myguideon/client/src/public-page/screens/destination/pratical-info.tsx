
import React, { useState, useEffect } from "react";
import Template from "../../layout/template";
import { Box, Grid } from "@mui/joy";
import { Typography } from "@mui/material";
import { useParams } from 'react-router-dom';
import HOSTNAME_WEB from "../../../admin/constants/hostname";


const  DestinationPraticalInformationPage = () => {
  const title = `Pratique info`;
  return <Template Content={Content} title={title} />;
  
};

const Content = () => {

  const [coverImage, setCoverImage] = useState('');
  const [destinationName, setDestinationName] = useState(" ");

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
          var content   =  response.data;
          var basicInfo =  JSON.parse(content.basic_info);
          var gallery    = JSON.parse(content.gallery);
          setCoverImage(gallery[0]);
          setDestinationName(basicInfo.destinationName);

          console.log('data of destination is:', gallery);
         
      });
  }


  useEffect(()=>{
    try{
     fetchData();
    }catch(e){
      console.log(e);
    }
  }, [])

 
  return (
    <Box className='contaneur-bg'>
      <Box display={"flex"} sx={{backgroundColor:'white', justifyContent:'space-between', width:'100%'}}>
        <Box className="flex-50">
          <h1 className="pf-title"> Votre Guide </h1>
          <h2 className=" pt-titre-2">{destinationName}</h2>
          <p className="pf-description">
            Tout ce dont vous avez besoin pour préparer votre voyage sereinement. 
            Des conseils pratiques aux informations essentielles.
          </p>
          <button className="pf-btn">
              Commencer la visite des <br></br> informations pratiques 
          </button>
          </Box>
          <Box   className="pratique-info-cover flex-50 flex-last">
            <img  alt='destination image' src={`${HOSTNAME_WEB}${coverImage}`} />
          </Box>
        </Box>
        <Box>
          <h3 className="pf-guide "> Guide pratique</h3>
          <h2 className="pf-big-title mb-5"> Organisez votre voyage</h2>
          <div className="pf-flex ">
            <CardList
              icon='visa.png'
              title='Formalités hh & visas'
              description='Informations sur les visas, documents requis et démarches administratives.'
            />
            <CardList
              icon='argent.png'
              title='Argent & transactions locales'
              description='Conseils sur les moyens de paiement et la gestion de votre budget.'
            />
            <CardList
              icon='place.png'
              title='Transports sur place'
              description='Guide des différents moyens de transport disponibles localement.'
            />
              <CardList
              icon='heart-sante.png'
              title='Santé & sécurité'
              description='Recommandations sanitaires et conseils de sécurité essentiels.'
            />
            <CardList
              icon='culture-local.png'
              title='Culture & coutumes locales'
              description='Découvrez les traditions et les codes culturels à respecter.'
            />
            <CardList
              icon='quartier.png'
              title='Hébergement & quartiers'
              description='Guide des différentes options d’hébergement et zones recommandées.'
            />

            <CardList
              icon='ressource.png'
              title='Communications & ressources'
              description='Informations pratiques sur la connectivité et les outils utiles.'
            />  


          </div>
        </Box>

    </Box>
  );
};


const CardList = ({title, description, icon}:{title:string, description:string, icon:string})=>{
  return (
    <div className="pf-card">
      <div className="icon-bg">
        <img src={`/assets/img/${icon}`} alt="card_icon"/>
      </div>
      <h3 className="pf-h3">{title}</h3>
      <p>{description}</p>
    </div>
  )
}

export default  DestinationPraticalInformationPage;