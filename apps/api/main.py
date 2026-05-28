import os
import asyncio
import json
from pathlib import Path
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# --- PRODUCTION SAFE CONFIG LOADING ---
# We check if .env exists locally, but we DO NOT crash if it's missing.
# Render will inject GEMINI_API_KEY as an OS Environment Variable instead.
env_path = Path(__file__).resolve().parent / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
    print("[SYSTEM] Local .env loaded.")
else:
    print("[SYSTEM] No .env file found. Assuming system environment variables.")

# Now that config is loaded (or skipped), we can safely import our modules
# that might depend on the API key being present in os.environ
from core.database import db
from core.disk_writer import disk_writer
from models.schemas import SwarmGraphState
from agents.architect import ArchitectAgent
from agents.pm import PMAgent
from agents.engineers import DeveloperAgent
from agents.reviewer import ReviewerAgent

app = FastAPI(title="Cairo OS Agent Core Engine", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.websocket("/ws/orchestrate")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("[SYSTEM] Frontend WebSocket connection active.")
    state: SwarmGraphState = {}

    try:
        while True:
            raw_input = await websocket.receive_text()
            payload = json.loads(raw_input)
            is_feedback = payload.get("type") == "feedback"
            user_prompt = payload.get("prompt", "Untitled Scope")
            
            if is_feedback:
                state["prompt"] = f"ORIGINAL GOAL: {state.get('prompt')}\n\nFEEDBACK: {user_prompt}"
                state["current_phase"] = "architecting"
            else:
                state = {
                    "prompt": user_prompt,
                    "current_phase": "discovery",
                    "architecture": {"nodes": [], "edges": []},
                    "backlog": {"tasks": []},
                    "generated_code": "",
                    "latest_log": {"phase": "discovery", "agent": "Architect", "log": "Scanning..."}
                }
            
            # Run agents... (your existing agent logic remains the same here)
            # [Keep your existing logic for Architect, PM, Developer, Reviewer...]
            
    except WebSocketDisconnect:
        print("[SYSTEM] Pipeline closed.")

@app.get("/api/projects")
async def get_projects():
    # Use to_thread to keep the event loop non-blocking
    data = await asyncio.to_thread(db.get_all)
    return {"projects": data}

@app.get("/api/projects/{project_id}")
async def get_project(project_id: int):
    data = await asyncio.to_thread(db.get_one, project_id)
    return data if data else {"error": "Project not found"}