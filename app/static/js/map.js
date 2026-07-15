const map = L.map("map").setView(
    [12.9716, 77.5946],
    12
);

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "&copy; OpenStreetMap contributors"
    }
).addTo(map);

function getColor(risk) {

    switch (risk) {
        case "HIGH":
            return "#ff3b30";

        case "MEDIUM":
            return "#ff9500";

        default:
            return "#34c759";
    }
}

fetch("/static/geojson/bengaluru_wards.geojson")
    .then(response => response.json())
    .then(data => {

        L.geoJSON(data, {

            style: function(feature) {

                return {
                    color: "#333",
                    weight: 1,
                    fillColor: getColor("HIGH"),   // Temporary
                    fillOpacity: 0.6
                };

            },

            onEachFeature: function(feature, layer) {

                layer.on("click", function() {

                    console.log(feature.properties);
                    alert("Ward clicked!");

                });

            }

        }).addTo(map);

    })
    .catch(error => console.error(error));