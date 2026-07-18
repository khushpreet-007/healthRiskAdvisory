from google.genai import types
import json

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
        You are an environmental health advisor helping city administrators respond to air pollution emergencies.

        Ward Name: {ward_name}
        AQI: {aqi}
        Schools: {schools}
        Hospitals: {hospitals}
        Elderly Centers: {elderly}

        Based on the above data:

        1. Determine the risk level (LOW, MEDIUM, HIGH).
        2. Write a concise 2-3 sentence summary explaining why this ward is vulnerable.
        3. Recommend exactly three immediate interventions.
        4. Identify the target audiences who should receive the alert.

        Return ONLY valid JSON.

        {{
        "riskLevel": "",
        "summary": "",
        "recommendedActions": [
            "",
            "",
            ""
        ],
        "targetAudience": [
            "",
            ""
        ]
        }}
        """

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )

        response_text = response.text.strip()
        print("Response:", response_text, flush=True)
        if not response_text:
            raise ValueError("Gemini returned an empty response.")
        return json.loads(response_text)


geminiService = GeminiService()