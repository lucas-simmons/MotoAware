const map = L.map("map").setView([35.5951, -82.5515], 13); // Example coords

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// L.Routing.control({
//   waypoints: [
//     L.latLng(35.621426939963385, -82.56062848693597),
//     L.latLng(35.60319260211987, -82.55357871212921),
//   ],
//   serviceUrl: "http://172.17.0.2:9966/",
// }).addTo(map);
L.Routing.control({
  waypoints: [
    L.latLng(35.621426939963385, -82.56062848693597),
    L.latLng(35.60319260211987, -82.55357871212921),
  ],
  router: L.Routing.osrmv1({
    serviceUrl: "http://localhost:9966/route/v1/driving",
  }),
}).addTo(map);
