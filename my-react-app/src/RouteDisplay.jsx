import { Map, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import React, { useState, useEffect } from "react";

function RouteDisplay({ origin, destination }) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer || !origin || !destination)
      return;

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: "DRIVING",
        provideRouteAlternatives: true,
      },
      (response, status) => {
        if (status === "OK") {
          setRoutes(response.routes);
          setSelectedRoute(response.routes[0]); // Display first route by default
          directionsRenderer.setDirections(response);
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );
  }, [directionsService, directionsRenderer, origin, destination, routes]);

  return (
    <div>
      {/* You can display route summaries or alternatives here */}
      {selectedRoute && (
        <div>
          <h3>Selected Route Summary:</h3>
          <p>{selectedRoute.summary}</p>
        </div>
      )}
    </div>
  );
}
export default RouteDisplay;
