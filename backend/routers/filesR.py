import zipfile
import tempfile
from typing import Annotated
from pathlib import Path
from fastapi import APIRouter, UploadFile, Depends, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel
from utils import (
    SaveAndHashFile,
    GetSavePath,
    Check_File_Name_Exists,
    Verify_Token,
)


router = APIRouter()

class DownloadRequest(BaseModel):
    files: list


@router.post("/uploadfile/")
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

@router.post("/download/")
def download_path(request: DownloadRequest, background_tasks: BackgroundTasks, Authentication: Annotated[str, Depends(Verify_Token)]):
    paths = [Path(p) for p in request.files]

    tempFile = tempfile.NamedTemporaryFile(suffix=".zip", delete=False)
    tempFile.close()
    zip_path = Path(tempFile.name)

    try:
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zip_file:
            for targetPath in paths:
                if not targetPath.exists():
                    raise HTTPException(status_code=404, detail=f"Path not found: {targetPath}")

                if targetPath.is_dir():
                    for file_path in targetPath.rglob("*"):
                        if file_path.is_file():
                            arcname = targetPath.name / file_path.relative_to(targetPath)
                            zip_file.write(file_path, arcname=arcname)
                else:
                    zip_file.write(targetPath, arcname=targetPath.name)
    except:
        zip_path.unlink()  # clean up the half-built zip before re-raising
        raise

    background_tasks.add_task(zip_path.unlink)
    
    return FileResponse(zip_path, filename="download.zip", media_type="application/zip")