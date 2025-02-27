import React, {useEffect, useState}  from 'react';
import MapComponent from '../components/map_component';
import { Link } from 'react-router-dom';
import { setMaxIdleHTTPParsers } from 'http';
import HOSTNAME_WEB from '../../admin/constants/hostname';


interface DestinationInfo {icon:string, title:string, description:string}
interface ExporeMoreAboutInterface {img:string, text:string }

const MixDestinationLayout = (data: any) => {
  
  var data= data.data;
  
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
            { pathMeteoPath != null &&
            <section className="meteo">
                <img 
                    src={`${HOSTNAME_WEB}${pathMeteoPath}`}
                />
            </section>
            }
            <section>
              <h3 className='moreExploreDestination mt-5'>Explore More About the Destination</h3>
               <section className='d-flex justify-content-around'>
                  <Link to={`/destination/cultury/${data?.id}`} style={{display:'none'}}>
                    <ExporeMoreAbout
                        img="/assets/img/culture.png"
                        text="Cultures"
                      />
                  </Link>
                  <Link to={`/destination/activity/${data?.id}`}>
                  <ExporeMoreAbout
                    img="/assets/img/thing-to-do.png"
                    text="Things to do"
                  />
                    </Link>
                  <Link to={`/destination/pratique-info/${data?.id}`}>
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

const Meteo = ()=>{
  return (<article className='meteoCard'>
    <div>
        <p> mois</p>
        <p> Dégrée </p>
    </div>

  </article>)
}
export   {ExporeMoreAbout};
export default MixDestinationLayout;

