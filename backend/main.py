#uvicorn main:app --reload
import time
from pydantic import BaseModel
from fastapi import FastAPI, UploadFile, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from typing import Annotated
from secrets import token_urlsafe
from utils import (
    SaveAndHashFile,
    UpdateSavePath,
    GetSavePath,
    Check_File_Name_Exists,
    CreateDirectory,
    GetIP,
    Verify_Token,
    Start_Pairing,
    Verify_Code,
    Add_Token
)

class PairRequest(BaseModel):
    code: str


#======== Code that runs on startup ==================================================================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # local-only tool; revisit if cookie-based auth is ever added
    allow_methods=["*"],
    allow_headers=["*"],
)
#====================================================================================================================================

@app.post("/uploadfile/")
def create_upload_file(userFiles: list[UploadFile], Authentication: Annotated[str, Depends(Verify_Token)], savePath: str=None):
    uploadedFiles = []
    failedFiles = []
    mainSavePath = GetSavePath()
    
    if savePath is None:
        savePath = mainSavePath
    else:
        savePath = mainSavePath / Path(savePath)

    for file in userFiles:
        fileName = file.filename
    
        #Quick Check if file with same name exists. If it does, don't save file and return
        if Check_File_Name_Exists(fileName):
            fileName = fileName + "(File with identical name already exists)"
            failedFiles.append(fileName)
            continue

        #Check if file successfully saves
        if SaveAndHashFile(file, savePath):
            uploadedFiles.append(fileName)
        else:
            fileName = fileName + "(File with identical content already saved)"
            failedFiles.append(fileName)

    return {"Message" : "Upload Completed",
            "File Counts" : {
                "Total" : len(userFiles),
                "Success" : len(uploadedFiles),
                "Failed" : len(failedFiles)
            },
            "Successfull_Uploads" : uploadedFiles,
            "Failed_Uploads" : failedFiles}


@app.post("/config/setPath")
def set_save_path (savePathName: str): 
    savePath = Path(savePathName)
    UpdateSavePath(savePath)

    return {"Message" : "Path successfully updated"}

@app.post("/config/createsubdirectory")
def CreateSubDirectory(directoryName: str):
    CreateDirectory(directoryName)

    return {"Message" : "subdirectory successfully created"}

@app.post("/pair/start")
def pair_start():
    Start_Pairing()
    return {"status": "pairing window is showing"}

@app.post("/pair")
def pair(request: PairRequest):
    if not Verify_Code(request.code):
        raise HTTPException(status_code=401, detail="Invalid or expired code")
    newToken = token_urlsafe(32)
    Add_Token(newToken, time.time())
    return {"token": newToken}



#app.
# @app.get("/setup")
# def setup():

