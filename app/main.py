from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.routes.notification import router as notification_router


from .routes.ai import router

app = FastAPI()

app.mount("/static", StaticFiles(directory="app/static"), name="static")

app.include_router(router)
app.include_router(notification_router)


@app.get("/")
async def home():
    return FileResponse("app/templates/index.html")

@app.get("/citizen")
async def citizen():
    return FileResponse("app/templates/citizen.html")

@app.get("/firebase-messaging-sw.js")
async def firebase_sw():
    return FileResponse("app/firebase-messaging-sw.js")