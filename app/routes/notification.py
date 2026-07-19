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

    for device in devices:

        if device["token"] == request.token:

            device["ward"] = request.ward
            device["role"] = request.role

            print(
                "Updated device:",
                device
            )

            return {
                "status":"updated"
            }


    devices.append({

        "token": request.token,

        "ward": request.ward,

        "role": request.role

    })


    print(
        "New device:",
        devices
    )


    return {
        "status":"registered"
    }