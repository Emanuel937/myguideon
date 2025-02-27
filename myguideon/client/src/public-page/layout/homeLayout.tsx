import React, { useEffect, useState, useRef, MouseEventHandler } from "react";
import HeaderLayout from "./HeaderLayout";
import "../assets/styles/css/home.css";
import { ExporeMoreAbout } from "./mixedDestinationLayout";
import { Link } from "react-router-dom";
import HOSTNAME_WEB from "../../admin/constants/hostname";
import { useNavigate } from "react-router-dom";

// Définition des types pour les composants
interface ContainerDestinationProps {
  componentData: any;
}

interface NavigationItensProps {
  icon: string;
  onClick: MouseEventHandler<HTMLDivElement>; // Utilisation du type MouseEventHandler pour gérer l'événement click
}

interface CustomerActivityBookingMapProps {
  img: string;
  name: string;
  color:string
}

const HomeLayout: React.FC = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<any[]>([]); // Utilisation de any[] pour stocker les données
  const scrollContainerRef = useRef<HTMLDivElement>(null); // Référence au conteneur scrollable
  const handleFetchData = async () => {
    try {
      const response = await fetch(`${HOSTNAME_WEB}/destination`);
  
      if (!response.ok) {
        throw new Error("There was an error fetching the data.");
      }
  
      const data = await response.json();
  
      // Filtrer uniquement les données avec un statut "Published"
      const publishedData = data.filter((item:any) => {
        const basicInfo = JSON.parse(item.basic_info);
        return basicInfo.status === "Published";
      });
  
      // Mettre à jour l'état avec les données publiées
      setData(publishedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  

  useEffect(() => {
    handleFetchData();
  }, []);

  // Fonction pour gérer le scroll à gauche
  const scrollLeft = (): void => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft -= 300; // Vous pouvez ajuster cette valeur pour modifier la distance du défilement
    }
  };

  // Fonction pour gérer le scroll à droite
  const scrollRight = (): void => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += 300; // Vous pouvez ajuster cette valeur pour modifier la distance du défilement
    }
  };

  return (
    <div className="homeBody">
      <HeaderLayout />
      <section
        className="container_home"
        style={{ backgroundImage: `url('/assets/img/world_tree.png')` }}
      >
        <section className="customer_section d-flex justify-content-between">
          <h1 className="header_title">Explore Destination</h1>
          <section className="d-flex">
            <CustomerActivityBookingMap
              img={"icon-new.png"}
              name={"Activities Booking"}
              color={"#007BFF"}
            />
            <Link to="/map/search/true">
              <CustomerActivityBookingMap
                img={"map_booking.png"}
                name={"Switch to Guide Map"}
                color={"#89C947"}
              />
            </Link>
          </section>
        </section>
        <section
          style={{ backgroundImage: `url('/assets/img/world_tree.png')` }}
          className="shadow_"
        >
          <article className="menu_active d-flex justify-content-between container_of_container"  style={{display:'none'}}>
            <section className="d-flex tab bg-white" >
              <div className="menu_active_tab" style={{display:'none'}} >
                <p className="tab_title ">
                  <img src={"/assets/img/expore.png"} />
                  Explore Destinations
                </p>
              </div>
              <div style={{display:'none'}}>
                <p className="tab_title">
                  <img src={"/assets/img/fly.png"} />
                  Explore Countries
                </p>
              </div>
            </section>
            <section className="d-flex navigationStyle">
              <NavigationItens icon={"left-white.svg"} onClick={scrollLeft} />
              <NavigationItens icon={"right-white.svg"} onClick={scrollRight} />
            </section>
          </article>
          <article className="homeMainContent d-flex" ref={scrollContainerRef} style={{overflowY:'hidden', overflowX:'hidden', transition:'0.3s all'}}>
            {data.map((e) => {
              return <ContainerDestination key={e.id} componentData={e} />;
            })}
          </article>
        </section>
      </section>
    </div>
  );
};

