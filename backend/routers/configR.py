from pathlib import Path
from fastapi import APIRouter
from utils import UpdateSavePath, CreateDirectory
from pydantic import BaseModel

router = APIRouter()

class SetPathRequest(BaseModel):
    savePathName: str

class CreateSubDirRequest(BaseModel):
    currDir: str
    newDir: str

@router.post("/config/setPath")
def set_save_path(request: SetPathRequest):
    savePath = Path(request.savePathName)
    UpdateSavePath(savePath)
    return {"Message": "Path successfully updated"}

@router.post("/config/createsubdirectory")
def CreateSubDirectory(request: CreateSubDirRequest):
    newPath = CreateDirectory(request.currDir, request.newDir)
    return {"Message": f" '{newPath}' successfully created", "Path": newPath}