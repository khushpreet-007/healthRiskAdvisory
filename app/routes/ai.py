from fastapi import APIRouter
from pydantic import BaseModel

from app.services.gemini_service import geminiService

router = APIRouter()

class DispatchRequest(BaseModel):
    wardName: str
    riskLevel: str
    summary: str
    targetAudience: list[str]
    language:str

@router.post("/api/dispatch-advisory")
async def dispatch_advisory(request: DispatchRequest):

    return geminiService.create_public_advisory(
        request.wardName,
        request.riskLevel,
        request.summary,
        request.targetAudience,
        request.language,
    )


class RiskRequest(BaseModel):
    wardName: str
    aqi: int
    schools: int
    hospitals: int
    elderly: int


@router.post("/api/generate-risk-summary")
async def generate_risk_summary(request: RiskRequest):

    return geminiService.generate_risk_summary(
        request.wardName,
        request.aqi,
        request.schools,
        request.hospitals,
        request.elderly
    )