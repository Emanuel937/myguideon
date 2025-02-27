import React, { useEffect, useState } from 'react';
import { SmallDestinationPhoto, LargestDestinationPhoto } from '../components/destinationDisplayPhoto';
import '../assets/styles/css/destination.css';
import { useParams } from "react-router-dom";
import HOSTNAME_WEB from '../../admin/constants/hostname';
import { Typography } from '@mui/material';

// Typage des données de destination


const DestinationPreviewGalery = (data:any) => {


  var data = data.data;
 

  const [cover, setCover ]        = useState({img:''});
  const [isDisplay, setIsDisplay] = useState('none');

  const styleActive = {
     border:"2px solid #57c89e"
  }

 

  const noActive = {
    border:"2px solid white"
 }

  const  handleImagePath          = (e:any)=>
  {
      setCover({img:e});
      //display modal 
      setIsDisplay('block');
  }

 const handleCloseModal = ()=>{
    setIsDisplay('none');
 }


 const nextBack = (direction: string) => {
  var gallery = data.gallery;
      gallery = gallery.map((e:any, index:number)=> HOSTNAME_WEB + e);

  if (!Array.isArray(gallery)) {
      console.error("data is not an array", gallery);
      return;
  }

  const arrayLength = gallery.length;
  var currentPathIndex = gallery.indexOf(`${cover.img}`);



  if(direction == "left"){
   
    currentPathIndex -= 1;
     if(currentPathIndex < 0){
       currentPathIndex = arrayLength -1;
     }

   
  }else{

    currentPathIndex += 1;

    if(currentPathIndex > arrayLength - 1){
      currentPathIndex = 0;
    }
    
  }

  setCover({img:gallery[currentPathIndex]});

  console.log(cover);
};


  useEffect(()=>{
      console.log(data);
      setCover({img:`${HOSTNAME_WEB}${data.imageCover}`});
  }, [data])
  
  return (
    <div className="previwGaleryContainer">
      <section id="modalPreviewPopup" style={{display:isDisplay}} className={isDisplay == "none" ? "hide" :"show"}>
        <div>
          <div style={{display:'flex', justifyContent:'space-between',  width:'100%' }}>
            <Typography color='white'> Destination image </Typography>
              <div style={{
                    border:'none', color:'white', 
                    fontSize:'40px', backgroundColor:'transparent', 
                    fontWeight:'bold'
                    }}
                    onClick = {handleCloseModal}
                    >
                    <i className="bi bi-x-lg"></i>
                    </div>
              </div>
         </div>
         <div id="coverImg">
                <img src={cover.img} alt='Destination current ' className='fade-out' />
            </div>
            <div id="navigationGallery">
                <button className="btn-navigation"
                  onClick={()=>nextBack('left')}
                
                >
                    <i className="bi bi-arrow-left"></i>
                </button>
                <button className="btn-navigation"
                   onClick={()=>nextBack('right')}
                >
                   <i className="bi bi-arrow-right"></i>
                </button>
             </div>
             <article id='smallGaleryBottom'>
                  {data.gallery?.map((e:any)=>{
                    return (
                      <div> 
                        <img src={`${HOSTNAME_WEB}${e}`} alt="currenct active image" 
                        style={ `${HOSTNAME_WEB}${e}` === cover.img ? styleActive : noActive } 
                        onClick={(e:any)=> handleImagePath(e.target.src)} 
                        />   
                      </div>
                  
                      )
                  })}
             
             </article>

      </section>
      <div className="d-flex">
        <div className='flex-large'>
          <LargestDestinationPhoto 
            imageName={data.imageCover ? `${cover.img}` : `${HOSTNAME_WEB}/defaultImage.png`} 
          />
        </div>
        <div className="d-flex flex-wrap">
          {data.gallery?.slice(0,8).map((imageBaseName: any, index: React.Key | null | undefined) => (
            <SmallDestinationPhoto 
              key={index}
              img={`${HOSTNAME_WEB}${imageBaseName}`}
              onClick={handleImagePath} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DestinationPreviewGalery;
