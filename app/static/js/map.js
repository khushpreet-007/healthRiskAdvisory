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

const dummyWard = {
    risk: "HIGH",
    aqi: 185,
    schools: 5,
    hospitals: 2,
    elderly: 3
};

const sidebar = document.getElementById("sidebar");
fetch("/static/geojson/bengaluru_wards.geojson")
    .then(response => response.json())
    .then(data => {

        L.geoJSON(data, {

            style: function (feature) {

                return {
                    color: "#333",
                    weight: 1,
                    fillColor: getColor(dummyWard.risk),
                    fillOpacity: 0.6
                };


            },

            onEachFeature: function (feature, layer) {
                layer.on("click", function () {
                    sidebar.innerHTML = `
                        <h2>${feature.properties.KGISWardName}</h2>
                        <p><b>Ward No:</b> ${feature.properties.KGISWardNo}</p>
                        <p><b>AQI:</b> ${dummyWard.aqi}</p>
                        <p><b>Risk:</b> ${dummyWard.risk}</p>
                        <p><b>Schools:</b> ${dummyWard.schools}</p>
                        <p><b>Hospitals:</b> ${dummyWard.hospitals}</p>
                        <p><b>Elderly Centers:</b> ${dummyWard.elderly}</p>
                    `;

                });

            }

        }).addTo(map);

    })
    .catch(error => console.error(error));

