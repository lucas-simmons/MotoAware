import { useEffect } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { computeDetailedCurvature } from "./curvature.js";

export default function CurvatureLine({ coords }) {
  const map = useMap();
  const mapsLib = useMapsLibrary("maps");

  useEffect(() => {
    if (!map || !mapsLib || coords.length < 3) return;

    const { curvatureProfile } = computeDetailedCurvature(coords);

    const segments = [];

    curvatureProfile.forEach((p) => {
      if (
        !(curvatureToColor(p.curvatureRadPerM) === "#00FF00") &&
        !(curvatureToColor(p.curvatureRadPerM) === "#ADFF2F")
      ) {
        const seg = new mapsLib.Polyline({
          map,
          path: [coords[p.index], coords[p.index + 1]],
          strokeColor: curvatureToColor(p.curvatureRadPerM),
          strokeOpacity: 1,
          strokeWeight: 4,
        });
        segments.push(seg);
      } else {
        const seg = new mapsLib.Polyline({
          map,
          path: [coords[p.index], coords[p.index + 1]],
          strokeColor: curvatureToColor(p.curvatureRadPerM),
          strokeOpacity: 1,
          strokeWeight: 2,
        });
        segments.push(seg);
      }
    });

    return () => {
      segments.forEach((s) => s.setMap(null));
    };
  }, [map, mapsLib, coords]);

  return null;
}

function curvatureToColor(k) {
  //  console.log(k);
  if (k < 0.05) return "#00FF00"; // green (almost straight)
  if (k < 0.1) return "#ADFF2F"; // light green (gentle curve)
  if (k < 0.15) return "#FFFF00"; // yellow (noticeable)
  if (k < 0.3) return "#FFA500"; // orange (sharp)
  if (k < 0.4) return "#FF4500"; // deep orange (sharper)
  return "#FF0000"; // red (sharpest)
}
