import sqlite3
import json
import asyncio
from pathlib import Path

class DatabaseService:
    def __init__(self):
        self.db_path = Path(__file__).resolve().parent.parent / "cairo_os.db"
        self._init_db()

    def _init_db(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS projects (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    prompt TEXT,
                    architecture TEXT,
                    backlog TEXT,
                    codebase TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            """)
            print(f"[DATABASE] Local SQLite engine mounted at {self.db_path.name}")

    async def save_project(self, state: dict) -> int:
        def _save():
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    INSERT INTO projects (prompt, architecture, backlog, codebase)
                    VALUES (?, ?, ?, ?)
                """, (
                    state.get("prompt", "Untitled"),
                    json.dumps(state.get("architecture", {})),
                    json.dumps(state.get("backlog", {})),
                    state.get("generated_code", "")
                ))
                conn.commit()
                return cursor.lastrowid
        try:
            project_id = await asyncio.to_thread(_save)
            print(f"[DATABASE] Memory committed. Project saved with ID: {project_id}")
            return project_id
        except Exception as e:
            print(f"[DATABASE ERROR] Failed to save memory: {e}")
            return -1

    def get_all(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("SELECT id, prompt, created_at FROM projects ORDER BY created_at DESC")
            return [dict(row) for row in cursor.fetchall()]

    def get_one(self, project_id: int):
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM projects WHERE id = ?", (project_id,))
            row = cursor.fetchone()
            if row:
                data = dict(row)
                data["architecture"] = json.loads(data["architecture"]) if data["architecture"] else {"nodes": [], "edges": []}
                data["backlog"] = json.loads(data["backlog"]) if data["backlog"] else {"tasks": []}
                return data
            return None

db = DatabaseService()