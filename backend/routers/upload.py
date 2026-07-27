from typing import Annotated
from pathlib import Path
from fastapi import APIRouter, UploadFile, Depends
from utils import (
    SaveAndHashFile,
    GetSavePath,
    Check_File_Name_Exists,
    Verify_Token,
)