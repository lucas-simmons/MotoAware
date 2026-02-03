import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import "../src/App.css";
import RouteDisplay from "./RouteDisplay.jsx";
import React, { useMemo, useState } from "react";
import PlaceAutocompleteInput from "./PlaceInput.jsx";
import "../src/MapUI.css";
import Header from "./Header.jsx";
import Description from "./Description.jsx";

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
      <div className="page">
        <APIProvider
          apiKey={apiKey}
          libraries={["places", "geometry", "routes"]}
          onLoad={() => console.log("Google Maps API loaded")}
          onError={(e) => console.error("Maps API failed to load", e)}
        >
          <Header />
          <div
            style={{
              width: "100vw",
              height: "100vh",
              justifyContent: "center",
              marginTop: "30px",
              alignContent: "center",
            }}
            className="content"
          >
            <div style={{ justifyItems: "center" }}>
              <div
                style={{
                  padding: "1rem",
                  background: "#344469df",
                  color: "black",
                }}
                className="places"
              >
                <PlaceAutocompleteInput
                  label="Origin"
                  onSelect={(place) => {
                    console.log("Origin selected:", place);
                    setOrigin(place);
                  }}
                  className="entry"
                />
                <PlaceAutocompleteInput
                  label="Destination"
                  onSelect={(place) => {
                    console.log("Destination selected:", place);
                    setDestination(place);
                  }}
                  className="entry"
                />
                <button className="show-route" onClick={handleShowRoute}>
                  Show Route
                </button>
              </div>
            </div>
            <Map
              defaultCenter={position}
              defaultZoom={12}
              mapId={mapId}
              gestureHandling="greedy"
              disableDefaultUI={false}
              zoomControl={true}
              mapTypeControl={true}
              style={{ width: "100%", height: "100%", display: "flex" }}
              className="map-container"
            >
              <div className="descript">
                <Description />
                {showRoute && origin && destination && (
                  <RouteDisplay origin={origin} destination={destination} />
                )}
              </div>
            </Map>
          </div>
        </APIProvider>
      </div>
    </>
  );
};
export default App;
