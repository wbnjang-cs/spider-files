# Spider Files *(Formerly myDrive)*

Spider Files is a self-hosted, local file backup tool for Windows. Once you run it on your PC, you can pair a device that is on the same WiFi network and upload or download files between them.

# Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Quick Start](#quick-start)
4. [How It Works](#how-it-works)
5. [Tech Stack](#tech-stack)
6. [Architecture](#architecture)
7. [Known Bugs](#known-bugs)

# Features

- **Privacy**: Files are handled completely locally, as they will only move within your wifi network and never enter an external/3rd party cloud.
  
- **Device pairing**: You can connect a device (phone, tablet, etc) to your PC using a one-time code, bypassing the need for an account
  
- **Duplicate detection**: We prevent re-uploading duplicate files using SHA-256 hashing with local SQLite database to track uploaded files.
  
- **Upload & download**: You can send files from your device to your PC, or browse and pull files from your PC to your device.
  
- **Folder browsing**: You can easily pick save locations or select files to download through a built-in file browser, including quick access to Desktop/Downloads/Documents.
  
- **Completely background**: The app runs in the Windows system tray. This combined with a launch on startup option makes it so you rarely have to interact with the app after initial setup.
  
- **Simple installer**: You can install Spider Files with a one-click Windows setup via Inno Setup. No commands or manual configuration required.

# Installation

1. Download SpiderFile-Setup.exe from the [Releases](https://github.com/wbnjang-cs/spider-files/releases/latest) page

2. Run the installer

3. Launch Spider Files
   - Spider Files will launch in the windows tray.

# Quick Start

1. Right-click the Spider Files tray icon and select Show/Copy URL to get your PC's local address
   
2. On your device (it MUST be on the same WiFi network), open that address in a browser

3. Tap Pair, then enter the one-time code shown in the popup on your PC

4. Once paired, use the File menu to upload from your phone or browse/download from your PC
   - Pairing can be disabled at any time from the tray icon menu if you don't want new devices to connect.

# How It Works

- Your PC runs Spider Files in the background (It will be a tray icon)
  
- Any device on the same WiFi network can open that website in a browser, with no app install required on the client side.
  
- Your device needs to pair before it can upload and download files from your computer (Reference Quick Start portion to learn how)
  
- Uploaded files are kept track of, so duplicate files aren't stored twice.

- Uploading two files with the same content or uploading two files with the same name to the same directory will be blocked.

# Tech Stack

- Backend: Python, FastAPI, SQLite
  
- Frontend: React + Vite, built to static files and served directly by FastAPI
  
- Packaging: pystray + Pillow (system tray app), Inno Setup (Windows installer)

# Architecture

## Pairing & Auth

- PC displays a 3-minute one-time code via a popup (/pair/start)
  
- The connecting device submits the code (/pair); the server issues a per-device token and stores it in a tokens table
  
- All upload/download endpoints require a valid token; /pair/start and /pair are the only unauthenticated routes
  
- Pairing can be toggled on/off from the tray menu and is persisted in config.json

- You can manage all paired devices in the config menu

## Security

- More than 5 attempts to pair within 10 seconds will turn off pairing until it is turned back on in the tray app.
  
- Getting the pairing code wrong more than 5 times will lock you out of pairing for 60 seconds

- Uploaded file names are sanitized and save paths are resolved so uploads cannot escape the chosen folder

## File Handling

- Uploads go through multipart form data, are hashed, and checked against SQLite for duplicates before being saved
  
- A built-in directory browser (/browse) lets users pick a save location or select files to download, with support for navigating drives, quick-access folders, and creating new sub directories
  
- file downloads are zipped server-side before being sent.

## Storage

- Config and databases are stored in %APPDATA%\Spider Files, so they persist correctly once installed to Program Files
  
- Default save path is the user's Downloads folder, but can be changed by the user any time

## Deployment

- The React frontend is built to static files and mounted directly by FastAPI, so the whole app runs as a single process on a single port
  
- The server binds to 0.0.0.0 so it's reachable from any device on the LAN, with CORS enabled for cross-origin requests from the phone's browser

## Known Bugs

- Brave browser on mobile will not allow connection to application
