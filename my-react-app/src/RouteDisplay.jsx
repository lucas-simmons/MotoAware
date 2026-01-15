import { Map, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import React, { useState, useEffect } from "react";
import { computeDetailedCurvature } from "./curvature.js";
import CurvatureLine from "./CurvatureLine.jsx";
import RouteLine from "./RouteLine.jsx";

function RouteDisplay({ origin, destination }) {
  const map = useMap();
  // const mapsLib = useMapsLibrary("maps");
  const routesLibrary = useMapsLibrary("routes");
  const coreLibrary = useMapsLibrary("core");

  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);

  const [routes, setRoutes] = useState([]);
  const [curvatures, setCurvatures] = useState([]);
  const [showLine, setShowLine] = useState([false, false, false]);
  const [showCurves, setShowCurves] = useState([false, false, false]);
  const [hasFitBounds, setHasFitBounds] = useState(false);

  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(
      new routesLibrary.DirectionsRenderer({
        map,
        preserveViewport: true,
        polylineOptions: {
          strokeColor: "#4c00ffff",
          strokeOpacity: 0.4,
          strokeWeight: 2,
        },
      })
    );
  }, [routesLibrary, map]);

  // Request routes
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
        if (status !== "OK") {
          console.error("Directions request failed:", status);
          return;
        }

        const allRoutes = response.routes.slice(0, 3);
        setRoutes(allRoutes);
        directionsRenderer.setDirections(response);

        setRoutes(
          allRoutes.map((r) =>
            r.overview_path.map((p) => ({
              lat: p.lat(),
              lng: p.lng(),
            }))
          )
        );

        if (coreLibrary && map && !hasFitBounds) {
          const bounds = new coreLibrary.LatLngBounds();
          allRoutes[0].overview_path.forEach((p) => bounds.extend(p));
          map.fitBounds(bounds);
          setHasFitBounds(true);
        }

        const newCurvatures = allRoutes.map((r) => {
          const leg = r.legs[0];
          const steps = leg.steps;
          const coords = steps.flatMap((s) =>
            s.path.map((p) => ({ lat: p.lat(), lng: p.lng() }))
          );
          return computeDetailedCurvature(coords);
        });

        setCurvatures(newCurvatures);
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

  function toggleLine(i) {
    setShowLine((old) => {
      const copy = [...old];
      copy[i] = !copy[i];
      return copy;
    });
  }

  function toggleCurve(i) {
    setShowCurves((old) => {
      const copy = [...old];
      copy[i] = !copy[i];
      return copy;
    });
  }

  return (
    <div>
      <h2>Route Options</h2>
      {routes.map((route, i) => (
        <div key={i} style={{ marginBottom: "12px" }}>
          <h3>
            Route {i + 1}: {route.summary}
          </h3>

          <button onClick={() => toggleLine(i)}>
            {showLine[i] ? "Hide Line" : "Show Line"}
          </button>

          <button onClick={() => toggleCurve(i)}>
            {showCurves[i] ? "Hide Curves" : "Show Curves"}
          </button>

          {showLine[i] && curvatures[i] && (
            <RouteLine coords={curvatures[i].routeCoords} color="#000000" />
          )}

          {showCurves[i] && curvatures[i] && (
            <CurvatureLine
              coords={curvatures[i].routeCoords}
              profile={curvatures[i].curvatureProfile}
            />
          )}
        </div>
      ))}

      {/* {routes.map((route, i) => (
        <div key={i} style={{ marginBotom: "12px" }}>
          <h3>
            Route {i + 1}: {route.summary}
          </h3>

          <button onClick={() => toggleLine(i)}>
            {showLine[i] ? "Hide Route" : "Show Route"}
          </button>

          {curvatures[i] && (
            <>
              <button onClick={() => toggleCurve(i)}>
                {showCurves[i] ? "Hide Curves" : "Show Curves"}
              </button>

              {showCurves[i] && (
                <CurvatureLine
                  coords={curvatures[i].routeCoords}
                  profile={curvatures[i].curvatureProfile}
                />
              )}
            </>
          )}
        </div>
      ))} */}
    </div>
  );
}

export default RouteDisplay;
