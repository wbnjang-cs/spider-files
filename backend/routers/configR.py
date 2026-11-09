from pathlib import Path
from fastapi import APIRouter, Depends
from utils import UpdateSavePath, CreateDirectory, GetSavePath, Verify_Token
from pydantic import BaseModel
from typing import Annotated

router = APIRouter()

class SetPathRequest(BaseModel):
    savePathName: str

class CreateSubDirRequest(BaseModel):
    currDir: str
    newDir: str

@router.post("/config/setPath")
def set_save_path(request: SetPathRequest, Authentication: Annotated[str, Depends(Verify_Token)]):
    savePath = Path(request.savePathName)
    UpdateSavePath(savePath)
    return {"Message": "Path successfully updated"}

@router.post("/config/createsubdirectory")
def CreateSubDirectory(request: CreateSubDirRequest, Authentication: Annotated[str, Depends(Verify_Token)]):
    newPath = CreateDirectory(request.currDir, request.newDir)
    return {"Message": f" '{newPath}' successfully created", "Path": newPath}

@router.get("/config/getPath")
def get_save_path(Authentication: Annotated[str, Depends(Verify_Token)]):
    return {"savePath": str(GetSavePath())}