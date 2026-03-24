import React from "react";
import { Tooltip } from "antd";

export default function Explanation() {
  return (
    <>
      <div
        style={{
          justifyItems: "center",
          paddingBottom: "5px",
          borderTop: "5px solid #f8cfa8",
          backgroundColor: "#c25929",
          background:
            "linear-gradient(50deg,rgba(194, 89, 41, 1) 15%, rgba(255, 157, 0, 1) 86%)",
          boxShadow:
            "0 16px 32px 0 rgba(0, 0, 0, 0.2), 0 24px 80px 0 rgba(0, 0, 0, 0.19)",
        }}
      >
        <h1 style={{ paddingBottom: "0px" }}>
          <Tooltip title="50% of Score">
            <span>Average Curvature</span>
          </Tooltip>{" "}
          +{" "}
          <Tooltip title="20% of Score">
            <span>Average Speed</span>
          </Tooltip>{" "}
          +{" "}
          <Tooltip title="30% of Score">
            <span>Traffic Level</span>
          </Tooltip>{" "}
        </h1>
        <h1>
          <span>= Safety Score</span>

          <Tooltip title="(Traffic Level * 0.3) + (Average Speed * 0.2) + (Average Curvature * 0.5)">
            <span style={{ fontSize: "15px" }}>ⓘ</span>
          </Tooltip>
        </h1>
      </div>
    </>
  );
}
//    const overallScore =
// 0.3 * traffic + 0.2 * speed + 0.5 * curvatureScore;
//    const safetyScore = Math.round((1 - overallScore) * 100);
