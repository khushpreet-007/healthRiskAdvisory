from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"status": "Cloud Run is working"}