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



def pm25_to_aqi(pm25):

    breakpoints = [
        (0.0, 12.0, 0, 50),
        (12.1, 35.4, 51, 100),
        (35.5, 55.4, 101, 150),
        (55.5, 150.4, 151, 200),
        (150.5, 250.4, 201, 300),
        (250.5, 350.4, 301, 400),
        (350.5, 500.4, 401, 500)
    ]

    for c_low, c_high, i_low, i_high in breakpoints:

        if c_low <= pm25 <= c_high:

            return round(
                ((i_high - i_low) / (c_high - c_low))
                * (pm25 - c_low)
                + i_low
            )

    return 500

def get_aqi(lat, lon):

    url = (
        f"https://api.openweathermap.org/data/2.5/air_pollution"
        f"?lat={lat}&lon={lon}&appid={OPENWEATHER_KEY}"
    )

    response = requests.get(url)

    data = response.json()

    pm25 = data["list"][0]["components"]["pm2_5"]

    return pm25_to_aqi(pm25)

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