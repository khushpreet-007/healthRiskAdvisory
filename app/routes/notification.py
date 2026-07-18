from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter()


class DeviceToken(BaseModel):

    token:str
    ward:str



@router.post("/api/register-device")
async def register_device(
    device:DeviceToken
):

    print(
        device.token,
        device.ward
    )

    return {
        "status":"registered"
    }