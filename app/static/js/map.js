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
                        <p>🤖 Generating AI risk analysis...</p>
                    `;

                    fetch("/api/generate-risk-summary", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            wardName: feature.properties.KGISWardName,
                            aqi: dummyWard.aqi,
                            schools: dummyWard.schools,
                            hospitals: dummyWard.hospitals,
                            elderly: dummyWard.elderly
                        })
                    }).then(response => response.json())
                      .then(riskSummary => {

                     sidebar.innerHTML = `
                    <h2>${feature.properties.KGISWardName}</h2>
           
                    <div class="risk high">
                        🔴 HIGH RISK
                    </div>

                    <div class="card">
                        <div><b>AQI</b> : ${dummyWard.aqi}</div>
                        <div><b>Schools</b> : ${dummyWard.schools}</div>
                        <div><b>Hospitals</b> : ${dummyWard.hospitals}</div>
                        <div><b>Elderly Centers</b> : ${dummyWard.elderly}</div>
                    </div>

                    <h3>⚠️ AI Risk Summary</h3>

                    <p>
                       RiskLevel: ${riskSummary.riskLevel}
                       RecommendedActions: ${riskSummary.recommendedActions[0]}
                       RecommendedActions: ${riskSummary.recommendedActions[1]}
                       TargetAudience: ${riskSummary.targetAudience[20]}
                    </p>

                    <h3>🛠 One-Click Interventions</h3>

                    <button>🚧 Halt Construction</button>

                    <button>🚦 Redirect Traffic</button>

                    <button>📢 Dispatch Advisory</button>
                `;

                                })
                                .catch(error => {
                                    console.error(error);
                                });

                        });

            }

        }).addTo(map);

    })
    .catch(error => console.error(error));

