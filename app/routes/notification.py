from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter()

class DeviceRequest(BaseModel):
    token: str
    ward: str
    role: str


devices = []

@router.post("/api/register-device")
async def register_device(request: DeviceRequest):

    devices.append({
        "token": request.token,
        "ward": request.ward,
        "role": request.role
    })

    print(devices)

    return {
        "status": "registered"
    }