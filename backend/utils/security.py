from typing import Annotated
from fastapi import Depends, HTTPException
from fastapi.security import APIKeyHeader
from .db_utils import Is_Valid_Token
import threading, secrets, time, tkinter as tk

API_KEY_SCHEME = APIKeyHeader(name="TOKEN_FOR_VERIFICATION")

async def Verify_Token(inputedToken : Annotated[str, Depends(API_KEY_SCHEME)]):
    if not Is_Valid_Token(inputedToken):
        raise HTTPException(status_code=401, detail="Invalid or unpaired device.")
    return inputedToken

def Show_Popup(code: str):
    root = tk.Tk()
    root.title("Pairing Code")
    root.attributes("-topmost", True)

    tk.Label(root, text=code, font=("Segoe UI", 40, "bold")).pack(padx=40, pady=40)

    root.after(CODE_VALID_FOR_SECONDS * 1000, root.destroy)
    root.mainloop()

VALID_CODE = {"code": None, "expires_at": 0.0}
CODE_VALID_FOR_SECONDS = 180

def Start_Pairing():
    code = f"{secrets.randbelow(1_000_000):06d}"

    VALID_CODE["code"] = code
    VALID_CODE["expires_at"] = time.time() + CODE_VALID_FOR_SECONDS
    threading.Thread(target=Show_Popup, args=(code,), daemon=True).start()

def Verify_Code(submitted: str) -> bool:
    code = VALID_CODE["code"]
    valid = code is not None and time.time() < VALID_CODE["expires_at"] and secrets.compare_digest(code, submitted)
    if valid:
        VALID_CODE["code"] = None
        

    return valid

