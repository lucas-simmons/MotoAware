import React, { useEffect, useRef } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

export default function PlaceAutocompleteInput({ label, onSelect }) {
  const inputRef = useRef(null);
  const placesLib = useMapsLibrary("places");

  useEffect(() => {
    if (!placesLib || !inputRef.current) return;

    const autocomplete = new placesLib.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "us" },
      fields: ["geometry", "formatted_address", "name"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        console.warn("No geometry found for place:", place);
        return;
      }

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const name = place.name || place.formatted_address;

      console.log("Selected:", name, lat, lng);
      onSelect && onSelect({ lat, lng, name });
    });

    return () => autocomplete.unbindAll();
  }, [placesLib, onSelect]);

  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", marginBottom: "0.5rem" }}>
        {label}
      </label>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search..."
        style={{
          color: "#2d2c2c",
          width: "25vw",
          padding: "0.5rem",
          backgroundColor: "#fff8f8",
          marginRight: "5px",
        }}
      />
    </div>
  );
}
