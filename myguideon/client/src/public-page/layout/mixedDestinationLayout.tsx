import React, {useEffect, useState}  from 'react';
import MapComponent from '../components/map_component';
import { Link } from 'react-router-dom';
import HOSTNAME_WEB from '../../admin/constants/hostname';
import { useParams } from 'react-router-dom';
import axios from "axios";
  


interface DestinationInfo {icon:string, title:string, description:string}
interface ExporeMoreAboutInterface {img:string, text:string }

const MixDestinationLayout = (data: any) => {
  
  var data    = data.data;
  const {id}  = useParams();
  
  type pathStatus = null |string
  const [pathMeteoPath, setPathMeteoPath] = useState<pathStatus>(null);

  useEffect(()=>{

    console.log("path set is :", data);
    console.log("imgpath is:", data?.imgpath);

    setPathMeteoPath(data?.imgpath);

  })

    return (
        <div id="Mix">
            <div className='d-flex '>
              <div>
                <h2 className="mt-5">{data?.destinationName}</h2>
                <div className="d-flex">
                    <DestinationInfo
                        icon="dolar.svg"
                        title="Currencies"
                        description={data?.currency}
                    />
                     <DestinationInfo
                        icon="global.svg"
                        title="Languages"
                        description= {Array.isArray(data?.language) && data?.language.length >= 1
                          ? data?.language.join(" , ")
                          : data?.language}
                    />
                     <DestinationInfo
                        icon="dollarpack.svg"
                        title="Budget "
                        description={`${data?.budget} ${" "} for a every week spent`}
                    />
                   
                </div>
                </div>
                <div style={{display:'none'}}>
                  <OverallRating/>
                </div>
               
            </div>
            <div>
                <Meteo
                lat ={data?.lat}
                lon={data?.lon}
                />
            </div>
            <section>
              <h3 className='moreExploreDestination mt-5'>Explore More About the Destination</h3>
               <section className='d-flex'>
                  <Link to={`/destination/cultury/${id}`} style={{display:'none'}}>
                    <ExporeMoreAbout
                        img="/assets/img/culture.png"
                        text="Cultures"
                      />
                  </Link>
                  <Link to={`/destination/activity/${id}`}>
                  <ExporeMoreAbout
                    img="/assets/img/thing-to-do.png"
                    text="Things to do"
                  />
                    </Link>
                  <Link to={`/destination/usefull-info/${id}`}>
                  <ExporeMoreAbout
                    img="/assets/img/pratical-info.png"
                    text="Pratical info"
                  />
                  </Link>
                  <Link to={`/destination/gallery/${data?.id}`}  style={{display:'none'}}>
                  <ExporeMoreAbout
                    img="/assets/img/galery.png"
                    text="Gallery"
                  />
                  </Link>
                  <Link to={`/destination/review/${data?.id}`} style={{display:'none'}}>
                    <ExporeMoreAbout
                      img="/assets/img/rating.png"
                      text="Notation"
                  />
                  </Link>

               </section>
               <h3 className='mb-5 mt-5'>Explore the Map</h3>
               <div className='map_right_margin'>
                  <MapComponent height='50vh'/>
               </div>
            </section>
        </div>
    )
}

const ExporeMoreAbout:React.FC<ExporeMoreAboutInterface> = ({img, text})=>{

  return <section className='explore-more'>
            <article>
                <img
                  src={img}
                />
            </article>
            <p className='expore-more-title'>{text}</p>
         </section>
}



const DestinationInfo:React.FC<DestinationInfo> = ({icon, title, description})=>{
    return (
        <div className='d-flex info-container' >
            <img
             src={`/assets/img/${icon}`}
            />
            <div>
                <p className="small-title"> {title} </p>
                <p className="small-description"> {description}</p>
            </div>
        </div>
    )
}



