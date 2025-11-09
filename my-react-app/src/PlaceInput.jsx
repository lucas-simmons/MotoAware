import React, { useEffect, useRef } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

export default function PlaceAutocompleteInput({ label, onSelect }) {
  const inputRef = useRef(null);
  const placesLib = useMapsLibrary("places"); // ensures 'places' is loaded

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
          width: "100%",
          padding: "0.5rem",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />
    </div>
  );
}
