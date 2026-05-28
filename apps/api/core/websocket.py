from fastapi import WebSocket
from typing import List, Dict, Any

class WebSocketManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"[WEBSOCKET] New client channel accepted. Active sockets: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            print(f"[WEBSOCKET] Client disconnected. Remaining channels: {len(self.active_connections)}")

    async def broadcast_json(self, message: Dict[str, Any]):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                # Clear broken sockets silently during broadcast sweeps
                pass