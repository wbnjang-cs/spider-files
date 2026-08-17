import sqlite3
from pathlib import Path
import os

MAIN_DIR = Path(os.environ["APPDATA"]) / "myDrive"
MAIN_DIR.mkdir(exist_ok=True)

DB_DIR = MAIN_DIR / "db"
DB_DIR.mkdir(exist_ok=True)

FILES_DB_PATH = DB_DIR / "files.db"
TOKENS_DB_PATH = DB_DIR / "tokens.db"


def Initialize_Files_Database():
    """
    Name: Initialize_Files_Database

    Function description: 
        If database already exists at myDrive/db/"dbname.db", 
        return that directory. Else create db at that location and then return

    Inputs: None

    Return value: None
    """
    #connect to the db file. If db file doesn't exist, make a new db file with a new table
    conn = sqlite3.connect(FILES_DB_PATH)

    c = conn.cursor()

    c.execute("""CREATE TABLE IF NOT EXISTS files (
            id INTEGER PRIMARY KEY,
            fileName TEXT NOT NULL UNIQUE,
            fileHash TEXT NOT NULL UNIQUE
            )""")

    conn.commit()
    conn.close()
#End of Initialize_Database ========================================================================================================================================

Initialize_Files_Database()

#End of Initialize_Files_Database ========================================================================================================================================


def Initialize_Tokens_Database():
    """
    Name: Initialize_Tokens_Database

    Function description: 
        If database already exists at myDrive/db/tokens.db, 
        does nothing. Else creates it with the devices table.

    Inputs: None

    Return value: None
    """
    conn = sqlite3.connect(TOKENS_DB_PATH)
    c = conn.cursor()

    c.execute("""CREATE TABLE IF NOT EXISTS tokens (
            token TEXT PRIMARY KEY,
            pairedTime REAL NOT NULL
            )""")

    conn.commit()
    conn.close()
#End of Initialize_Devices_Database ========================================================================================================================================

Initialize_Tokens_Database()


def Add_File(fileName: str, fileHash: str) -> bool:
    """
    Name: Add_File

    Function description: 
        Will add a file to the database, storing its name and hashed contents.
        Because the fileHash column is unique, if there is a duplicate
        trying to be uploaded the program will return an error.

    Inputs: 
            dbPath: a path object that points to the db file

            fileName: a str that is the name of the file

            fileHash: a str that is the sha256 hash of the file's contents

    Return value: 
            True : The file was succesfully added to db because it's contents were unique

            False : The file could not be added to the db, either because it was a duplicate
                    or because there was an error
    """
    conn = sqlite3.connect(FILES_DB_PATH)
    c = conn.cursor()
    try:
        c.execute("""INSERT INTO files (fileName, fileHash) 
                    VALUES (?, ?) """,
                    (fileName, fileHash))
    
        conn.commit()
        return True
    
    except sqlite3.IntegrityError:
        print("That file already exists in the destination folder")
        return False
    except Exception as e:
        print(f"Error in uploading file: {e}")
        return False
    finally:
        conn.close()
#End of Add_File =======================================================================================================================



def Check_File_Name_Exists(fileName: str) -> bool:
    """
    Name: Check_File_Name_Exists

    Function description: 
        Will check the db to see if the fileName already exists

    Inputs: 
            dbPath: a path object that points to the db file

            fileName: a str that is the name of the file

    Return value: 
            True : The file already exists

            False : The file doesn't already exist, it is new
    """
    conn = sqlite3.connect(FILES_DB_PATH)
    c = conn.cursor()

    try:
        c.execute("""SELECT 1 FROM files WHERE fileName=? """,
                  (fileName,))
        
        if c.fetchone() == None:
        
            return False
        else:
            return True
        
    except Exception as e:
        print(f"Failed to check database for duplicate: {e}")
        return True

    finally:
        conn.close()
#End of Check_File_Name_Exists =======================================================================================================================

def Add_Token(token: str, pairedTime: float) -> bool:
    conn = sqlite3.connect(TOKENS_DB_PATH)
    c = conn.cursor()
    try:
        c.execute("""INSERT INTO tokens (token, pairedTime)
                    VALUES (?, ?) """,
                    (token, pairedTime))
        conn.commit()
        return True
    except Exception as e:
        print(f"Error adding device: {e}")
        return False
    finally:
        conn.close()


def Is_Valid_Token(token: str) -> bool:
    if not token:
        return False

    conn = sqlite3.connect(TOKENS_DB_PATH)
    c = conn.cursor()
    try:
        c.execute("""SELECT 1 FROM tokens WHERE token=? """, (token,))
        return c.fetchone() is not None
    except Exception as e:
        print(f"Failed to check tokens table: {e}")
        return False
    finally:
        conn.close()

def Wipe_Files_Database() -> bool:
    """
    Name: Wipe_Files_Database

    Function description: 
        Deletes all rows from the files table, db matches new savePath uploads

    Inputs: None

    Return value: 
            True : wipe successful

            False : wipe failed
    """
    print("wiping")
    conn = sqlite3.connect(FILES_DB_PATH)
    c = conn.cursor()
    try:
        c.execute("""DELETE FROM files""")
        conn.commit()
        return True
    except Exception as e:
        print(f"Error wiping files database: {e}")
        return False
    finally:
        conn.close()
#End of Wipe_Files_Database ================================