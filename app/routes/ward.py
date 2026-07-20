import requests
import os
from shapely.geometry import shape
import json
import random
from pathlib import Path

router = APIRouter()   

OPENWEATHER_KEY = os.getenv("OPENWEATHER_API_KEY")

AQI_MAPPING = {
    1: 35,
    2: 75,
    3: 120,
    4: 185,
    5: 300
}
WARD_DATA = {}


BASE_DIR = Path(__file__).resolve().parent.parent
GEOJSON_FILE = BASE_DIR / "static" / "geojson" / "bengaluru_wards.geojson"

with open(GEOJSON_FILE) as f:
    geojson = json.load(f)

    for feature in geojson["features"]:
        ward_name = feature["properties"]["KGISWardName"]

        polygon = shape(feature["geometry"])
        centroid = polygon.centroid

        WARD_DATA[ward_name] = {
            "lat": centroid.y,
            "lon": centroid.x,
            "schools": random.randint(2, 10),
            "hospitals": random.randint(1, 5),
            "elderly": random.randint(1, 8),
            "outdoorWorkers": random.randint(50, 250)
        }

print(f"Loaded {len(WARD_DATA)} wards", flush=True)

@router.get("/api/ward/{ward_name}")
async def get_ward_data(ward_name: str):

    ward = WARD_DATA.get(ward_name)

    if ward is None:
        return {
            "aqi": 0,
            "schools": 0,
            "hospitals": 0,
            "elderly": 0,
            "outdoorWorkers": 0
        }

    aqi = get_aqi(
        ward["lat"],
        ward["lon"]
    )

    return {
        "aqi": aqi,
        "schools": ward["schools"],
        "hospitals": ward["hospitals"],
        "elderly": ward["elderly"],
        "outdoorWorkers": ward["outdoorWorkers"]
    }