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


let selectedWard = null;
const sidebar = document.getElementById("sidebar");
const language = document.getElementById("language").value;

fetch("/static/geojson/bengaluru_wards.geojson")
    .then(response => response.json())
    .then(data => {

        L.geoJSON(data, {

            style: function (feature) {

                return {
                    color: "#333",
                    weight: 1,
                    fillColor: getColor("MEDIUM"),
                    fillOpacity: 0.6
                };

            },

            onEachFeature: function (feature, layer) {

                layer.on("click", function () {

                    const wardName = feature.properties.KGISWardName;


                    sidebar.innerHTML = `
                        <h2>${wardName}</h2>
                        <p>🤖 Fetching ward data...</p>
                    `;


                    // Step 1: Fetch real ward data
                    fetch(`/api/ward/${encodeURIComponent(wardName)}`)
                        .then(response => response.json())
                        .then(wardData => {

                            // Step 2: Generate AI risk
                            return fetch("/api/generate-risk-summary", {

                                method: "POST",

                                headers: {
                                    "Content-Type": "application/json"
                                },

                                body: JSON.stringify({
                                    wardName: wardName,
                                    aqi: wardData.aqi,
                                    schools: wardData.schools,
                                    hospitals: wardData.hospitals,
                                    elderly: wardData.elderly

                                })

                            })
                                .then(response => response.json())
                                .then(riskSummary => {


                                    selectedWard = {

                                        wardName: wardName,

                                        riskLevel: riskSummary.riskLevel,

                                        summary: riskSummary.summary,

                                        targetAudience: riskSummary.targetAudience,

                                        language: language

                                    };


                                    sidebar.innerHTML = `

                                <h2>${wardName}</h2>


                                <div class="risk ${riskSummary.riskLevel.toLowerCase()}">

                                    ${riskSummary.riskLevel === "HIGH"
                                            ? "🔴 HIGH RISK"
                                            : riskSummary.riskLevel === "MEDIUM"
                                                ? "🟠 MEDIUM RISK"
                                                : "🟢 LOW RISK"
                                        }

                                </div>


                                <div class="card">

                                    <div>
                                    <b>AQI</b> : ${wardData.aqi}
                                    </div>

                                    <div>
                                    <b>Schools</b> : ${wardData.schools}
                                    </div>


                                    <div>
                                    <b>Hospitals</b> : ${wardData.hospitals}
                                    </div>


                                    <div>
                                    <b>Elderly Centers</b> : ${wardData.elderly}
                                    </div>

                                </div>



                                <h3>⚠️ AI Risk Summary</h3>


                                <p>

                                <b>Risk:</b> 
                                ${riskSummary.riskLevel}

                                <br><br>


                                ${riskSummary.summary}


                                <br><br>


                                <b>Recommended Actions</b>

                                <br>

                                • ${riskSummary.recommendedActions[0]}

                                <br>

                                • ${riskSummary.recommendedActions[1]}

                                <br>

                                • ${riskSummary.recommendedActions[2]}


                                <br><br>


                                <b>Target Audience</b>

                                <br>

                                ${riskSummary.targetAudience.join(", ")}


                                </p>


                                <h3>🛠 One-Click Interventions</h3>


                                <button>
                                    🚧 Halt Construction
                                </button>


                                <button>
                                    🚦 Redirect Traffic
                                </button>

                                <select id="language">
                                    <option value="English" selected>English</option>
                                    <option value="Hindi">Hindi</option>
                                    <option value="Kannada">Kannada</option>
                                </select>
                                <button id="dispatch-btn">
                                    📢 Dispatch Advisory
                                </button>

                                `;


                                    document
                                        .getElementById("dispatch-btn")
                                        .addEventListener(
                                            "click",
                                            dispatchAdvisory
                                        );


                                });


                        })

                        .catch(error => {

                            console.error(error);

                            sidebar.innerHTML = `
                                <h2>${wardName}</h2>
                                <p>❌ Failed to load ward data</p>
                            `;

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
            alert('Dispatch send Successfully 🟢');
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