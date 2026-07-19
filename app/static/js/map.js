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
let selectedWard = null;
const sidebar = document.getElementById("sidebar");
document
.getElementById("ward")
.addEventListener(
"change",
()=>{
    document.getElementById("status").innerHTML =
    "🟡 Ward changed. Register again";
});

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
                            selectedWard = {
                                wardName: feature.properties.KGISWardName,
                                riskLevel: riskSummary.riskLevel,
                                summary: riskSummary.summary,
                                targetAudience: riskSummary.targetAudience,
                                language: "English"
                            };

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
                    <b>Risk:</b> ${riskSummary.riskLevel}<br><br>

                    ${riskSummary.summary}<br><br>

                    <b>Recommended Actions</b><br>
                    • ${riskSummary.recommendedActions[0]}<br>
                    • ${riskSummary.recommendedActions[1]}<br>
                    • ${riskSummary.recommendedActions[2]}<br><br>

                    <b>Target Audience</b><br>
                    ${riskSummary.targetAudience.join(", ")}
                    </p>

                    <h3>🛠 One-Click Interventions</h3>

                    <button>🚧 Halt Construction</button>

                    <button>🚦 Redirect Traffic</button>

                    <button id="dispatch-btn">📢 Dispatch Advisory</button>
                  
                `;
                            document
                                .getElementById("dispatch-btn")
                                .addEventListener("click", dispatchAdvisory);

                        })
                        .catch(error => {
                            console.error(error);
                        });

                });

            }

        }).addTo(map);

    })
    .catch(error => console.error(error));

function dispatchAdvisory() {

    if (!selectedWard) {
        alert("Please select a ward first.");
        return;
    }

    const button = document.getElementById("dispatch-btn");

    button.disabled = true;
    button.innerText = "⏳ Dispatching...";

    fetch("/api/dispatch-advisory", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(selectedWard)
    })
        .then(response => {

            if (!response.ok) {
                throw new Error("Failed to dispatch advisory.");
            }

            return response.json();
        })
        .then(data => {

            console.log(data);

            // For now just show the translated advisory
            const audio = new Audio(data.audioUrl);
          //  audio.play();

            // Later we'll replace this with:
            // const audio = new Audio(data.audioUrl);
            // audio.play();

        })
        .catch(error => {

            console.error(error);

            alert("Unable to dispatch advisory.");

        })
        .finally(() => {

            button.disabled = false;
            button.innerText = "📢 Dispatch Advisory";

        });

}