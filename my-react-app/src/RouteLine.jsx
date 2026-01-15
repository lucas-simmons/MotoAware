import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect } from "react";

export default function RouteLine({ coords, color = "#000000" }) {
  const map = useMap();
  const mapsLib = useMapsLibrary("maps");

  useEffect(() => {
    if (!map || !mapsLib || !coords?.length) return;

    const line = new mapsLib.Polyline({
      map,
      path: coords,
      strokeColor: color,
      strokeOpacity: 0.4,
      strokeWeight: 3,
      zIndex: 2,
    });

    return () => line.setMap(null);
  }, [map, mapsLib, coords, color]);

  return null;
}
