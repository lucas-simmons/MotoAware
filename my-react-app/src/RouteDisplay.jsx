import { Map, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import React, { useState, useEffect } from "react";
import {
  computeDetailedCurvature,
  computeAverageSpeedMph,
  estimateSpeedStats,
} from "./curvature.js";
import CurvatureLine from "./CurvatureLine.jsx";
import RouteLine from "./RouteLine.jsx";
import "../src/route.css";
import { Switch } from "antd";

function RouteDisplay({ origin, destination }) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const coreLibrary = useMapsLibrary("core");

  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);

  //const [setRouteCoords] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [curvatures, setCurvatures] = useState([]);
  const [showLine, setShowLine] = useState([false, false, false]);
  const [showCurves, setShowCurves] = useState([false, false, false]);

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
      }),
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

        drivingOptions: {
          departureTime: new Date(),
          trafficModel: "bestguess",
        },
      },
      (response, status) => {
        if (status !== "OK") {
          console.error("Directions request failed:", status);
          return;
        }

        const allRoutes = response.routes.slice(0, 3);
        setRoutes(allRoutes);
        directionsRenderer.setDirections(response);

        const allMetrics = allRoutes.map((route) => {
          const steps = route.legs[0].steps;

          const coords = steps.flatMap((step) =>
            step.path.map((p) => ({ lat: p.lat(), lng: p.lng() })),
          );

          const leg = route.legs[0];

          const curvature = computeDetailedCurvature(coords);
          const avgSpeed = computeAverageSpeedMph(steps);
          const speedStats = estimateSpeedStats(steps);
          const trafficLevel = computeTrafficLevel(
            leg.duration.value,
            leg.duration_in_traffic?.value,
          );

          const avgCurvature = curvature.avgCurvatureRadPerM;
          const trafficRatio =
            leg.duration_in_traffic?.value / leg.duration.value;
          const safetyScore = computeSafetyScore(
            avgCurvature,
            trafficRatio,
            avgSpeed,
          );

          return {
            ...curvature,
            avgSpeedMph: avgSpeed,
            estSpeed: speedStats.avgEstimatedSpeed,
            topSpeed: speedStats.topEstimatedSpeed,
            trafficLevel,
            safetyScore,
          };
        });

        setCurvatures(allMetrics);
      },
    );
  }, [
    directionsService,
    directionsRenderer,
    origin,
    destination,
    coreLibrary,
    map,
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

  function computeTrafficLevel(normalTime, trafficTime) {
    if (!trafficTime || !normalTime)
      return "Invalid Request: Time not provided";

    const ratio = trafficTime / normalTime;

    if (ratio < 1.05) return "🟢 Low 🟢";
    if (ratio < 1.25) return "🟠 Moderate 🟠";
    return "🔴 Heavy 🔴";
  }

  function computeSafetyScore(avgCurvature, trafficRatio, avgSpeed) {
    const traffic = Math.min((trafficRatio - 1) / 0.5, 1);
    const speed = Math.min((avgSpeed - 25) / 50, 1);

    const curvatureScore = Math.min(Math.pow(avgCurvature / 0.02, 2), 1);

    const overallScore = 0.3 * traffic + 0.2 * speed + 0.5 * curvatureScore;

    const safetyScore = Math.round((1 - overallScore) * 100);

    return safetyScore;
  }
  function buildGoogleMapsLink(origin, destination) {
    return `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&travelmode=driving`;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        padding: "10px",

        borderRadius: "24px",
        margin: "10px",
      }}
    >
      <h2>Route Options</h2>
      {routes.length > 0 &&
        routes.map((route, i) => (
          <div
            key={i}
            style={{
              margin: "12px",

              borderRadius: "24px",
            }}
          >
            <div
              style={{
                backgroundColor: "#a5876a",
                padding: "10px",
                boxShadow:
                  "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
              }}
            >
              <h3>
                Route {i + 1}: {routes[i].summary}
                <p
                  style={{
                    margin: "0px",
                    padding: "0px",
                    fontWeight: "normal",
                    fontSize: "12px",
                    color: "black",
                  }}
                >
                  {route.legs[0].distance.text} · {route.legs[0].duration.text}
                </p>
                <a
                  href={buildGoogleMapsLink(origin, destination)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    margin: "0px",
                    padding: "4px",
                    fontWeight: "normal",
                    fontSize: "12px",
                  }}
                >
                  View in Google Maps
                </a>
              </h3>

              <div className="show-buttons">
                <Switch
                  checkedChildren="Hide Line"
                  unCheckedChildren="Show Line"
                  onChange={() => toggleLine(i)}
                />
                <Switch
                  checkedChildren="Hide Curves"
                  unCheckedChildren="Show Curves"
                  onChange={() => toggleCurve(i)}
                  style={{ marginLeft: "2x" }}
                />
                <div>
                  <h4>
                    Average Speed: {curvatures[i].estSpeed.toFixed(1)} mph
                  </h4>
                  <p>Top Speed Limit: {curvatures[i].topSpeed} mph</p>
                </div>
                {curvatures[i] && (
                  <>
                    <h4>Traffic: {curvatures[i].trafficLevel}</h4>
                  </>
                )}
                <div
                  style={{
                    backgroundColor: "rgb(199, 161, 124)",
                    padding: "0.0005rem",
                    textAlign: "center",
                  }}
                >
                  {curvatures[i] && (
                    <>
                      <h4> Safety Score: {curvatures[i].safetyScore}/100</h4>
                    </>
                  )}
                </div>
              </div>
            </div>
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
    </div>
  );
}

export default RouteDisplay;
