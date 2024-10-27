// Set up the map
const map = L.map("map").setView([37.7749, -122.4194], 5); 

// Add a base map layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "© OpenStreetMap contributors"
}).addTo(map);

// Define the URL for the earthquake data
const earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Fetch earthquake data and add to map
fetch(earthquakeUrl)
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        // Define marker size and color based on earthquake properties
        const magnitude = feature.properties.mag;
        const depth = feature.geometry.coordinates[2]; 
        const color = depth > 90 ? "#800080" : depth > 70 ? "#FF4500" : depth > 50 ? "#FFD700" : "#00CED1";

        return L.circleMarker(latlng, {
          radius: magnitude * 3, //
          fillColor: color,
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        }).bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${magnitude}<br>Depth: ${depth} km</p>`);
      }
    }).addTo(map);
  })
  .catch(error => console.error("Error fetching data:", error));

// Add legend to map
// Add legend to map
const legend = L.control({ position: "topright" });
legend.onAdd = function () {
    const div = L.DomUtil.create("div", "info legend");
    const depths = [0, 50, 70, 90];
    const labels = [
        "Shallow (0-50 km)", 
        "Moderate (50-70 km)", 
        "Deep (70-90 km)", 
        "Very Deep (>90 km)"
    ];
    const colors = ["#00CED1", "#FFD700", "#FF4500", "#800080"]; // Colors corresponding to depth ranges

    // Loop through depth intervals to generate a label with a colored square for each depth range
    for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
            `<i style="background:${colors[i]}"></i> ${labels[i]}<br>`;
    }
    return div;
};

legend.addTo(map);


