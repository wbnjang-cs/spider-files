from fastapi import APIRouter, Depends, HTTPException
from utils import Verify_Token, Get_Devices, Delete_Devices
from pydantic import BaseModel
from typing import Annotated



router = APIRouter()

class DeleteDevicesRequest(BaseModel):
    ids: list[int]

@router.get("/devices/get")
def get_device_list(currentToken: str = Depends(Verify_Token)):
    return Get_Devices(currentToken)


@router.post("/devices/delete")
def delete_devices(body: DeleteDevicesRequest, Authentication: Annotated[str, Depends(Verify_Token)]):
    if not body.ids:
        raise HTTPException(status_code=400, detail="No ids given")
    deletedAmount = Delete_Devices(body.ids)
    if deletedAmount == 0:
        raise HTTPException(status_code=404, detail="No matching devices found")
    return {"deleted" : deletedAmount}