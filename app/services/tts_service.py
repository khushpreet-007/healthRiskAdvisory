from google.cloud import texttospeech
import uuid
import os
from app.utils import firebase_client
from firebase_admin import messaging

from app.routes.notification import devices



class TTSService:

    def send_fcm_notification(
        self,
        ward,
        message,
        audio_url
    ):

        print("Dispatch ward:", ward, flush=True)
        print("Registered devices:", devices, flush=True)

        for device in devices:

            print(
                f'Comparing "{device["ward"]}" with "{ward}"',
                flush=True
            )

            if device["ward"] == ward:

                print("Matched device!", flush=True)

                notification = messaging.Message(
                    notification=messaging.Notification(
                        title="🚨 AQI Alert",
                        body=message
                    ),
                    data={
                        "audioUrl": audio_url,
                        "ward": ward
                    },
                    token=device["token"]
                )

                result = messaging.send(notification)
                print(result, flush=True)

    def generate_audio(self, text, language):
        client = texttospeech.TextToSpeechClient()
        language_map = {
            "English": ("en-IN", "en-IN-Standard-B"),
            "Kannada": ("kn-IN", "kn-IN-Standard-A"),
            "Tamil": ("ta-IN", "ta-IN-Standard-A")
        }

        language_code, voice_name = language_map.get(
            language,
            ("en-IN", "en-IN-Standard-B")
        )

        synthesis_input = texttospeech.SynthesisInput(text=text)

        voice = texttospeech.VoiceSelectionParams(
            language_code=language_code,
            name=voice_name
        )

        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3
        )

        response = client.synthesize_speech(
            input=synthesis_input,
            voice=voice,
            audio_config=audio_config
        )

        os.makedirs("app/static/audio", exist_ok=True)

        filename = f"{uuid.uuid4()}.mp3"

        filepath = f"app/static/audio/{filename}"

        with open(filepath, "wb") as out:
            out.write(response.audio_content)

        return f"/static/audio/{filename}"


ttsService = TTSService()