const OverallRating = () => {
    return (
      <div className="rating-container">
        <div className="overall-rating">
          <img src="/assets/img/person.svg"  className="icon" alt="User Icon" />
          <span className="rating-title">Overall Rating</span>
          <span className="rating-score">7.0/10</span>
        </div>
        <div className='d-flex sub-ratings-cotainer'>
          <div className="sub-ratings">
            <div className="rating-item">
              <img className='rating-iten-icon' src="/assets/img/money.svg" alt="Money Icon" />
              <span className='rating-iten-note'>8.0/10</span>
            </div>
            <div className="rating-item">
              <img src="/assets/img/food.svg" 
                className='rating-iten-icon'  alt="Food Icon" />
              <span  className='rating-iten-note'>9.5/10</span>
            </div>
          </div>
          <div className="sub-ratings">
            <div className="rating-item">
              <img src="/assets/img/castle.svg" className='rating-iten-icon'  alt="Castle Icon" />
              <span  className='rating-iten-note'>7.9/10</span>
            </div>
            <div className="rating-item">
              <img src="/assets/img/security.svg" className='rating-iten-icon'  alt="Security Icon" />
              <span  className='rating-iten-note'> 6.5/10</span>
            </div>
          </div>
         </div>
      </div>
    );
  };

  
  const Meteo = ({ lon, lat }: { lon: number; lat: number }) => {
    const [monthlyTemperatures, setMonthlyTemperatures] = useState<
      { month: string; variations: string; maxTemp: number, minTemp:number }[]
    >([]);
  
    useEffect(() => {
      const fetchWeatherData = async () => {
        try {
          const currentYear = new Date().getFullYear();
          const startYear = currentYear - 2; // 2 dernières années
  
          const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          ];
  
          let monthlyData: Record<number, { minTemps: number[]; maxTemps: number[] }> = {};
  
          for (let year = startYear; year < currentYear; year++) {
            const response = await axios.get(
              `https://archive-api.open-meteo.com/v1/archive`,
              {
                params: {
                  latitude: lat,
                  longitude: lon,
                  start_date: `${year}-01-01`,
                  end_date: `${year}-12-31`,
                  daily: "temperature_2m_max,temperature_2m_min",
                  temperature_unit: "celsius",
                  timezone: "Europe/Paris",
                },
              }
            );
  
            response.data.daily.time.forEach((date: string, index: number) => {
              const monthIndex = new Date(date).getMonth();
              if (!monthlyData[monthIndex]) {
                monthlyData[monthIndex] = { minTemps: [], maxTemps: [] };
              }
              monthlyData[monthIndex].minTemps.push(response.data.daily.temperature_2m_min[index]);
              monthlyData[monthIndex].maxTemps.push(response.data.daily.temperature_2m_max[index]);
            });
          }
  
          // Transformer en format adapté
          const formattedData = Object.keys(monthlyData).map((monthIndex) => {
            const minTemps = monthlyData[Number(monthIndex)].minTemps;
            const maxTemps = monthlyData[Number(monthIndex)].maxTemps;
  
            // Calcul de la moyenne des températures minimales et maximales
            const minAvg = (minTemps.reduce((a, b) => a + b, 0) / minTemps.length).toFixed(1);
            const maxAvg = (maxTemps.reduce((a, b) => a + b, 0) / maxTemps.length).toFixed(1);
  
            return {
              month: months[Number(monthIndex)],
              variations: `${minAvg} - ${maxAvg}°C`, // Variation avec la moyenne
              maxTemp: Number(maxAvg),
              minTemp:Number(minAvg)
            };
          });
  
          setMonthlyTemperatures(formattedData);
        } catch (error) {
          console.error("❌ Erreur lors de la récupération des données météo :", error);
        }
      };
  
      fetchWeatherData();
    }, [lat, lon]);
  
    const SingleMeteo = ({ month, variations, maxTemp }: { month: string; variations: string; maxTemp: number }) => {
      let stationImage, backgroundColor;
      if (maxTemp < 8) {
        stationImage = "flower-station.png";
        backgroundColor = "#0097b2";
      } else if (maxTemp >= 3 && maxTemp < 10) {
        stationImage = "clound-station.png";
        backgroundColor = "#6cd7d9";
      } else {
        stationImage = "sun-station.png";
        backgroundColor = "#ffbd59";
      }
  
      return (
        <div className="singleMeteoContainer">
          <div className="singleMeteoHeader" style={{ backgroundColor }}>
            <img alt="station icon" src={`/assets/img/destination/${stationImage}`} />
          </div>
          <div className="singleMeteoBody">
            <p className="mois">{month}</p>
            <p className="singleMeteoBodyP">
              <span>{variations}</span>
            </p>
          </div>
        </div>
      );
    };
  
    return (
      <article className="meteoCard">
      
        <div
          style={{ backgroundImage: `url('/assets/img/destination/meteo-bg.png')` }}
          className="meteoCardFlex"
        >
          {monthlyTemperatures.map((e) => (
            <SingleMeteo key={e.month} month={e.month} variations={e.variations} maxTemp={e.minTemp} />
          ))}
        </div>
      </article>
    );
  };


export   {ExporeMoreAbout};
export default MixDestinationLayout;




