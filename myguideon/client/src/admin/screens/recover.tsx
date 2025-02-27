import React, { useState, useEffect } from "react";
import axios from "axios";

// Définir les types pour un lieu
interface PlaceDetails {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  state?: string; // La région ou l'état, si disponible
  displayName: string; // Le nom complet de l'adresse
}

const LocationSearch = () => {
  const [query, setQuery] = useState<string>(""); // État pour gérer la saisie de l'utilisateur
  const [suggestions, setSuggestions] = useState<any[]>([]); // Suggestions de lieux
  const [placeDetails, setPlaceDetails] = useState<PlaceDetails | null>(null); // Détails sur le lieu sélectionné
  const [userLocation, setUserLocation] = useState<any>(null); // Informations géographiques basées sur l'adresse de l'utilisateur

  // API pour récupérer la géolocalisation de l'utilisateur
  useEffect(() => {
    axios.get("https://ipapi.co/json/")
      .then((response) => {
        setUserLocation(response.data);
      })
      .catch((error) => {
        console.error("Erreur de géolocalisation", error);
      });
  }, []);

  // Fonction pour récupérer les lieux en fonction de la recherche de l'utilisateur
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setQuery(input);

    if (input.length > 2) {
      // API Nominatim pour rechercher le lieu
      axios
        .get("https://nominatim.openstreetmap.org/search", {
          params: {
            q: input, // Lieu recherché
            format: "json", // Format JSON pour la réponse
            addressdetails: 1, // Inclure les détails de l'adresse
            limit: 5, // Limiter à 5 résultats
          },
        })
        .then((response) => {
          const results = response.data;
          setSuggestions(results); // Mettre à jour les suggestions avec les résultats trouvés
        })
        .catch((error) => {
          console.error("Erreur de recherche de lieu", error);
          setSuggestions([]);
        });
    } else {
      setSuggestions([]);
    }
  };

  // Fonction pour récupérer les informations détaillées d'un lieu sélectionné
  const handlePlaceSelect = (place: any) => {
    setQuery(place.display_name); // Mettre à jour le champ de recherche avec le nom complet du lieu
    setPlaceDetails({
      city: place.address.city || "Non précisé",
      country: place.address.country,
      latitude: place.lat,
      longitude: place.lon,
      state: place.address.state || "",
      displayName: place.display_name,
    });
    setSuggestions([]); // Réinitialiser les suggestions
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Recherche de lieu avec OpenStreetMap</h1>
      <input
        type="text"
        value={query}
        onChange={handleSearchChange}
        placeholder="Tapez un lieu (ex: Louvre)"
        style={{ width: "300px", padding: "10px" }}
      />
      
      {/* Afficher les suggestions de lieux */}
      <ul style={{ padding: 0 }}>
        {suggestions.map((place, index) => (
          <li
            key={index}
            onClick={() => handlePlaceSelect(place)}
            style={{
              listStyleType: "none",
              cursor: "pointer",
              padding: "5px",
              background: "#f1f1f1",
              marginBottom: "5px",
            }}
          >
            {place.display_name}
          </li>
        ))}
      </ul>

      {/* Afficher les informations détaillées sur le lieu sélectionné */}
      {placeDetails && (
        <div>
          <h2>Détails sur le lieu sélectionné</h2>
          <p><strong>Nom complet:</strong> {placeDetails.displayName}</p>
          <p><strong>Ville:</strong> {placeDetails.city}</p>
          <p><strong>Pays:</strong> {placeDetails.country}</p>
          <p><strong>Latitude:</strong> {placeDetails.latitude}</p>
          <p><strong>Longitude:</strong> {placeDetails.longitude}</p>
          {placeDetails.state && <p><strong>État/Region:</strong> {placeDetails.state}</p>}
        </div>
      )}

      {/* Afficher la géolocalisation de l'utilisateur */}
      {userLocation && (
        <div>
          <h2>Votre emplacement actuel</h2>
          <p><strong>Votre pays:</strong> {userLocation.country_name}</p>
          <p><strong>Votre ville:</strong> {userLocation.city || "Non précisé"}</p>
          <p><strong>Latitude:</strong> {userLocation.latitude}</p>
          <p><strong>Longitude:</strong> {userLocation.longitude}</p>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;