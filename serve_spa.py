"""
FastAPI/Uvicorn server for serving React SPA with proper routing
"""
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path

app = FastAPI()

# Path to your built React app
DIST_DIR = Path(__file__).parent / "dist"

# Serve static files (JS, CSS, images, etc.)
app.mount("/assets", StaticFiles(directory=DIST_DIR / "assets"), name="assets")

# Serve any static files in root (favicon, etc.)
@app.get("/favicon.ico")
async def favicon():
    return FileResponse(DIST_DIR / "favicon.ico")

@app.get("/vite.svg")
async def vite_svg():
    return FileResponse(DIST_DIR / "vite.svg")

# Catch-all route: serve index.html for all other routes (SPA routing)
@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    """
    Serve index.html for all routes to enable client-side routing.
    This is essential for React Router to work properly.
    """
    return FileResponse(DIST_DIR / "index.html")

if __name__ == "__main__":
    import uvicorn
    # Disable websockets to avoid compatibility issues
    uvicorn.run(app, host="0.0.0.0", port=8000, ws="none")
