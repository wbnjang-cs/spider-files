#uvicorn main:app --host 0.0.0.0 --port 8000
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import configR, pairingR, browseR, filesR

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