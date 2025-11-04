import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import "../src/App.css";
import RouteDisplay from "./RouteDisplay.jsx";

function App() {
  const position = { lat: 35.5951, lng: -82.5515 };
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const mapId = "8b62caca0b763002ed828fee";

  const origin = {
    lat: 35.5951,
    lng: -82.5515,
  };
  const destination = {
    lat: 35.5951,
    lng: -82.5915,
  };

  return (
    <>
      <APIProvider
        apiKey={apiKey}
        onLoad={() => console.log("✅ Google Maps API loaded")}
        onError={(e) => console.error("❌ Maps API failed to load", e)}
      >
        <div
          style={{
            width: "50vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "left",
            border: "2px solid red",
          }}
        >
          <Map
            center={position}
            zoom={12}
            mapId={mapId}
            controlled={true}
            gestureHandling="greedy"
            disableDefaultUI={false}
            zoomControl={true}
            mapTypeControl={true}
            style={{ width: "100%", height: "100%" }}
          >
            <RouteDisplay origin={origin} destination={destination} />

            {/* <AdvancedMarker position={position} /> */}
          </Map>
        </div>
      </APIProvider>

      <div className="input">
        <label>
          Input: <input type="text" name="test" />
        </label>
      </div>
    </>
  );
}
export default App;
