from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class RiskRequest(BaseModel):
    wardName: str
    aqi: int
    schools: int
    hospitals: int
    elderly: int


@router.post("/api/generate-risk-summary")
async def generate_risk_summary(request: RiskRequest):

    return {
        "summary": "Dummy response"
    }