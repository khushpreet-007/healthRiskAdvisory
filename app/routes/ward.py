from fastapi import APIRouter

router = APIRouter()


ward_data = {

    "Kempegowda Ward": {
        "aqi": 185,
        "schools": 5,
        "hospitals": 2,
        "elderly": 3,
        "outdoorWorkers": 120
    },

    "Basaveshwara Nagar": {
        "aqi": 95,
        "schools": 8,
        "hospitals": 4,
        "elderly": 6,
        "outdoorWorkers": 80
    }

}


@router.get("/api/ward/{ward_name}")
async def get_ward_data(ward_name:str):

    return ward_data.get(
        ward_name,
        {
            "aqi":0,
            "schools":0,
            "hospitals":0,
            "elderly":0,
            "outdoorWorkers":0
        }
    )