import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import HOSTNAME_WEB from "../../admin/constants/hostname";
import { useParams } from "react-router-dom";

interface DestinationPlace {
  destinationID: string | number;
  destinationName: string;
  destinationPosition: [number, number];
  destinationStatus: number | string;
  icon: string | null;
}

const MIN_ZOOM_VISIBLE = 7; // Niveau de zoom minimal pour afficher les icônes

const DestinationMap: React.FC<{ height?: string }> = ({ height = "100vh" }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<DestinationPlace[]>([]);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [mapZoom, setMapZoom] = useState<number>(5); // Zoom par défaut

  // Récupérer la position de l'utilisateur
  const fetchUserPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition([position.coords.latitude, position.coords.longitude]);
          setMapZoom(10); // Zoom plus proche
        },
        (error) => {
          console.error("Erreur lors de la récupération de la position :", error);
        }
      );
    } else {
      console.error("La géolocalisation n'est pas prise en charge par ce navigateur.");
    }
  };

  // Récupérer les destinations
  const fetchActivities = async () => {
    try {
      const response = await fetch(`${HOSTNAME_WEB}/destination`);
      if (!response.ok) throw new Error("Erreur lors de la récupération des données.");

      const destinations = await response.json();

      const destinationList: DestinationPlace[] = destinations.flatMap((destination: any) => {
        const basicInfo = JSON.parse(destination.basic_info || "{}");
        const destinationID = destination.id;
        const destinationName = basicInfo.destinationName;
        const destinationLat = basicInfo.lat;
        const destinationLon = basicInfo.lon;
        const destinationStatus = basicInfo.status;
        const imgFirst = JSON.parse(destination.gallery)[0];
        const destinationPosition: [number, number] = [destinationLat, destinationLon];

        return [
          {
            destinationID,
            destinationName,
            destinationPosition,
            destinationStatus,
            icon: imgFirst,
          },
        ];
      });

      const filterDestinationList = destinationList.filter((e) => e.destinationStatus == "Published");
      setData(filterDestinationList);
    } catch (error) {
      console.error("Erreur lors du chargement des destinations :", error);
    }
  };

  useEffect(() => {
    fetchActivities();
    fetchUserPosition();
  }, [id]);

  // Composant pour suivre le zoom de la carte
  const ZoomHandler: React.FC = () => {
    const map = useMapEvents({
      zoomend: () => {
        setMapZoom(map.getZoom()); // Met à jour le zoom en temps réel
      },
    });

    return null;
  };

  // Fonction pour calculer dynamiquement la taille des icônes en fonction du zoom
  const getIconSize = (zoom: number): [number, number] => {
    if (zoom < MIN_ZOOM_VISIBLE) return [0, 0]; // Cacher l'icône si trop loin
    const size = Math.max((zoom - MIN_ZOOM_VISIBLE) * 10, 20); // Grandit avec le zoom
    return [size, size];
  };

  const handleMarkerClick = (link: string) => {
    navigate(link); // Redirection vers la destination
  };

  const cityPosition: [number, number] = userPosition || [48.8049, 2.1204]; // Position par défaut (Paris)

  return (
    <MapContainer center={cityPosition} zoom={mapZoom} style={{ height: height, width: "100%" }}>
      <ZoomHandler />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {userPosition && (
        <Circle center={userPosition} radius={10000} color="#007BFF" fillColor="lightblue" fillOpacity={0.3} weight={1} />
      )}
      {mapZoom >= MIN_ZOOM_VISIBLE && // Afficher les icônes seulement si zoom suffisant
        data.map((d) => (
          <Marker
            key={d.destinationID}
            position={d.destinationPosition}
            icon={new L.Icon({
              iconUrl: `${HOSTNAME_WEB}${d.icon}`,
              iconSize: getIconSize(mapZoom), // Taille dynamique
              className: "rounded-icon",
            })}
            eventHandlers={{
              click: () => handleMarkerClick(`/destination/overview/${d.destinationID}`),
            }}
          />
        ))}
    </MapContainer>
  );
};

export default DestinationMap;