// Composant ContainerDestination
const ContainerDestination: React.FC<ContainerDestinationProps> = ({
  componentData,
}) => {
  const [cover, setCover] = useState({ cover: `${HOSTNAME_WEB}${componentData.imageCover}` });
  const basicInfo = JSON.parse(componentData.basic_info);
  let gallery = JSON.parse(componentData.gallery);
  gallery = gallery.slice(0, 7);

  const handleChangePhoto = (e: React.MouseEvent<HTMLImageElement>): void => {
    setCover({ cover: (e.target as HTMLImageElement).src });
  };

  return (
    <div>
      <section className="home_destination_card_container">
        <article
          className="home_destination_card "
          style={{ backgroundImage: `url('${cover.cover}')` }}
        ></article>
        <article className="absolute_photo">
          {gallery.map((image: any) => (
            <img
              className="smallQuarePhoto"
              src={`${HOSTNAME_WEB}${image}`}
              onClick={handleChangePhoto}
              alt="Thumbnail"
            />
          ))}
        </article>
        <section  className="d-flex home_destination_card_title justify-content-between" >
          <h2 className="homeMainContentTitle">{basicInfo.destinationName}</h2>
          <p className="homeMainYellowContainer" style={{display:'none'}} >
            <img src={"/assets/img/person.svg"} />
            <span>7.1/10 </span>
          </p>
        </section>
        <div className="d-flex justify-content-between mt-4">
          <section className="langage_container">
            <article className="d-flex">
              <img
                src={"/assets/img/global.svg"}
                className="iconLangage"
              />
              <div>
                <p>
                  <span className="first_text">Languages</span> <br />
                  <span className="second_text">
                    {Array.isArray(basicInfo.language) && basicInfo.language.length >= 1
                      ? basicInfo.language.join(" , ")
                      : basicInfo.language}
                  </span>
                </p>
              </div>
            </article>
          </section>
          <section className="langage_container">
            <article className="d-flex">
              <img
                src={"/assets/img/dolar.svg"}
                className="iconLangage"
              />
              <div>
                <p>
                  <span className="first_text">Currencies</span> <br />
                  <span className="second_text">{basicInfo.currency}</span>
                </p>
              </div>
            </article>
          </section>
        </div>
        <section className="budget_container">
          <article className="d-flex">
            <img
              src={"/assets/img/dollarpack.svg"}
              className="iconLangage"
            />
            <div>
              <p>
                <span className="first_text">Budget</span>{" "}
                <br />
                <span className="second_text">
                  {basicInfo.budget}{"  "}
                          for every week spent
                </span>
              </p>
            </div>
          </article>
        </section>
        <section
          className="meteo_container"
          style={{
            backgroundImage: `url(${HOSTNAME_WEB}${basicInfo.imgpath})`,
          }}
        ></section>
        <p className="expore_more_home">Explore more </p>
        <div className="explore_flex_container">
          <section className="d-flex exporeMoreHomePage">
            <Link to={`/destination/cultury/${componentData.id}`} style={{display:'none'}}>
              <ExporeMoreAbout img="/assets/img/culture.png" text="Cultures"  />
            </Link>
            <Link to={`/destination/history/${componentData.id}`} style={{display:'none'}}>
              <ExporeMoreAbout img="/assets/img/historic.svg" text="History" />
            </Link>
            <Link to={`/destination/activity/${componentData.id}`}>
              <ExporeMoreAbout img="/assets/img/thing_to_do.svg" text="Things to do" />
            </Link>
            <Link to={`/destination/usefull-info/${componentData.id}`}>
              <ExporeMoreAbout img="/assets/img/pratical-info.png" text="Pratical info" />
            </Link>
          </section>
          <section className="see_more">
            <Link to={`/destination/overview/${componentData.id}`} aria-label="View Destination Overview">
              <img
                src="/assets/img/right-white.svg"
                alt="Arrow pointing to the right"
              />
            </Link>
          </section>
        </div>
      </section>
    </div>
  );
};


const NavigationItens: React.FC<NavigationItensProps> = ({ icon, onClick }) => {
  return (
    <div className="nativation_container" onClick={onClick} style={{ cursor: "pointer" }}>
      <p className="navigation bg-primary">
        <span>
          <img src={`/assets/img/${icon}`} alt="Navigation Icon" />
        </span>
      </p>
    </div>
  );
};

const CustomerActivityBookingMap: React.FC<CustomerActivityBookingMapProps> = ({ img, name , color}) => {
  return (
    <div className="CustomerActivityBookingMap" style={{borderColor:color}}>
      <p>{name}</p>

      <img className="CustomerActivityBookingMap_img" src={`/assets/img/${img}`} alt={name} />
    </div>
  );
};

export default HomeLayout;
