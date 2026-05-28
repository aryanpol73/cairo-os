import os
from pathlib import Path
from dotenv import load_dotenv

current_dir = Path(__file__).resolve().parent
env_path = current_dir / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
    print(f"[SYSTEM] Configuration loaded successfully. Key present: { 'GEMINI_API_KEY' in os.environ }")
else:
    print(f"[CRITICAL ERROR] No .env file discovered at {env_path}!")

import asyncio
import json
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
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
    print("[SYSTEM] Frontend WebSocket connection active via State Graph Router.")
    state: SwarmGraphState = {}

    try:
        while True:
            raw_input = await websocket.receive_text()
            payload = json.loads(raw_input)
            is_feedback = payload.get("type") == "feedback"
            user_prompt = payload.get("prompt", "Untitled Scope")
            
            if is_feedback:
                state["prompt"] = f"ORIGINAL GOAL: {state.get('prompt')}\n\nFEEDBACK: {user_prompt}\n\nPlease update the system to reflect this change."
                state["current_phase"] = "architecting"
                state["latest_log"] = {"phase": "architecting", "agent": "SYSTEM", "log": "Initiating live system refactor..."}
            else:
                state = {
                    "prompt": user_prompt,
                    "current_phase": "discovery",
                    "architecture": {"nodes": [], "edges": []},
                    "backlog": {"tasks": []},
                    "generated_code": "",
                    "latest_log": {"phase": "discovery", "agent": "Architect", "log": f"Scanning request: '{user_prompt}'"}
                }
            
            await websocket.send_json({"currentPhase": state["current_phase"], "agent": state["latest_log"]["agent"], "log": state["latest_log"]["log"]})
            await asyncio.sleep(1.0)

            # 1. RUN ARCHITECT
            architect_response = await ArchitectAgent.design_topology(state)
            state.update(architect_response) 
            await websocket.send_json({"currentPhase": "architecting", "agent": "Architect", "log": state["latest_log"]["log"], "architecture": state["architecture"]})
            await asyncio.sleep(2.0)

            # 2. RUN PRODUCT MANAGER
            pm_response = await PMAgent.create_backlog(state)
            state.update(pm_response)
            await websocket.send_json({"currentPhase": "planning", "agent": "Product Mgr", "log": state["latest_log"]["log"], "backlog": state["backlog"]})
            await asyncio.sleep(2.0)

            # 3 & 4. AUTO-HEAL LOOP
            max_iterations = 3
            current_iteration = 0
            qa_passed = False

            while current_iteration < max_iterations and not qa_passed:
                current_iteration += 1
                code_output = await DeveloperAgent.build_codebase(state)
                state["generated_code"] = code_output
                await websocket.send_json({"currentPhase": "implementing", "agent": "Developer", "log": f"Writing code (Attempt {current_iteration}).", "generatedCode": state["generated_code"]})
                await asyncio.sleep(2.0)

                reviewer_response = await ReviewerAgent.audit_code(state)
                is_clean = reviewer_response.get("is_clean", True)
                await websocket.send_json({"currentPhase": "testing", "agent": "QA Tester", "log": reviewer_response["latest_log"]["log"]})
                await asyncio.sleep(1.5)

                if is_clean:
                    qa_passed = True
                else:
                    feedback = reviewer_response.get("feedback", "Unknown error.")
                    state["prompt"] += f"\n\n[SYSTEM OVERRIDE - QA FAILED]: Please fix these exact errors: {feedback}"
                    await websocket.send_json({"currentPhase": "testing", "agent": "QA Tester", "log": "Vulnerabilities detected! Returning to Developer..."})
                    await asyncio.sleep(2.0)

            # 5 & 6. SAVE & DISK
            project_id = await db.save_project(state)
            if project_id > 0:
                await disk_writer.write_project_files(project_id, state["generated_code"])

            await websocket.send_json({"currentPhase": "stable", "agent": "SYSTEM", "log": f"CAIRO_OS_PIPELINE_STABLE: Saved as Project #{project_id}"})
    except WebSocketDisconnect:
        print("[SYSTEM] Active state pipeline channel closed.")

# --- NEW REST API FOR UI HISTORY BROWSER ---
@app.get("/api/projects")
async def get_projects():
    data = await asyncio.to_thread(db.get_all)
    return {"projects": data}

@app.get("/api/projects/{project_id}")
async def get_project(project_id: int):
    data = await asyncio.to_thread(db.get_one, project_id)
    if data:
        return data
    return {"error": "Project not found"}