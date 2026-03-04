import React from "react";

export default function Explanation() {
  return (
    <>
      <div style={{ justifyItems: "center", paddingBottom: "5px" }}>
        <h1 style={{ paddingBottom: "0px" }}>
          Average Curvature + Average Speed + Traffic Level
        </h1>
        <h1>= Safety Score</h1>
      </div>
    </>
  );
}
//    const overallScore =
// 0.3 * traffic + 0.2 * speed + 0.5 * curvatureScore;
//    const safetyScore = Math.round((1 - overallScore) * 100);
