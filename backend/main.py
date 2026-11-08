#uvicorn main:app --host 0.0.0.0 --port 8000
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import configR, pairingR, browseR, filesR, devicesR
from fastapi.staticfiles import StaticFiles
from paths import resource_path

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(filesR.router)
app.include_router(configR.router)
app.include_router(pairingR.router)
app.include_router(browseR.router)
app.include_router(devicesR.router)

app.mount("/", StaticFiles(directory=resource_path("frontendDist"), html=True), name="static")

