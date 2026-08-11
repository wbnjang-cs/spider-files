import time
from secrets import token_urlsafe
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utils import Start_Pairing, Verify_Code, Add_Token

router = APIRouter()

class PairRequest(BaseModel):
    code: str

@router.post("/pair/start")
def pair_start():
    Start_Pairing()
    return {"status": "pairing window is showing"}

@router.post("/pair")
def pair(request: PairRequest):
    if not Verify_Code(request.code):
        raise HTTPException(status_code=401, detail="Invalid or expired code")
    newToken = token_urlsafe(32)
    Add_Token(newToken, time.time())
    return {"token": newToken}