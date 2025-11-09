import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import "../src/App.css";
import RouteDisplay from "./RouteDisplay.jsx";
import React, { useMemo, useState } from "react";
import PlaceAutocompleteInput from "./PlaceInput.jsx";

const App = () => {
  const position = useMemo(() => ({ lat: 35.5951, lng: -82.5515 }), []);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const mapId = "8b62caca0b763002ed828fee";
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [showRoute, setShowRoute] = useState(false);

  const handleShowRoute = () => {
    console.log("Origin:", origin);
    console.log("Destination:", destination);

    if (!origin || !destination) {
      alert("Please select both an origin and destination!");
      return;
    }
    setShowRoute(true);
  };
  return (
    <>
      <APIProvider
        apiKey={apiKey}
        libraries={["places"]}
        onLoad={() => console.log("Google Maps API loaded")}
        onError={(e) => console.error("Maps API failed to load", e)}
      >
        <div
          style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "left",
            border: "2px solid red",
          }}
        >
          <div
            style={{
              padding: "1rem",
              background: "white",
              color: "black",
            }}
          >
            <PlaceAutocompleteInput
              label="Origin"
              onSelect={(place) => {
                console.log("Origin selected:", place);
                setOrigin(place);
              }}
            />
            <PlaceAutocompleteInput
              label="Destination"
              onSelect={(place) => {
                console.log("Destination selected:", place);
                setDestination(place);
              }}
            />
            <button onClick={handleShowRoute}>Show Route</button>
          </div>
          <Map
            defaultCenter={position}
            defaultZoom={12}
            mapId={mapId}
            gestureHandling="greedy"
            disableDefaultUI={false}
            zoomControl={true}
            mapTypeControl={true}
            style={{ width: "100%", height: "100%" }}
          >
            {showRoute && origin && destination && (
              <RouteDisplay origin={origin} destination={destination} />
            )}
          </Map>
        </div>
      </APIProvider>
    </>
  );
};
export default App;
