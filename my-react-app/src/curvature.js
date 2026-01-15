import CurvatureLine from "./CurvatureLine";

const EARTH_R = 6371000; // meters

// Convert lat/lng (degrees) to local planar meters (equirectangular around a center latitude)
export function latLngsToXY(coords) {
  if (!coords.length) return [];
  const lat0 = (coords[0].lat * Math.PI) / 180;
  const cosLat0 = Math.cos(lat0);
  return coords.map((p) => {
    const x = ((p.lng * Math.PI) / 180) * EARTH_R * cosLat0; // meters east
    const y = ((p.lat * Math.PI) / 180) * EARTH_R; // meters north
    return { x, y };
  });
}

// Euclidean distance between two planar points (meters)
function dist(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}
export function curvatureToColor(seg) {
  if (seg < 0.0005) return "#00FF00"; // green
  if (seg < 0.002) return "#FFFF00"; //yellow
  return "#FF0000"; //red
}

// Angle (radians) between vect a->b and b->c, with straight=0
function angleAt(a, b, c) {
  // vectors b->a and b->c, but both pointing away to produce 0 for straight
  const v1x = a.x - b.x;
  const v1y = a.y - b.y;
  const v2x = c.x - b.x;
  const v2y = c.y - b.y;
  const dot = v1x * v2x + v1y * v2y;
  const mag1 = Math.hypot(v1x, v1y);
  const mag2 = Math.hypot(v2x, v2y);
  if (mag1 === 0 || mag2 === 0) return 0;
  const cosTheta = Math.min(1, Math.max(-1, dot / (mag1 * mag2)));
  return Math.acos(cosTheta);
}
/**
 * Returns:
 *   avgAngleRad,         // average turning angle (radians) per vertex
 *   avgAngleDeg,         // same in degrees
 *   avgCurvatureRadPerM, // mean(curvature = angle / segment_length)   (rad / meter)
 *   integratedCurvature, // sum(angle) in radians (total turning)
 *   totalLengthMeters,   // route length (meters)
 *   curvatureProfile     // array of {index, angleRad, segLen, curvatureRadPerM}
 */
export function computeDetailedCurvature(coords) {
  if (!coords || coords.length < 3) {
    return {
      avgAngleRad: 0,
      avgAngleDeg: 0,
      avgCurvatureRadPerM: 0,
      integratedCurvature: 0,
      totalLengthMeters: 0,
      curvatureProfile: [],
    };
  }

  const pts = latLngsToXY(coords);
  const n = pts.length;
  let totalAngle = 0;
  let totalLen = 0;
  const profile = [];

  // compute segment lengths
  const segLen = [];
  for (let i = 0; i < n - 1; i++) segLen[i] = dist(pts[i], pts[i + 1]);

  // curvature at interior points
  for (let i = 1; i < n - 1; i++) {
    const a = pts[i - 1],
      b = pts[i],
      c = pts[i + 1];
    const angle = angleAt(a, b, c); // radians, 0 = straight
    // segment length to normalize
    // average length of adjacent segments (or use segLen[i-1] or i)
    const lenLeft = segLen[i - 1] || 0;
    const lenRight = segLen[i] || 0;
    const localLen = (lenLeft + lenRight) / 2 || 1; // avoid div0
    const curvature = angle / localLen; // rad per meter (local)
    profile.push({
      index: i,
      angleRad: angle,
      angleDeg: (angle * 180) / Math.PI,
      segLenLeft: lenLeft,
      segLenRight: lenRight,
      localLen,
      curvatureRadPerM: curvature,
    });
    totalAngle += angle;
  }

  // total route length
  for (let i = 0; i < n - 1; i++) totalLen += segLen[i] || 0;

  // compute averages
  const avgAngleRad = totalAngle / Math.max(1, profile.length);
  const avgAngleDeg = (avgAngleRad * 180) / Math.PI;
  // average curvature (rad per meter) mean over the profile
  const avgCurvatureRadPerM =
    profile.reduce((s, p) => s + p.curvatureRadPerM, 0) /
    Math.max(1, profile.length);

  return {
    avgAngleRad,
    avgAngleDeg,
    avgCurvatureRadPerM,
    integratedCurvature: totalAngle, // total radians turned along route
    totalLengthMeters: totalLen,
    curvatureProfile: profile,
    routeCoords: coords,
  };
}
