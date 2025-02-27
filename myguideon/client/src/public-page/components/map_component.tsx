import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import HOSTNAME_WEB from "../../admin/constants/hostname";
import { useParams } from "react-router-dom";


// Interface des données d'activité
interface Activity {
  destinationID: string | number;
  destinationName: string;
  activitiesName: string;
  position: [number, number];
  activitiesID: string | number;
  icon: string;
  activityStatus: string;
  pos: [number, number]
}

const MapComponent = ({ height = "100vh" }) => {
  const { id } = useParams<{ id: string }>(); // Récupérer l'id de l'URL
  const navigate = useNavigate();
  const [data, setData] = useState<Activity[]>([]);
  
  const [destinationPosition, setDestinationPosition] = useState<[number, number] | null>(
    null
  );
  
  const [mapZoom, setMapZoom] = useState<number>(13); // Zoom par défaut


  const fetchActivities = async () => {
    try {
      const response = await fetch(`${HOSTNAME_WEB}/destination`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données.");
      }
  
      const destinations = await response.json();
      let activitiesData: Activity[] = [];
      let pos;
  
      // Filtrer les données de la destination correspondant à l'ID
      const filteredDestinations = destinations.filter((e: any) => e.id == id);
      if (filteredDestinations.length > 0) {

        pos = filteredDestinations[0]; // Prend la première correspondance

        pos =  JSON.parse(pos.basic_info);

        setDestinationPosition([pos.lat, pos.lon]);


      }
  
      // Transformation des données pour récupérer les activités
      activitiesData = destinations.flatMap((destination: any) => {
        try {
          const basicInfo = JSON.parse(destination.basic_info || "{}");
          const destinationID = destination.id;
          const destinationName = basicInfo.destinationName || "Inconnu";
  
          // Vérifier si destination.activities existe et est un JSON valide
          const activities = destination.activities
            ? JSON.parse(destination.activities)
            : [];
  
          // Construire les données des activités
          return activities.map((activity: any) => ({
            destinationID: destinationID,
            destinationName: destinationName,
            activitiesName: activity.activity_name || "Activité sans nom",
            activitiesID: activity.id,
            position: [
              Number(activity.lat) || 0, 
              Number(activity.lon) || 0
            ], // Evite les NaN
            icon: activity.icon || "default-icon.png",
            activityStatus: activity.status || "Unknown",
            destinationPosition: [
              Number(basicInfo.lat) || 0, 
              Number(basicInfo.lon) || 0
            ]
          }));
        } catch (err) {
          console.error("Erreur lors du traitement d'une destination :", err);
          return [];
        }
      });
  
      // Mise à jour du state avec les activités
      setData(activitiesData);
    } catch (error) {
      console.error("Erreur lors de la récupération des activités :", error);
    }
  };
  
  

  useEffect(() => {
    fetchActivities();
    console.log('testing', data);
  }, [id]); // Relancer si l'id de l'URL change

  // Centrer dynamiquement la carte
  const DynamicMapCenter = () => {
    const map = useMap();

    useEffect(() => {
      if (destinationPosition) {
        map.setView(destinationPosition, mapZoom); // Centrer sur la position utilisateur
      }
    }, [destinationPosition, map, mapZoom]);

    return null;
  };

  const handleMarkerClick = (link: string) => {
    navigate(link); // Redirection
  };

  const cityPosition: [number, number] = destinationPosition || [48.8049, 2.1204]; // Position par défaut (Paris)

  return (
    <MapContainer
      center={cityPosition}
      zoom={mapZoom}
      style={{ height: height, width: "100%" }}
    >
      <DynamicMapCenter />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {destinationPosition && (
        <Circle
           center={destinationPosition} 
          radius={2500}
          color="#007BFF"
          fillColor="lightblue"
          fillOpacity={0.3}
          weight={1}
        />
      )}
      {data.map((activity) => (
        <Marker
          key={activity.activitiesID}
          position={activity.position}
          icon={new L.Icon({
            iconUrl: `${HOSTNAME_WEB}/public/uploads/destination/activities/${activity.icon}`,
            iconSize: [80, 80], // Taille de l'icône
            className: "rounded-icon",
          })}
          eventHandlers={{
            click: () =>
              handleMarkerClick(`/destination/maps/details/${activity.destinationID}/${activity.activitiesID}`),
          }}
        />
      ))}
    </MapContainer>
  );
};

export default MapComponent;

// CSS pour les icônes
const styles = `
  .rounded-icon {
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid white;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  }
`;

// Injecter les styles dans le document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
