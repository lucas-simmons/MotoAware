import React from "react";
import "./Description.css";
export default function Description() {
  return (
    <>
      <div className="description">
        <h1 style={{ fontSize: "25px" }}>Curvature Meaning</h1>
        <p>Red = Sharp Curve</p>
        <p>Orange = Mid Curve </p>
        <p>Yellow = Slight Curve </p>
        <p>Green = Gentle Curve </p>
      </div>
    </>
  );
}
