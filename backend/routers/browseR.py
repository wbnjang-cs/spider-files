from pathlib import Path
from fastapi import APIRouter
from fastapi import HTTPException, Depends
from utils import GetAllDrives, Verify_Token
from typing import Annotated

router = APIRouter()

@router.get("/browse")
def browse(Authentication: Annotated[str, Depends(Verify_Token)], path: str = "", includeFiles: bool = False):
    if not path:
        home = Path.home()
        quick_access = [
            {"name": "Desktop", "path": str(home / "Desktop"), "is_dir": True},
            {"name": "Downloads", "path": str(home / "Downloads"), "is_dir": True},
            {"name": "Documents", "path": str(home / "Documents"), "is_dir": True},
        ]
        quick_access = [q for q in quick_access if Path(q["path"]).exists()]

        drives = GetAllDrives()
        drive_entries = [{"name": d, "path": d, "is_dir": True} for d in drives]

        return {
            "current_path": "root",
            "parent_path": None,
            "child_directories": quick_access + drive_entries
        }

    base = Path(path)
    if not base.exists() or not base.is_dir():
        raise HTTPException(400, "Invalid path")

    try:
        children = []
        for child in base.iterdir():
            if child.is_dir() or includeFiles:
                try:
                    modified = child.stat().st_mtime
                except OSError:
                    modified = 0  # in case a file vanishes/permission hiccup mid-scan

                children.append({
                    "name": child.name,
                    "path": str(child),
                    "is_dir": child.is_dir(),
                    "modified": modified,
                })

        children.sort(key=lambda c: c["modified"], reverse=True)

    except PermissionError:
        raise HTTPException(403, "Cannot access this directory")

    is_drive_root = base == Path(base.anchor)
    parent_path = "" if is_drive_root else str(base.parent)

    return {
        "current_path": str(base),
        "parent_path": parent_path,
        "child_directories": children
    }