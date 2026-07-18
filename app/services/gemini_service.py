from google.genai import types
from app.utils.vertex_client import client


class GeminiService:

    def generate_risk_summary(
        self,
        ward_name,
        aqi,
        schools,
        hospitals,
        elderly
    ):

        prompt = f"""
            You are an environmental health advisor.
            Ward Name: {ward_name}
            AQI: {aqi}
            Schools: {schools}
            Hospitals: {hospitals}
            Elderly Centers: {elderly}
            Write exactly 2-3 sentences.
            Explain:
            - why this ward is vulnerable
            - one immediate intervention

            Return only the advisory.
            """

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        return response.text.strip()


geminiService = GeminiService()