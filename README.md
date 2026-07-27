Title: MyDrive — A Local File Backup Tool

myDrive is a local file backup tool built with FastAPI. It ensures data integrity and prevents redundant uploads using SHA-256 file hashing,
safely handles file writes to avoid corruption on failure, and automatically initializes its own database and config files on first run.

A web frontend is currently in progress. For now, the API is used directly via browser or a tool like Postman.



Feature List:

1. Duplicate prevention & integrity checks : Files are hashed with SHA-256 before being stored, so identical files aren't uploaded again
2. Safe file writes : Uses temporary file handling during writes, so a crash or failure mid-write won't lead to corrupt files
3. Self-initializing : On startup, automatically checks for and creates the local SQLite database and any required config files in case they get deleted.
4. Lightweight local storage : Uses SQLite for tracking current files, no external database required.




Tech Stack

Backend: Python, FastAPI
Database: SQLite
Data handling: JSON, SHA-256 hashing




Getting Started

1. Prerequisites
- Python 3.9+
- pip

2. Installation

(bash)
git clone https://github.com/wbnjang-cs/myDrive.git
cd myDrive
pip install -r requirements.txt


Running the server

(bash)
uvicorn main:app --reload --host 0.0.0.0 --port 8000


The API will be available at http://127.0.0.1:8000 on your own machine, or http://<your-local-IP>:8000 from other devices on the same network.

The easiest way to use myDrive is with FastAPI's interactive docs (available at http://127.0.0.1:8000/docs),
otherwise using Postman would be the next best option.

No additional configuration is required — the app will automatically create its local database and config files on first run.

Usage

Once the server is running, you can interact with the API through:
1. The Swagger UI at http://127.0.0.1:8000/docs (recommended for quick testing)
2. Postman or any HTTP client
3. curl` requests from the command line


Roadmap

1. Web frontend for uploading/managing backups
2. Additional endpoint documentation
3. Deployment instructions
