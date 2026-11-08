import time
from secrets import token_urlsafe
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from utils import Start_Pairing, Verify_Code, Add_Token, GetPairingEnabled, Verify_Token, Set_Name

router = APIRouter()

class PairRequest(BaseModel):
    code: str
class RenameRequest(BaseModel):
    deviceName: str = Field(min_length=1, max_length=40)

@router.post("/pair/start/")
def pair_start():
    if not GetPairingEnabled():
            raise HTTPException(status_code=403, detail="Pairing is currently disabled")
    Start_Pairing()
    return {"status": "pairing window is showing"}

@router.post("/pair")
def pair(request: PairRequest):
    if not GetPairingEnabled():
        raise HTTPException(status_code=403, detail="Pairing is currently disabled")
    if not Verify_Code(request.code):
        raise HTTPException(status_code=401, detail="Invalid or expired code")
    newToken = token_urlsafe(32)
    if Add_Token(newToken, time.time()):
        return {"token": newToken}
    else:
        raise HTTPException(status_code=500, detail="Failed to pair")


@router.post("/setName")
def setName(request: RenameRequest, token: str = Depends(Verify_Token)):
    if not Set_Name(token, request.deviceName):
        raise HTTPException(status_code=500, detail="Failed to set device name")
    return {"deviceName" : request.deviceName, "Message" : "Device name set successfully"}
     