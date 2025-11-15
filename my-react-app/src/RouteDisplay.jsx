import { Map, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import React, { useState, useEffect } from "react";
import { computeDetailedCurvature } from "./curvature.js"; // we'll add this file

function RouteDisplay({ origin, destination }) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const coreLibrary = useMapsLibrary("core");
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [hasFitBounds, setHasFitBounds] = useState(false);
  const [curvature, setCurvature] = useState(null);

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(
      new routesLibrary.DirectionsRenderer({
        map,
        preserveViewport: true,
      })
    );
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer || !origin || !destination)
      return;

    directionsService.route(
      {
        origin,
        destination,
        travelMode: "DRIVING",
        provideRouteAlternatives: true,
      },
      (response, status) => {
        if (status === "OK") {
          const firstRoute = response.routes[0];
          setSelectedRoute(firstRoute);
          directionsRenderer.setDirections(response);

          const pathCoords = firstRoute.overview_path.map((p) => ({
            lat: p.lat(),
            lng: p.lng(),
          }));

          const result = computeDetailedCurvature(pathCoords);

          setCurvature(result);
          console.log("avgAngleDeg", result.avgAngleDeg);
          console.log("avgCurvatureRadPerM", result.avgCurvatureRadPerM);
          console.log(
            "integratedCurvatureRad",
            result.integratedCurvature,
            "=> degrees",
            (result.integratedCurvature * 180) / Math.PI
          );

          if (coreLibrary && map && !hasFitBounds) {
            const bounds = new coreLibrary.LatLngBounds();
            firstRoute.overview_path.forEach((p) => bounds.extend(p));
            map.fitBounds(bounds);
            setHasFitBounds(true);
          }
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );
  }, [
    directionsService,
    directionsRenderer,
    origin,
    destination,
    coreLibrary,
    map,
    hasFitBounds,
  ]);

  return (
    <div>
      {selectedRoute && (
        <div>
          <h3>Selected Route Summary:</h3>
          <p>{selectedRoute.summary}</p>
          {curvature !== null && <p>Average Curvature: radians</p>}
        </div>
      )}
    </div>
  );
}
export default RouteDisplay;
