import requests
import os
from shapely.geometry import shape
import json
import random
from pathlib import Path
from fastapi import APIRouter
import requests


router = APIRouter()   

OPENWEATHER_KEY = os.getenv("OPENWEATHER_API_KEY")
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


def get_aqi(lat, lon):

    url = (
        f"https://api.waqi.info/feed/geo:{lat};{lon}/"
        f"?token={OPENWEATHER_KEY}"
    )

    response = requests.get(url)

    if response.status_code != 200:
        return 0

    data = response.json()

    if data["status"] != "ok":
        print(data)
        return 0

    return data["data"]["aqi"]

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