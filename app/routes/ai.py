from fastapi import APIRouter
from pydantic import BaseModel

from app.services.gemini_service import geminiService
from app.services.tts_service import ttsService


router = APIRouter()

class DispatchRequest(BaseModel):
    wardName: str
    riskLevel: str
    summary: str
    targetAudience: list[str]
    language:str

@router.post("/api/dispatch-advisory")
async def dispatch_advisory(request: DispatchRequest):

    advisory =  geminiService.create_public_advisory(
        request.wardName,
        request.riskLevel,
        request.summary,
        request.targetAudience,
        request.language,
    )
    
    audio_url = ttsService.generate_audio(
        advisory["advisory"],
        advisory["language"]
    )

    ttsService.send_fcm_notification(
        request.wardName,
        advisory["advisory"],
        audio_url
    )

    return {
        "language": advisory["language"],
        "advisory": advisory["advisory"],
        "audioUrl": audio_url
    }


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