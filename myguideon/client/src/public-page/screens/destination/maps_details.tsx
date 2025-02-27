import React, { useEffect, useState } from 'react';
import MapComponent from '../../components/map_component';
import HeaderLayout from '../../layout/HeaderLayout';
import '../../assets/styles/css/destination.css';
import { useNavigate, useParams } from "react-router-dom";
import HOSTNAME_WEB from '../../../admin/constants/hostname';

const DestinationMapsDetails = () => {
    const { id, destinationID} = useParams(); // Récupérer l'ID de l'URL
    const [activityData, setActivityData]      = useState({});
    const [isLoading, setIsLoading]            = useState(false);
    
    const navigate = useNavigate();
  
    const fetchData = async () => {
  
        const response = await fetch(`${HOSTNAME_WEB}/destination/${destinationID}`)
        .then((response)=>{
          if(!response.ok){
              throw new Error("Erreur lors de la récupération des données.");
          }
          return response.json()
        })
        .then((response)=>
        { 
          var data = JSON.parse(response.data.activities);
              data = data[Number(id)];
              setActivityData(data);
        }).catch((error)=>
      {
          console.error("Erreur lors de la récupération des données :", error);
      });
  
  
    };
  
    useEffect(() => {

          fetchData();
      
    }, []);
  

  return (
    <div>
      <HeaderLayout />
      <section className="map_section">
        <CardOver data={activityData}/>
        <p className="map_back" onClick={() => navigate(-1)}>
          <img src="/assets/img/map_back.svg" alt="Back Icon" /> Back to Classic GuideMap
        </p>
        <p className="explore_mode">
          <img src="/assets/img/world.svg" alt="World Icon" /> Exploration mode
        </p>
        <p className="bottom_map_activity_menu">
          <img src="/assets/img/activity.svg" alt="Activity Icon" /> Activities
        </p>
        <article className="map_article">
          <MapComponent  />
        </article>
      </section>
    </div>
  );
};

const CardOver = (data:any) => {

  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1); // Retourner à la page précédente
  };
  console.log('child data is: ', data)
  var gallery =  data.data.gallery;

  return (
    <div className="card_over">
      <section className="card_over_container">
        <p className="text-center" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <span className="card_over_title activities_name" style={{ flex: 1, textAlign: 'center' }}>
            Things to do
          </span>
          <span className="text-right" style={{ marginLeft: 'auto' }}>
            <img
              width="30px"
              src="/assets/img/close.svg"
              alt="Close Icon"
              onClick={handleGoBack}
            />
          </span>
        </p>
        <section className="border_main">
          <section>
            <div>
              <div>
                <section className="row">
                  <div className="col-md-5">
                    <div style={{ position: 'relative' }}>
                      <img
                        src="/assets/img/destination/swim.png"
                        width="90%"
                        className="mb-3"
                        alt="Swim"
                      />
                      <p className="direction_activity_photo first">
                        <img src="/assets/img/left.png" alt="Left" />
                      </p>
                      <p className="direction_activity_photo second">
                        <img src="/assets/img/right.png" alt="Right" />
                      </p>
                    </div>
                    <p>
                      <img src="/assets/img/maps_set.svg" width="30px" alt="Maps Icon" /> 
                      <span> {data.data.address} </span>
                    </p>
                  </div>
                  <div className="col-md-7">
                    <section>
                      <div className="d-flex justify-content-between">
                        <h2 className="card_over_second_title">{data.data.activity_name}</h2>
                        <p className="heart">
                          <img src="/assets/img/heart.svg" alt="Heart Icon" />
                        </p>
                      </div>
                      <p className="over_card">
                        <span>
                          <i className="bi bi-star-fill text-warning"></i>
                          <i className="bi bi-star-fill text-warning"></i>
                          <i className="bi bi-star-fill text-warning"></i>
                          <i className="bi bi-star-fill text-warning"></i>
                          <i className="bi bi-star-fill text-warning"></i>
                        </span>
                        <span> 5.0 (190) See reviews</span>
                      </p>
                      <div className="description_activities">
                        {data.data.description}
                      </div>
                    </section>
                  </div>
                </section>
              </div>
            </div>
          </section>
        </section>
      </section>
    </div>
  );
};

export default DestinationMapsDetails;
