# tray.py
import threading
import webbrowser
import os
import pystray
from PIL import Image
from paths import resource_path
from utils import GetPairingEnabled, SetPairingEnabled, GetIP
import tkinter as tk

def start_server():
    try:
        from main import app
        import uvicorn
        uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info", log_config=None)
    except Exception as e:
        import traceback
        log_path = os.path.join(os.environ["APPDATA"], "Spider Files", "crash.log")
        with open(log_path, "w") as f:
            f.write(traceback.format_exc())


def on_open(icon, item):
    webbrowser.open("http://localhost:8000")


def on_quit(icon, item):
    icon.stop()
    os._exit(0)


def toggle_pairing(icon, item):
    SetPairingEnabled(not GetPairingEnabled())
    icon.update_menu()

def pairing_checked(item):
    return GetPairingEnabled()

def show_url_popup():
    url = f"http://{GetIP()}:8000"

    root = tk.Tk()
    root.title("Spider File")
    root.attributes("-topmost", True)

    root.clipboard_clear()
    root.clipboard_append(url)
    root.update()

    tk.Label(root, text=url, font=("Segoe UI", 14)).pack(padx=20, pady=10)
    tk.Label(root, text="(copied to clipboard)", font=("Segoe UI", 9), fg="gray").pack(padx=20, pady=(0, 15))

    root.after(8000, root.destroy)
    root.mainloop()
def on_show_url(icon, item):
    threading.Thread(target=show_url_popup, daemon=True).start()

def build_menu():
    return pystray.Menu(
        pystray.MenuItem("Open Spider Files", on_open),
        pystray.MenuItem("Show/Copy URL", on_show_url),
        pystray.MenuItem("Pairing Enabled", toggle_pairing, checked=pairing_checked),
        pystray.MenuItem("Quit", on_quit),
    )

if __name__ == "__main__":
    server_thread = threading.Thread(target=start_server, daemon=True)
    server_thread.start()

    icon = pystray.Icon(
        "Spider Files",
        Image.open(resource_path("SpiderFileIcon.png")),
        "Spider Files",
        menu=build_menu(),
    )
    icon.run()